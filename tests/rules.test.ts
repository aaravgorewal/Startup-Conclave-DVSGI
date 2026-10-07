import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, before, after, beforeEach } from 'node:test';

const PROJECT_ID = 'client-hunting-472203';
const RULES_PATH = path.resolve(import.meta.dirname, '../firestore.rules');

let testEnv: RulesTestEnvironment;

const getValidRegistrationData = () => ({
  id: 'SC1-00001',
  registrationId: 'SC1-00001',
  sequenceNumber: 1,
  emailHash: 'hash_test_email_1',
  name: 'Aarav Saini',
  email: 'test@example.com',
  phone: '9876543210',
  college: 'DVSIET',
  role: 'Student',
  status: 'registered',
  createdAt: serverTimestamp(),
});

const getValidPhoneIndexData = (phoneHash = 'hash_phone_1') => ({
  registrationId: 'SC1-00001',
  emailHash: 'hash_test_email_1',
  phoneHash,
  createdAt: serverTimestamp(),
});

describe('Firestore Security Rules Unit Tests', () => {
  before(async () => {
    const rules = fs.readFileSync(RULES_PATH, 'utf8');
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it('public can create a valid registration; cannot read/update/delete it', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const regRef = doc(db, 'registrations', 'hash_test_email_1');

    // Public create succeeds
    await assertSucceeds(setDoc(regRef, getValidRegistrationData()));

    // Public read, update, delete fail
    await assertFails(getDoc(regRef));
    await assertFails(updateDoc(regRef, { name: 'Attempted Name Change' }));
    await assertFails(deleteDoc(regRef));
  });

  it('duplicate email (same doc id) fails; duplicate phone (same phoneIndex id) fails', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const regRef = doc(db, 'registrations', 'hash_test_email_1');
    const phoneRef = doc(db, 'phoneIndex', 'hash_phone_1');

    // First creation succeeds
    await assertSucceeds(setDoc(regRef, getValidRegistrationData()));
    await assertSucceeds(setDoc(phoneRef, getValidPhoneIndexData('hash_phone_1')));

    // Duplicate email (second setDoc on same doc id) acts as an update and fails
    await assertFails(setDoc(regRef, getValidRegistrationData()));

    // Duplicate phone (second setDoc on same phoneIndex id) fails
    await assertFails(setDoc(phoneRef, getValidPhoneIndexData('hash_phone_1')));
  });

  it('public cannot write to mail, admins, settings', async () => {
    const db = testEnv.unauthenticatedContext().firestore();

    // Mail collection
    const mailRef = doc(db, 'mail', 'mail_001');
    await assertFails(setDoc(mailRef, { to: ['test@example.com'], message: { subject: 'Test' } }));

    // Admins collection
    const adminRef = doc(db, 'admins', 'admin_001');
    await assertFails(setDoc(adminRef, { role: 'admin' }));

    // Settings collection
    const settingsRef = doc(db, 'settings', 'event');
    await assertFails(setDoc(settingsRef, { registrationCap: 1000 }));
  });

  it('public client cannot create or access any document in the mail collection (P2)', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const mailRef = doc(db, 'mail', 'unauthorized_spam_relay');

    // Create fails
    await assertFails(
      setDoc(mailRef, {
        to: ['victim@example.com'],
        message: { subject: 'Spam Relay Attempt', text: 'Spam body' },
      })
    );

    // Read fails
    await assertFails(getDoc(mailRef));

    // Update fails
    await assertFails(updateDoc(mailRef, { status: 'sent' }));

    // Delete fails
    await assertFails(deleteDoc(mailRef));
  });

  it('a signed-in user WITHOUT an admins/{uid} document cannot read registrations', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const adminDb = ctx.firestore();
      await setDoc(doc(adminDb, 'registrations', 'hash_test_email_1'), getValidRegistrationData());
    });

    const userDb = testEnv.authenticatedContext('regular_user_123').firestore();
    const regRef = doc(userDb, 'registrations', 'hash_test_email_1');

    await assertFails(getDoc(regRef));
  });

  it('a signed-in user WITH admins/{uid} can read, update, delete', async () => {
    const adminUid = 'admin_user_456';

    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const adminDb = ctx.firestore();
      await setDoc(doc(adminDb, 'admins', adminUid), { role: 'admin', active: true });
      await setDoc(doc(adminDb, 'registrations', 'hash_test_email_1'), getValidRegistrationData());
    });

    const adminDb = testEnv.authenticatedContext(adminUid).firestore();
    const regRef = doc(adminDb, 'registrations', 'hash_test_email_1');

    await assertSucceeds(getDoc(regRef));
    await assertSucceeds(updateDoc(regRef, { status: 'confirmed' }));
    await assertSucceeds(deleteDoc(regRef));
  });

  it('counters/registrations cannot be incremented without a matching new registration', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const counterRef = doc(db, 'counters', 'registrations');

    // Standalone increment without a matching registration document in batch fails
    await assertFails(
      setDoc(counterRef, {
        currentCount: 1,
        lastEmailHash: 'missing_email_hash',
        updatedAt: serverTimestamp(),
      })
    );

    // Atomic batch write with both counter and matching registration succeeds
    const batch = writeBatch(db);
    const emailHash = 'hash_atomic_email_1';
    const regRef = doc(db, 'registrations', emailHash);

    batch.set(counterRef, {
      currentCount: 1,
      lastEmailHash: emailHash,
      updatedAt: serverTimestamp(),
    });
    batch.set(regRef, {
      ...getValidRegistrationData(),
      sequenceNumber: 1,
      emailHash,
    });

    await assertSucceeds(batch.commit());
  });
});
