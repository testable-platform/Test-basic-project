import { test, expect } from "@playwright/test";
import {
  createTestUser,
  expectLoggedIn,
  loginUser,
  registerUser,
} from "./helpers.js";

test.describe("Login", () => {
  test("logs in with valid credentials", async ({ page }) => {
    const user = createTestUser("login");

    await registerUser(page, user);
    await page.evaluate(() => localStorage.clear());
    await page.goto("/");

    await loginUser(page, user);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expectLoggedIn(page, user);

    const token = await page.evaluate(() => localStorage.getItem("auth_token"));
    expect(token).toBeTruthy();
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Username").fill("missing_user");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid username or password")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});
