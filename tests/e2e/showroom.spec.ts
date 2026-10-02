import { expect, test } from "@playwright/test";

test("startup, configuration, keyboard, dialogs, reset and assembly", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
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
  expect(errors).toEqual([]);
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
  await expect(page.locator(".specs")).toContainText("720");
});
