import { expect, test } from "./fixtures";

test("startup, keyboard configuration and interrupted assembly", async ({
  page,
}) => {
  await page.goto("");
  await expect(page.locator("canvas")).toBeVisible();
  await page.waitForTimeout(2000);
  const pursuit = page.getByRole("button", {
    name: "Pursuit Mode Uncompromising pace",
  });
  await pursuit.focus();
  await page.keyboard.press("Enter");
  await expect(pursuit).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".specs")).toContainText("355");
  await expect(page.locator(".metrics")).toContainText("355");
  await page
    .getByRole("button", { name: "Titanium Silver", exact: true })
    .click();
  await expect(pursuit).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".finish-panel")).toContainText("Titanium Silver");
  const custom = page.getByRole("button", {
    name: "Custom Build Explore the assembly",
  });
  await custom.click();
  await expect(page.locator(".vehicle-status")).toContainText("EXPLODED");
  for (let i = 0; i < 4; i++) {
    await page
      .getByRole("button", { name: "Standard Pure engineering" })
      .evaluate((button: HTMLButtonElement) => button.click());
    await custom.evaluate((button: HTMLButtonElement) => button.click());
  }
  await page.getByRole("button", { name: "Standard Pure engineering" }).click();
  await expect(page.locator(".vehicle-status")).toContainText("ASSEMBLED");
});

test("specification dialogs, camera reset, tour and preset search", async ({
  page,
}) => {
  await page.goto("");
  await expect(page.locator("canvas")).toBeVisible();
  const spec = page.getByRole("button", { name: /Top Speed 320/ });
  await spec.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Close panel" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(spec).toBeFocused();
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await page.getByRole("button", { name: /WATCH FILM/ }).click();
  await expect(page.getByRole("button", { name: "Stop film" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Stop film" })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Search configurations and specifications" })
    .click();
  await page.getByRole("searchbox").fill("tactical");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Tactical Mode Always prepared" })
    .click();
  await expect(page.locator(".specs")).toContainText("310");
});
test("mobile layout and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("");
  await expect(page.locator("canvas")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page
    .getByRole("button", { name: "Custom Build Explore the assembly" })
    .click();
  await expect(page.locator(".vehicle-status")).toContainText("EXPLODED");
  await page.getByRole("button", { name: /WATCH FILM/ }).click();
  await expect(page.getByRole("dialog")).toContainText("reduced-motion");
});
test("WebGL unavailable retains usable configuration", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        contextId: string,
        options?: unknown,
      ) {
        if (contextId.startsWith("webgl")) return null;
        return original.call(this, contextId, options);
      },
    });
  });
  await page.goto("");
  await expect(page.getByText("3D viewing is unavailable")).toBeVisible();
  await page
    .getByRole("button", { name: "Combat Mode Maximum protection" })
    .click();
  await expect(page.locator(".specs")).toContainText("690");
});

test("mission profiles change the rendered vehicle and restore the standard equipment", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("");
  await expect(page.locator("canvas")).toBeVisible();
  await page.waitForTimeout(1500);
  const standard = await page.locator("canvas").screenshot();
  await page
    .getByRole("button", { name: "Tactical Mode Always prepared" })
    .click();
  await expect(page.locator(".mode-detail")).toContainText("Stabilizers down");
  const tactical = await page.locator("canvas").screenshot();
  expect(tactical.equals(standard)).toBe(false);
  await page
    .getByRole("button", { name: "Pursuit Mode Uncompromising pace" })
    .click();
  await expect(page.locator(".mode-detail")).toContainText("Spoiler raised");
  await expect(page.locator(".mode-detail")).not.toContainText(
    "Stabilizers down",
  );
  const pursuit = await page.locator("canvas").screenshot();
  expect(pursuit.equals(tactical)).toBe(false);
  await page
    .getByRole("button", { name: "Combat Mode Maximum protection" })
    .click();
  await expect(page.locator(".mode-detail")).toContainText("Turret deployed");
  await expect(page.locator(".specs")).toContainText("690");
  const combat = await page.locator("canvas").screenshot();
  expect(combat.equals(pursuit)).toBe(false);
  await page.getByRole("button", { name: "Standard Pure engineering" }).click();
  await expect(page.locator(".mode-detail")).toHaveText("Equipment stowed");
  await expect(page.locator(".specs")).toContainText("600");
});

test("search-to-detail keeps a single dialog and restores the original trigger", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("");
  const searchTrigger = page.getByRole("button", {
    name: "Search configurations and specifications",
  });
  await searchTrigger.click();
  await page.getByRole("searchbox").fill("armor");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Armor System/ })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Armor System");
  await expect(page.getByRole("button", { name: "Close panel" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(searchTrigger).toBeFocused();
  await searchTrigger.click();
  await expect(page.getByRole("searchbox")).toHaveValue("armor");
  await page.getByRole("searchbox").fill("no-such-vehicle");
  await expect(page.getByRole("dialog")).toContainText("No matches");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(searchTrigger).toBeFocused();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name: "Configure", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Standard Pure engineering" }),
  ).toBeFocused();
});
