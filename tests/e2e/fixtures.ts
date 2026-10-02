import { expect, test as base } from "@playwright/test";

interface BrowserFixtures {
  verifyBrowserErrors: void;
}

export const test = base.extend<BrowserFixtures>({
  verifyBrowserErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      const recordError = (error: Error) => errors.push(error.message);
      page.on("pageerror", recordError);
      await use();
      page.off("pageerror", recordError);
      expect(errors, "Uncaught browser errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
