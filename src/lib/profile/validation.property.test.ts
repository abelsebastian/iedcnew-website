// Feature: community-platform, Property 17: Input validation domain bounds
//
// For all generated inputs, each profile validator accepts an input IFF it
// lies within the documented domain bounds, and rejects it otherwise. We
// generate both in-bounds and out-of-bounds values for each facet (skills,
// social links, avatar, bio) and assert acceptance/rejection accordingly.
//
// Validates: Requirements 2.4, 2.5, 2.6, 2.7

import { describe, it, expect } from "vitest";
import fc from "fast-check";

import {
  validateSkills,
  validateSocialLinks,
  validateAvatar,
  validateBio,
  MAX_SKILLS,
  SKILL_MIN_LENGTH,
  SKILL_MAX_LENGTH,
  MAX_SOCIAL_LINKS,
  SOCIAL_PLATFORMS,
  AVATAR_MAX_BYTES,
  AVATAR_MAX_DIMENSION,
  BIO_MAX_LENGTH,
  type SocialLink,
} from "./validation";

const RUNS = 200;

// ---------------------------------------------------------------------------
// Reference predicates: the documented domain bounds, expressed independently
// from the implementation so the property is a real cross-check.
// ---------------------------------------------------------------------------

const skillsInBounds = (skills: string[]): boolean =>
  skills.length <= MAX_SKILLS &&
  skills.every(
    (s) => s.length >= SKILL_MIN_LENGTH && s.length <= SKILL_MAX_LENGTH,
  );

const socialLinksInBounds = (links: SocialLink[]): boolean =>
  links.length <= MAX_SOCIAL_LINKS &&
  links.every((l) =>
    (SOCIAL_PLATFORMS as readonly string[]).includes(l.platform),
  );

const avatarInBounds = (a: {
  sizeBytes: number;
  width: number;
  height: number;
}): boolean =>
  a.sizeBytes <= AVATAR_MAX_BYTES &&
  a.width <= AVATAR_MAX_DIMENSION &&
  a.height <= AVATAR_MAX_DIMENSION;

const bioInBounds = (bio: string): boolean => bio.length <= BIO_MAX_LENGTH;

// ---------------------------------------------------------------------------
// Generators: deliberately straddle the boundaries so both accept and reject
// cases are exercised.
// ---------------------------------------------------------------------------

// A skill string whose length can be below, within, or above the bound.
const skillArb = fc.string({ minLength: 0, maxLength: SKILL_MAX_LENGTH + 5 });

// An array whose length can exceed MAX_SKILLS.
const skillsArb = fc.array(skillArb, { minLength: 0, maxLength: MAX_SKILLS + 5 });

const allowedPlatformArb = fc.constantFrom(...SOCIAL_PLATFORMS);
const platformArb = fc.oneof(
  allowedPlatformArb,
  // off allow-list values
  fc.constantFrom("facebook", "tiktok", "", "youtube", "snapchat"),
);
const socialLinkArb: fc.Arbitrary<SocialLink> = fc.record({
  platform: platformArb,
  url: fc.webUrl(),
});
const socialLinksArb = fc.array(socialLinkArb, {
  minLength: 0,
  maxLength: MAX_SOCIAL_LINKS + 4,
});

const avatarArb = fc.record({
  sizeBytes: fc.integer({ min: 0, max: AVATAR_MAX_BYTES * 2 }),
  width: fc.integer({ min: 0, max: AVATAR_MAX_DIMENSION * 2 }),
  height: fc.integer({ min: 0, max: AVATAR_MAX_DIMENSION * 2 }),
});

const bioArb = fc.string({ minLength: 0, maxLength: BIO_MAX_LENGTH + 100 });

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

describe("Property 17: Input validation domain bounds (profile facets)", () => {
  it("accepts skills IFF count <= 20 and each is 2-40 chars (Req 2.4)", () => {
    fc.assert(
      fc.property(skillsArb, (skills) => {
        expect(validateSkills(skills).valid).toBe(skillsInBounds(skills));
      }),
      { numRuns: RUNS },
    );
  });

  it("accepts social links IFF count <= 6 and platform in allow-list (Req 2.5)", () => {
    fc.assert(
      fc.property(socialLinksArb, (links) => {
        expect(validateSocialLinks(links).valid).toBe(
          socialLinksInBounds(links),
        );
      }),
      { numRuns: RUNS },
    );
  });

  it("accepts avatar IFF <= 2MB and <= 1024x1024 (Req 2.6)", () => {
    fc.assert(
      fc.property(avatarArb, (avatar) => {
        expect(validateAvatar(avatar).valid).toBe(avatarInBounds(avatar));
      }),
      { numRuns: RUNS },
    );
  });

  it("accepts bio IFF <= 500 chars (Req 2.7)", () => {
    fc.assert(
      fc.property(bioArb, (bio) => {
        expect(validateBio(bio).valid).toBe(bioInBounds(bio));
      }),
      { numRuns: RUNS },
    );
  });

  // Boundary-focused checks to ensure the IFF holds exactly at the edges.
  it("treats exact boundary values correctly", () => {
    // Skills: exactly 20 of length exactly 2 and exactly 40 -> valid.
    expect(
      validateSkills(Array.from({ length: MAX_SKILLS }, () => "ab")).valid,
    ).toBe(true);
    expect(
      validateSkills(Array.from({ length: MAX_SKILLS }, () => "a".repeat(SKILL_MAX_LENGTH)))
        .valid,
    ).toBe(true);
    // One over the count -> invalid.
    expect(
      validateSkills(Array.from({ length: MAX_SKILLS + 1 }, () => "ab")).valid,
    ).toBe(false);
    // One char too short / too long -> invalid.
    expect(validateSkills(["a"]).valid).toBe(false);
    expect(validateSkills(["a".repeat(SKILL_MAX_LENGTH + 1)]).valid).toBe(false);

    // Social links: exactly 6 allowed -> valid; 7 -> invalid.
    const allowed = SOCIAL_PLATFORMS[0];
    expect(
      validateSocialLinks(
        Array.from({ length: MAX_SOCIAL_LINKS }, () => ({
          platform: allowed,
          url: "https://x.test",
        })),
      ).valid,
    ).toBe(true);
    expect(
      validateSocialLinks(
        Array.from({ length: MAX_SOCIAL_LINKS + 1 }, () => ({
          platform: allowed,
          url: "https://x.test",
        })),
      ).valid,
    ).toBe(false);

    // Avatar: exactly at the limits -> valid; one over -> invalid.
    expect(
      validateAvatar({
        sizeBytes: AVATAR_MAX_BYTES,
        width: AVATAR_MAX_DIMENSION,
        height: AVATAR_MAX_DIMENSION,
      }).valid,
    ).toBe(true);
    expect(
      validateAvatar({
        sizeBytes: AVATAR_MAX_BYTES + 1,
        width: AVATAR_MAX_DIMENSION,
        height: AVATAR_MAX_DIMENSION,
      }).valid,
    ).toBe(false);
    expect(
      validateAvatar({
        sizeBytes: AVATAR_MAX_BYTES,
        width: AVATAR_MAX_DIMENSION + 1,
        height: AVATAR_MAX_DIMENSION,
      }).valid,
    ).toBe(false);

    // Bio: exactly 500 -> valid; 501 -> invalid.
    expect(validateBio("a".repeat(BIO_MAX_LENGTH)).valid).toBe(true);
    expect(validateBio("a".repeat(BIO_MAX_LENGTH + 1)).valid).toBe(false);
  });
});
