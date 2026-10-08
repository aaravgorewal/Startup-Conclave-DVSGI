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

/**
 * Returns a valid participant registration payload
 */
const getValidParticipantData = (email = 'participant@example.com') => ({
  id: 'SC1-00001',
  registrationId: 'SC1-00001',
  ticketCode: 'A1B2C3D4E5F6G7H8',
  sequenceNumber: 1,
  emailHash: 'hash_participant_email_1',
  name: 'Aarav Saini',
  email: email,
  emailLower: email.toLowerCase(),
  phone: '9876543210',
  college: {
    name: 'DVSIET Meerut',
    state: 'Uttar Pradesh',
    city: 'Meerut',
    type: 'College',
    listed: true,
  },
  role: 'Student',
  ticket: 'participant',
  status: 'registered',
  createdAt: serverTimestamp(),
  payment: {
    required: false,
    status: 'not_required',
    amountPaise: 0,
  },
});

/**
 * Returns a valid pitch registration payload
 */
const getValidPitchData = (email = 'founder@example.com', utr = '123456789012') => ({
  id: 'SC1-00002',
  registrationId: 'SC1-00002',
  ticketCode: 'A1B2C3D4E5F6G7H8',
  sequenceNumber: 2,
  emailHash: 'hash_pitch_email_1',
  name: 'Startup Founder',
  email: email,
  emailLower: email.toLowerCase(),
  phone: '9876543211',
  college: {
    name: 'DVSIET Meerut',
    state: 'Uttar Pradesh',
    city: 'Meerut',
    type: 'College',
    listed: true,
  },
  role: 'Founder',
  ticket: 'pitch',
  wantsToPitch: true,
  startupName: 'NextGen AI',
  startupPitch: 'Autonomous AI workflow platform',
  sector: 'Technology',
  stage: 'Prototype',
  pitchDeckLink: 'https://drive.google.com/file/d/pitch123',
  teamSize: '3',
  status: 'registered',
  createdAt: serverTimestamp(),
  payment: {
    required: true,
    status: 'pending',
    amountPaise: 99900,
    method: 'upi',
    utr: utr,
  },
});

/**
 * Returns a valid phoneIndex payload
 */
const getValidPhoneIndexData = (phoneHash = 'hash_phone_1', regId = 'SC1-00001') => ({
  registrationId: regId,
  emailHash: 'hash_participant_email_1',
  phoneHash,
  createdAt: serverTimestamp(),
});

/**
 * Returns a valid utrIndex payload
 */
const getValidUtrIndexData = (utr = '123456789012', regId = 'SC1-00002') => ({
  registrationId: regId,
  emailHash: 'hash_pitch_email_1',
  utr,
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

  // -------------------------------------------------------------------------
  // 1. UNVERIFIED USER & TICKET CODE REGISTRATION ENFORCEMENT
  // -------------------------------------------------------------------------
  describe('1. Unverified user & ticket code registration enforcement', () => {
    it('unauthenticated user cannot create a registration', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const regRef = doc(db, 'registrations', 'hash_participant_email_1');
      await assertFails(setDoc(regRef, getValidParticipantData('unauth@example.com')));
    });

    it('registration creation without ticketCode is rejected', async () => {
      const userEmail = 'noticketcode@example.com';
      const db = testEnv.authenticatedContext('user_noticket', {
        email: userEmail,
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', 'hash_noticket');
      const dataWithoutTicketCode: any = getValidParticipantData(userEmail);
      delete dataWithoutTicketCode.ticketCode;
      await assertFails(setDoc(regRef, dataWithoutTicketCode));
    });

    it('authenticated user with email_verified = false cannot create a registration', async () => {
      const db = testEnv.authenticatedContext('user_unverified_1', {
        email: 'unverified@example.com',
        email_verified: false,
      }).firestore();
      const regRef = doc(db, 'registrations', 'hash_participant_email_1');
      await assertFails(setDoc(regRef, getValidParticipantData('unverified@example.com')));
    });
  });

  // -------------------------------------------------------------------------
  // 2. VERIFIED USER CAN CREATE ONLY WITH MATCHING emailLower
  // -------------------------------------------------------------------------
  describe('2. Verified user emailLower validation', () => {
    it('verified user can create registration when emailLower exactly matches auth email', async () => {
      const userEmail = 'verified.student@example.com';
      const db = testEnv.authenticatedContext('user_verified_1', {
        email: userEmail,
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', 'hash_participant_email_1');

      await assertSucceeds(setDoc(regRef, getValidParticipantData(userEmail)));
    });

    it('verified user CANNOT create registration if emailLower does not match auth email', async () => {
      const authEmail = 'legit.user@example.com';
      const spoofedEmail = 'impostor@example.com';
      const db = testEnv.authenticatedContext('user_verified_2', {
        email: authEmail,
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', 'hash_spoofed_email');

      // Attempting to submit registration with a different emailLower than the auth token email
      const payload = getValidParticipantData(spoofedEmail);
      await assertFails(setDoc(regRef, payload));
    });

    it('verified user CANNOT create registration when emailLower field is missing', async () => {
      const authEmail = 'valid@example.com';
      const db = testEnv.authenticatedContext('user_verified_3', {
        email: authEmail,
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', 'hash_missing_email_lower');

      const payload = getValidParticipantData(authEmail);
      // Delete emailLower to simulate payload omission
      delete (payload as Record<string, unknown>).emailLower;

      await assertFails(setDoc(regRef, payload));
    });

    it('verified pitch registration succeeds atomically with matching utrIndex in batch', async () => {
      const founderEmail = 'founder@example.com';
      const utr = '987654321012';
      const db = testEnv.authenticatedContext('founder_uid_1', {
        email: founderEmail,
        email_verified: true,
      }).firestore();

      const batch = writeBatch(db);
      const regRef = doc(db, 'registrations', 'hash_pitch_email_1');
      const utrRef = doc(db, 'utrIndex', utr);

      batch.set(regRef, getValidPitchData(founderEmail, utr));
      batch.set(utrRef, getValidUtrIndexData(utr));

      await assertSucceeds(batch.commit());
    });
  });

  // -------------------------------------------------------------------------
  // 3. DUPLICATE EMAIL / PHONE / UTR REJECTED
  // -------------------------------------------------------------------------
  describe('3. Deduplication rejection (email, phone, UTR)', () => {
    it('duplicate email (same registration doc ID) is rejected on second create attempt', async () => {
      const userEmail = 'duplicate.test@example.com';
      const db = testEnv.authenticatedContext('user_dup_1', {
        email: userEmail,
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', 'hash_participant_email_1');

      // First creation succeeds
      await assertSucceeds(setDoc(regRef, getValidParticipantData(userEmail)));

      // Duplicate registration on same doc ID acts as an update and must be rejected for non-admins
      await assertFails(setDoc(regRef, getValidParticipantData(userEmail)));
    });

    it('duplicate phone (same phoneIndex doc ID) is rejected on second create attempt', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const phoneRef = doc(db, 'phoneIndex', 'hash_phone_duplicate');

      // First phone index doc creation succeeds
      await assertSucceeds(setDoc(phoneRef, getValidPhoneIndexData('hash_phone_duplicate')));

      // Duplicate creation on same phone hash is an update and must fail
      await assertFails(setDoc(phoneRef, getValidPhoneIndexData('hash_phone_duplicate')));
    });

    it('duplicate UTR (same utrIndex doc ID) is rejected on second create attempt', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const duplicateUtr = '555666777888';
      const utrRef = doc(db, 'utrIndex', duplicateUtr);

      // First UTR index doc creation succeeds
      await assertSucceeds(setDoc(utrRef, getValidUtrIndexData(duplicateUtr)));

      // Duplicate creation on same UTR is an update and must fail
      await assertFails(setDoc(utrRef, getValidUtrIndexData(duplicateUtr)));
    });
  });

  // -------------------------------------------------------------------------
  // 4. CLIENT CANNOT SET payment.status TO 'verified'
  // -------------------------------------------------------------------------
  describe('4. Client cannot set payment.status to verified', () => {
    it('client cannot create participant registration with payment.status = verified', async () => {
      const email = 'participant.tamper@example.com';
      const db = testEnv.authenticatedContext('user_tamper_1', {
        email,
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', 'hash_tamper_1');

      const tamperedPayload = {
        ...getValidParticipantData(email),
        payment: {
          required: false,
          status: 'verified', // Malicious attempt to self-verify
          amountPaise: 0,
        },
      };

      await assertFails(setDoc(regRef, tamperedPayload));
    });

    it('client cannot create pitch registration with payment.status = verified', async () => {
      const email = 'pitch.tamper@example.com';
      const utr = '111222333444';
      const db = testEnv.authenticatedContext('user_tamper_2', {
        email,
        email_verified: true,
      }).firestore();

      const batch = writeBatch(db);
      const regRef = doc(db, 'registrations', 'hash_tamper_2');
      const utrRef = doc(db, 'utrIndex', utr);

      const tamperedPitch = {
        ...getValidPitchData(email, utr),
        payment: {
          required: true,
          status: 'verified', // Malicious attempt to bypass admin verification
          amountPaise: 99900,
          method: 'upi',
          utr,
        },
      };

      batch.set(regRef, tamperedPitch);
      batch.set(utrRef, getValidUtrIndexData(utr));

      await assertFails(batch.commit());
    });

    it('client cannot update an existing registration to payment.status = verified', async () => {
      const email = 'existing.attendee@example.com';
      const regId = 'hash_existing_attendee';

      // Seed valid registration with admin privileges disabled
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const rootDb = ctx.firestore();
        await setDoc(doc(rootDb, 'registrations', regId), getValidParticipantData(email));
      });

      // Regular signed-in attendee attempts to update payment.status
      const db = testEnv.authenticatedContext('user_regular_attempt', {
        email,
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', regId);

      await assertFails(updateDoc(regRef, {
        'payment.status': 'verified',
        paymentStatus: 'verified',
      }));
    });
  });

  // -------------------------------------------------------------------------
  // 5. NON-ADMIN CANNOT READ REGISTRATIONS
  // -------------------------------------------------------------------------
  describe('5. Non-admin read protection', () => {
    const regId = 'hash_private_reg_1';

    beforeEach(async () => {
      // Seed a registration
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const rootDb = ctx.firestore();
        await setDoc(doc(rootDb, 'registrations', regId), getValidParticipantData('private@example.com'));
      });
    });

    it('unauthenticated visitor cannot read registrations', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const regRef = doc(db, 'registrations', regId);
      await assertFails(getDoc(regRef));
    });

    it('authenticated non-admin user (uid not in admins collection) cannot read registrations', async () => {
      const db = testEnv.authenticatedContext('regular_user_non_admin', {
        email: 'regular@example.com',
        email_verified: true,
      }).firestore();
      const regRef = doc(db, 'registrations', regId);
      await assertFails(getDoc(regRef));
    });
  });

  // -------------------------------------------------------------------------
  // 6. ADMIN (uid in admins collection) CAN READ, UPDATE, DELETE
  // -------------------------------------------------------------------------
  describe('6. Admin authorisation (uid in admins collection)', () => {
    const adminUid = 'verified_admin_uid_777';
    const regId = 'hash_admin_managed_reg';

    beforeEach(async () => {
      // Seed an admin document in admins collection and a sample registration
      await testEnv.withSecurityRulesDisabled(async (ctx) => {
        const rootDb = ctx.firestore();
        await setDoc(doc(rootDb, 'admins', adminUid), { role: 'admin', active: true });
        await setDoc(doc(rootDb, 'registrations', regId), getValidPitchData('pitcher@example.com', '777888999000'));
      });
    });

    it('admin with uid in admins collection can read registrations', async () => {
      const db = testEnv.authenticatedContext(adminUid).firestore();
      const regRef = doc(db, 'registrations', regId);
      await assertSucceeds(getDoc(regRef));
    });

    it('admin with uid in admins collection can update registrations (e.g. mark payment verified)', async () => {
      const db = testEnv.authenticatedContext(adminUid).firestore();
      const regRef = doc(db, 'registrations', regId);
      await assertSucceeds(
        updateDoc(regRef, {
          'payment.status': 'verified',
          'payment.verifiedBy': adminUid,
          status: 'confirmed',
        })
      );
    });

    it('admin cannot mutate existing ticketCode (strictly immutable on update)', async () => {
      const db = testEnv.authenticatedContext(adminUid).firestore();
      const regRef = doc(db, 'registrations', regId);
      await assertFails(
        updateDoc(regRef, {
          ticketCode: 'MUTATED_CODE_999',
        })
      );
    });

    it('admin with uid in admins collection can delete registrations', async () => {
      const db = testEnv.authenticatedContext(adminUid).firestore();
      const regRef = doc(db, 'registrations', regId);
      await assertSucceeds(deleteDoc(regRef));
    });
  });

  // -------------------------------------------------------------------------
  // 7. ADDITIONAL SECURITY INVARIANTS (mail, admins, settings)
  // -------------------------------------------------------------------------
  describe('7. Additional collection security invariants', () => {
    it('public and authenticated clients cannot write to mail collection', async () => {
      const db = testEnv.authenticatedContext('attacker_uid', {
        email: 'attacker@example.com',
        email_verified: true,
      }).firestore();
      const mailRef = doc(db, 'mail', 'spam_attempt');

      await assertFails(
        setDoc(mailRef, {
          to: ['victim@example.com'],
          message: { subject: 'Spam Relay', text: 'Unauthorised' },
        })
      );
    });

    it('regular users cannot add themselves to admins collection', async () => {
      const attackerUid = 'attacker_uid_99';
      const db = testEnv.authenticatedContext(attackerUid, {
        email: 'attacker@example.com',
        email_verified: true,
      }).firestore();
      const adminRef = doc(db, 'admins', attackerUid);

      await assertFails(setDoc(adminRef, { role: 'admin' }));
    });
  });

  // -------------------------------------------------------------------------
  // 8. PARTNER ENQUIRIES (public can create valid, cannot read or modify)
  // -------------------------------------------------------------------------
  describe('8. Partner Enquiries collection', () => {
    it('public can create partner enquiry with partnershipType and contributionRange', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const enquiryRef = doc(db, 'partnerEnquiries', 'enquiry_test_1');

      await assertSucceeds(
        setDoc(enquiryRef, {
          company: 'Acme Ventures',
          contactName: 'Priya Sharma',
          email: 'priya@acme.com',
          phone: '9876543210',
          partnershipType: 'Cash',
          contributionRange: '₹50,000 – ₹1,00,000',
          message: 'Interested in title sponsorship tier.',
          status: 'new',
          createdAt: serverTimestamp(),
        })
      );
    });

    it('partner enquiry with invalid extra keys is rejected', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const enquiryRef = doc(db, 'partnerEnquiries', 'enquiry_test_invalid');

      await assertFails(
        setDoc(enquiryRef, {
          company: 'Acme Ventures',
          contactName: 'Priya Sharma',
          email: 'priya@acme.com',
          status: 'new',
          createdAt: serverTimestamp(),
          unauthorizedField: 'malicious',
        })
      );
    });

    it('unauthenticated public cannot read partnerEnquiries', async () => {
      const db = testEnv.unauthenticatedContext().firestore();
      const enquiryRef = doc(db, 'partnerEnquiries', 'enquiry_test_1');
      await assertFails(getDoc(enquiryRef));
    });
  });
});

