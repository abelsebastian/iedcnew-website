// Pure, framework-agnostic validation helpers for student profile fields.
//
// These functions are the single source of truth for the per-field domain
// bounds described in the Community Platform requirements. The profile UI and
// any create/update endpoints should reuse them so the client and server agree
// on what counts as a valid profile.
//
// Requirements: 2.4, 2.5, 2.6, 2.7
// Design: Property 17 (Input validation domain bounds)

// ---------------------------------------------------------------------------
// Domain bound constants
// ---------------------------------------------------------------------------

/** Req 2.4: a profile may set up to 20 skills. */
export const MAX_SKILLS = 20;
/** Req 2.4: each skill is between 2 and 40 characters (inclusive). */
export const SKILL_MIN_LENGTH = 2;
export const SKILL_MAX_LENGTH = 40;

/** Req 2.5: a profile may set up to 6 social links. */
export const MAX_SOCIAL_LINKS = 6;

/**
 * Req 2.5: social links must come from this allow-list of platforms
 * (LinkedIn, GitHub, X/Twitter, personal website, Instagram, Behance).
 */
export const SOCIAL_PLATFORMS = [
  "linkedin",
  "github",
  "twitter",
  "website",
  "instagram",
  "behance",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

/** Req 2.6: avatar image of at most 2 MB. */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
/** Req 2.6: avatar dimensions at most 1024 x 1024 pixels. */
export const AVATAR_MAX_DIMENSION = 1024;

/** Req 2.7: bio of at most 500 characters. */
export const BIO_MAX_LENGTH = 500;

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

const ok: ValidationResult = { valid: true };
const fail = (reason: string): ValidationResult => ({ valid: false, reason });

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

/**
 * Req 2.4: at most {@link MAX_SKILLS} skills, each between
 * {@link SKILL_MIN_LENGTH} and {@link SKILL_MAX_LENGTH} characters.
 */
export function validateSkills(skills: string[]): ValidationResult {
  if (!Array.isArray(skills)) {
    return fail("skills must be an array");
  }
  if (skills.length > MAX_SKILLS) {
    return fail(`at most ${MAX_SKILLS} skills are allowed`);
  }
  for (const skill of skills) {
    if (typeof skill !== "string") {
      return fail("each skill must be a string");
    }
    if (skill.length < SKILL_MIN_LENGTH || skill.length > SKILL_MAX_LENGTH) {
      return fail(
        `each skill must be between ${SKILL_MIN_LENGTH} and ${SKILL_MAX_LENGTH} characters`,
      );
    }
  }
  return ok;
}

export interface SocialLink {
  platform: string;
  url: string;
}

/**
 * Req 2.5: at most {@link MAX_SOCIAL_LINKS} social links, each whose platform
 * is part of the {@link SOCIAL_PLATFORMS} allow-list.
 */
export function validateSocialLinks(links: SocialLink[]): ValidationResult {
  if (!Array.isArray(links)) {
    return fail("social links must be an array");
  }
  if (links.length > MAX_SOCIAL_LINKS) {
    return fail(`at most ${MAX_SOCIAL_LINKS} social links are allowed`);
  }
  for (const link of links) {
    if (!isAllowedPlatform(link?.platform)) {
      return fail(`platform "${link?.platform}" is not in the allow-list`);
    }
  }
  return ok;
}

function isAllowedPlatform(platform: unknown): platform is SocialPlatform {
  return (
    typeof platform === "string" &&
    (SOCIAL_PLATFORMS as readonly string[]).includes(platform)
  );
}

export interface AvatarMeta {
  sizeBytes: number;
  width: number;
  height: number;
}

/**
 * Req 2.6: avatar of at most {@link AVATAR_MAX_BYTES} bytes and dimensions at
 * most {@link AVATAR_MAX_DIMENSION} x {@link AVATAR_MAX_DIMENSION} pixels.
 */
export function validateAvatar({
  sizeBytes,
  width,
  height,
}: AvatarMeta): ValidationResult {
  if (sizeBytes > AVATAR_MAX_BYTES) {
    return fail(`avatar must be at most ${AVATAR_MAX_BYTES} bytes`);
  }
  if (width > AVATAR_MAX_DIMENSION || height > AVATAR_MAX_DIMENSION) {
    return fail(
      `avatar dimensions must be at most ${AVATAR_MAX_DIMENSION}x${AVATAR_MAX_DIMENSION} pixels`,
    );
  }
  return ok;
}

/**
 * Req 2.7: bio of at most {@link BIO_MAX_LENGTH} characters.
 */
export function validateBio(bio: string): ValidationResult {
  if (typeof bio !== "string") {
    return fail("bio must be a string");
  }
  if (bio.length > BIO_MAX_LENGTH) {
    return fail(`bio must be at most ${BIO_MAX_LENGTH} characters`);
  }
  return ok;
}
