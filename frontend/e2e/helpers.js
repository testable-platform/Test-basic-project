export function createTestUser(prefix = "user") {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  return {
    email: `${prefix}_${suffix}@example.com`,
    username: `${prefix}_${suffix}`,
    password: "secret123",
  };
}

export async function registerUser(page, user) {
  await page.goto("/register");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/dashboard");
}

export async function loginUser(page, user) {
  await page.goto("/login");
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
}

export async function expectLoggedIn(page, user) {
  await page.getByRole("heading", { name: "Welcome back" }).waitFor();
  await page.getByText(`You are logged in as ${user.username}.`).waitFor();
  await page.getByText(`Hi, ${user.username}`).waitFor();
}

export async function expectLoggedOut(page) {
  const nav = page.getByRole("navigation");
  await nav.getByRole("link", { name: "Login" }).waitFor();
  await nav.getByRole("link", { name: "Register" }).waitFor();
}
