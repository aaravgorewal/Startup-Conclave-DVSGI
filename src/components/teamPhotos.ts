// STARTUP CONCLAVE 1.0 — TEAM PHOTOS HELPER
// Loads photos from assets/team matching filename or slug (lowercase name with hyphens)

const teamPhotoModules = import.meta.glob<{ default: string } | string>(
  '../assets/team/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);

/**
 * Returns the photo asset URL for a team member.
 * If photo is non-empty, matches against the team photo map by filename.
 * If photo is empty, auto-matches by slug of the name (lowercase, spaces to hyphens, e.g. nitika-ruhela).
 * Returns undefined if no file matches so the initials tile can be shown. Never throws.
 */
export const getTeamMemberPhoto = (
  name: string,
  explicitPhoto?: string
): string | undefined => {
  try {
    const trimmedPhoto = explicitPhoto?.trim();

    if (trimmedPhoto) {
      // Treat as a filename inside src/assets/team/
      const cleanPhotoName = trimmedPhoto.split('/').pop()?.toLowerCase();
      if (!cleanPhotoName) return undefined;

      const targetBase = cleanPhotoName.replace(/\.(jpg|jpeg|png|webp)$/i, '');

      for (const [path, mod] of Object.entries(teamPhotoModules)) {
        const fileName = path.split('/').pop()?.toLowerCase();
        if (fileName) {
          const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
          if (fileName === cleanPhotoName || baseName === targetBase) {
            return typeof mod === 'string' ? mod : (mod as any)?.default;
          }
        }
      }
      return undefined;
    }

    // If photo is empty, auto-match by slug of the name (lowercase, spaces to hyphens, e.g. nitika-ruhela)
    if (!name || typeof name !== 'string' || !name.trim()) return undefined;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '');

    if (!slug) return undefined;

    for (const [path, mod] of Object.entries(teamPhotoModules)) {
      const fileName = path.split('/').pop()?.toLowerCase();
      if (fileName) {
        const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
        if (baseName === slug) {
          return typeof mod === 'string' ? mod : (mod as any)?.default;
        }
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
};
