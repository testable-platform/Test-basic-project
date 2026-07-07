import { test } from "@playwright/test";
import {
  createTestUser,
  expectLoggedIn,
  expectLoggedOut,
  loginUser,
  registerUser,
} from "./helpers.js";

test.describe("Auth flow", () => {
  test("register, login, and logout end-to-end", async ({ page }) => {
    const user = createTestUser("flow");

    await registerUser(page, user);
    await expectLoggedIn(page, user);

    await page.getByRole("button", { name: "Logout" }).first().click();
    await expectLoggedOut(page);

    await loginUser(page, user);
    await expectLoggedIn(page, user);

    await page.getByRole("button", { name: "Logout" }).first().click();
    await expectLoggedOut(page);
  });
});
