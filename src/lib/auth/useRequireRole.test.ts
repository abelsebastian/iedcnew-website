import { describe, expect, it } from "vitest";

import { hasRole } from "./useRequireRole";
import type { RoleGrant } from "./types";

const IEDC_A = "11111111-1111-1111-1111-111111111111";
const IEDC_B = "22222222-2222-2222-2222-222222222222";

describe("hasRole", () => {
  it("returns false for an empty grant list", () => {
    expect(hasRole([], "ksum_admin")).toBe(false);
    expect(hasRole([], "iedc_admin", IEDC_A)).toBe(false);
  });

  it("matches a global ksum_admin regardless of scope", () => {
    const roles: RoleGrant[] = [{ role: "ksum_admin" }];
    expect(hasRole(roles, "ksum_admin")).toBe(true);
    expect(hasRole(roles, "ksum_admin", IEDC_A)).toBe(true);
    expect(hasRole(roles, "iedc_admin", IEDC_A)).toBe(false);
  });

  it("scopes iedc_admin to the matching IEDC", () => {
    const roles: RoleGrant[] = [{ role: "iedc_admin", iedc_id: IEDC_A }];
    expect(hasRole(roles, "iedc_admin")).toBe(true); // no scope requested
    expect(hasRole(roles, "iedc_admin", IEDC_A)).toBe(true);
    expect(hasRole(roles, "iedc_admin", IEDC_B)).toBe(false);
  });

  it("scopes nodal_officer to the matching IEDC", () => {
    const roles: RoleGrant[] = [{ role: "nodal_officer", iedc_id: IEDC_B }];
    expect(hasRole(roles, "nodal_officer", IEDC_B)).toBe(true);
    expect(hasRole(roles, "nodal_officer", IEDC_A)).toBe(false);
  });

  it("treats a platform moderator as covering any IEDC scope", () => {
    const roles: RoleGrant[] = [{ role: "moderator", scope: "platform" }];
    expect(hasRole(roles, "moderator")).toBe(true);
    expect(hasRole(roles, "moderator", IEDC_A)).toBe(true);
  });

  it("does not let a forum moderator satisfy an IEDC-scoped check", () => {
    const roles: RoleGrant[] = [{ role: "moderator", scope: "forum" }];
    expect(hasRole(roles, "moderator")).toBe(true);
    expect(hasRole(roles, "moderator", IEDC_A)).toBe(false);
  });

  it("scopes an iedc moderator to its IEDC", () => {
    const roles: RoleGrant[] = [
      { role: "moderator", scope: { iedc_id: IEDC_A } },
    ];
    expect(hasRole(roles, "moderator", IEDC_A)).toBe(true);
    expect(hasRole(roles, "moderator", IEDC_B)).toBe(false);
  });
});
