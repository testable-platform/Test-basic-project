import { test, expect } from "@playwright/test";
import { createTestUser, expectLoggedIn, registerUser } from "./helpers.js";

test.describe("Register", () => {
  test("registers a new user and lands on dashboard", async ({ page }) => {
    const user = createTestUser("register");

    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();

    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expectLoggedIn(page, user);

    const token = await page.evaluate(() => localStorage.getItem("auth_token"));
    expect(token).toBeTruthy();
  });
});
