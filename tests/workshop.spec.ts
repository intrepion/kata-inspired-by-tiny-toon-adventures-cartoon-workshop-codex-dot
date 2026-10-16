import { test, expect } from "@playwright/test";
test("author from blank, layer actors, overwrite cues, play, edit, save and reload", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Cast Pip · seed courier").click();
  await page.getByLabel("Animation").selectOption("walk");
  await page.getByLabel("Position X", { exact: true }).fill("220");
  await page.getByRole("button", { name: "Set motion →" }).click();
  await page.getByLabel("Motion X", { exact: true }).fill("3");
  await page.getByRole("button", { name: "● Film action" }).click();
  await expect(
    page.getByRole("button", { name: "Actor 1 walk frame 0", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next frame", exact: true }).click();
  await page.getByLabel("Cast Pip · seed courier").click();
  await page.getByLabel("Animation").selectOption("jump");
  await page.getByRole("button", { name: "Set motion →" }).click();
  await page.getByRole("button", { name: "● Film action" }).click();
  await page.getByRole("button", { name: "Rewind to first frame" }).click();
  await page.getByRole("button", { name: "Actor 2", exact: true }).click();
  await page.getByLabel("Cast Moth · moon magician").click();
  await page.getByLabel("Animation").selectOption("wave");
  await page.getByRole("button", { name: "Set motion →" }).click();
  await page.getByRole("button", { name: "● Film action" }).click();
  await page
    .getByRole("combobox", { name: "Caption", exact: true })
    .selectOption("Ta-da! Almost on purpose.");
  await page.getByRole("button", { name: "Set caption at frame 0" }).click();
  await page
    .getByRole("combobox", { name: "Length", exact: true })
    .selectOption("24");
  await page.getByRole("button", { name: "Play cartoon" }).click();
  await expect(page.getByText("ON AIR", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pause", exact: false }).click();
  await expect(page.getByText("PAUSED", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: false }).click();
  await expect(page.getByText("THAT’S A WRAP", { exact: true })).toBeVisible({
    timeout: 5000,
  });
  await page.getByRole("button", { name: "Return to edit" }).click();
  await page.getByRole("button", { name: "Save take" }).click();
  await page.reload();
  await expect(page.locator("#status")).toHaveText("Saved cartoon restored");
  await expect(
    page.getByRole("button", { name: "Actor 2 wave frame 0", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Actor 1 jump frame 1", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Cast Pip · seed courier", exact: true })
    .click();
  await page.getByLabel("Animation").selectOption("spin");
  await page.getByRole("button", { name: "Set motion →" }).click();
  await page.getByRole("button", { name: "● Film action" }).click();
  await expect(
    page.getByRole("button", { name: "Actor 1 jump frame 1", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Actor 1 spin frame 0", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Actor 2 wave frame 0", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Scenery", exact: true })
    .selectOption("rooftop");
  await page.getByRole("button", { name: "Keep my take" }).click();
  await expect(
    page.getByRole("button", { name: "Actor 2 wave frame 0", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Scenery", exact: true })
    .selectOption("theater");
  await page.getByRole("button", { name: "Start fresh in theater" }).click();
  await expect(
    page.getByText("No performance yet — cast an actor"),
  ).toHaveCount(2);
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Scenery", exact: true }),
  ).toHaveValue("theater");
});
test("keyboard placement and steps preserve numeric edit semantics", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Place this actor →" }).click();
  await page
    .getByLabel("Stage placement; arrow keys move actor")
    .press("ArrowRight");
  await expect(page.getByLabel("Position X", { exact: true })).toHaveValue(
    "242",
  );
  await page
    .getByLabel("Stage placement; arrow keys move actor")
    .press("Shift+ArrowDown");
  await expect(page.getByLabel("Position Y", { exact: true })).toHaveValue(
    "330",
  );
  await page.getByRole("button", { name: "Set motion →" }).click();
  await page
    .getByLabel("Stage placement; arrow keys move actor")
    .press("ArrowRight");
  await expect(page.getByLabel("Motion X", { exact: true })).toHaveValue("1");
  await expect(page.getByLabel("Position X", { exact: true })).toHaveValue(
    "242",
  );
  await page.getByLabel("Motion X", { exact: true }).fill("99");
  await page.getByLabel("Motion X", { exact: true }).press("Tab");
  await expect(page.getByLabel("Motion X", { exact: true })).toHaveValue("6");
  await page.getByRole("button", { name: "● Film action" }).click();
  await page
    .getByLabel("Stage placement; arrow keys move actor")
    .press("ArrowRight");
  await expect(page.locator("#counter")).toContainText("001 /");
  await page
    .getByLabel("Stage placement; arrow keys move actor")
    .press("Space");
  await expect(page.getByText("ON AIR", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("DIRECTING", { exact: true })).toBeVisible();
});

test("new-take confirmation traps focus and returns it on cancel", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New cartoon", exact: false }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Keep my take" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Start fresh in garden" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Keep my take" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New cartoon", exact: false }),
  ).toBeFocused();
});
