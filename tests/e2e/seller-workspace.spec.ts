import { expect, test } from "@playwright/test";

test("login form reports missing Supabase configuration in demo mode", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("seller@example.com");
  await page.getByRole("button", { name: "Send sign-in link" }).click();

  await expect(page.getByRole("heading", { name: "Could not send link" })).toBeVisible();
  await expect(page.getByText(/Supabase is not configured/i)).toBeVisible();
});

test("profile form validates seller slug before saving", async ({ page }) => {
  await page.goto("/dashboard/profile");

  await page.getByLabel("Display name").fill("Aki Models");
  await page.getByLabel("Seller URL").fill("Aki Models!");
  await page.getByRole("button", { name: "Save profile" }).click();

  await expect(page.getByText(/lowercase letters, numbers, and single hyphens/i)).toBeVisible();
});

test("new listing form requires photos before publish", async ({ page }) => {
  await page.goto("/dashboard/listings/new");

  await page.getByLabel("Title").fill("Mini GT Nissan Skyline GT-R R34 Bayside Blue");
  await page.getByLabel("Brand").fill("Mini GT");
  await page.getByLabel("Model name").fill("Nissan Skyline GT-R R34");
  await page.getByLabel("Box condition").fill("Good");
  await page.getByLabel("Defects or missing parts").fill("No missing parts.");
  await page.getByRole("textbox", { name: "Price" }).fill("1200");
  await page.getByLabel("Location").fill("Taipei");
  await page.getByLabel("Contact method").fill("LINE: aki-models");
  await page.getByRole("button", { name: "Publish listing" }).click();

  await expect(page.getByText("Upload at least one photo before publishing.")).toBeVisible();
});

test("transaction confirmation demo can be accepted without Supabase", async ({ page }) => {
  await page.goto("/transactions/confirm/demo");

  await expect(page.getByRole("heading", { name: "Confirm completed transaction" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm transaction" }).click();

  await expect(page.getByRole("heading", { name: "Confirmed" })).toBeVisible();
  await expect(page.getByText(/Demo confirmation accepted/i)).toBeVisible();
});
