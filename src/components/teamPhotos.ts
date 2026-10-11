// STARTUP CONCLAVE 1.0 — TEAM PHOTOS HELPER
// Loads photos from assets/team matching slug (lowercase name with hyphens)

const teamPhotoModules = import.meta.glob<{ default: string } | string>(
  '../assets/team/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);

/**
 * Returns the photo asset URL for a team member by matching their name slug,
 * or returns the explicitly provided photo if present.
 */
export const getTeamMemberPhoto = (
  name: string,
  explicitPhoto?: string
): string | undefined => {
  if (explicitPhoto) return explicitPhoto;
  if (!name || !name.trim()) return undefined;

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

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
};
