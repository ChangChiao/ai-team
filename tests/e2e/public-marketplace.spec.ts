import { expect, test } from "@playwright/test";

test("homepage presents marketplace inventory and trust signals", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /find model cars/i })).toBeVisible();
  await expect(page.getByRole("link", { exact: true, name: "Mini GT" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest listings" })).toBeVisible();
  await expect(page.getByText(/confirmed transactions/i).first()).toBeVisible();
});

test("browse page shows filters and listing cards", async ({ page }) => {
  await page.goto("/listings");

  await expect(page.getByRole("heading", { name: "Model car listings" })).toBeVisible();
  await expect(page.getByLabel("Listing filters")).toBeVisible();
  await expect(page.getByRole("link", { name: /Mini GT Nissan Skyline/i })).toBeVisible();
});

test("listing detail shows model details and seller trust panel", async ({ page }) => {
  await page.goto("/listings/mini-gt-skyline-r34");

  await expect(page.getByRole("heading", { name: /Mini GT Nissan Skyline/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Model details" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Aki Models" })).toBeVisible();
  await expect(page.getByText("Confirmed transactions")).toBeVisible();
});

test("seller profile exposes active listings and confirmed transaction history", async ({ page }) => {
  await page.goto("/sellers/aki-models");

  await expect(page.getByRole("heading", { name: "Aki Models" })).toBeVisible();
  await expect(page.getByText("18 confirmed transactions")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Active listings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Confirmed transaction history" })).toBeVisible();
});
