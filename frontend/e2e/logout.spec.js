import { test, expect } from "@playwright/test";
import {
  createTestUser,
  expectLoggedOut,
  registerUser,
} from "./helpers.js";

test.describe("Logout", () => {
  test("logs out from the dashboard and clears session", async ({ page }) => {
    const user = createTestUser("logout");

    await registerUser(page, user);
    await page.getByRole("button", { name: "Logout" }).first().click();

    await expectLoggedOut(page);

    const token = await page.evaluate(() => localStorage.getItem("auth_token"));
    expect(token).toBeNull();

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("logs out from the navbar", async ({ page }) => {
    const user = createTestUser("logout_nav");

    await registerUser(page, user);
    await page.getByRole("navigation").getByRole("button", { name: "Logout" }).click();

    await expectLoggedOut(page);
    await expect(page).not.toHaveURL(/\/dashboard$/);
  });
});
