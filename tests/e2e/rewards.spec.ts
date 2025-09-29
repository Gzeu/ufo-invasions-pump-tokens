import { test, expect } from "@playwright/test";

test("listare rewards, Claim All și Claim single", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("UFO Invasions - Missions & Rewards")).toBeVisible();
  await expect(page.getByText("Your Rewards")).toBeVisible();

  const cards = page.locator("article");
  await expect(cards.first()).toBeVisible();

  const firstClaimBtn = cards.first().getByRole("button", { name: /claim/i });
  await firstClaimBtn.click();

  await expect(page.getByText(/Transaction sent/i)).toBeVisible();
  await expect(page.getByText(/Reward claimed successfully/i)).toBeVisible();

  const claimAllBtn = page.getByRole("button", { name: /Claim All/i });
  await claimAllBtn.click();

  await expect(page.getByText(/Claimed/i)).toBeVisible();
});