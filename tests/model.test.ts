import { describe, it, expect } from "vitest";
import {
  blank,
  film,
  poseAt,
  decode,
  cameraAt,
  deleteCuesFrom,
  setCaption,
  resize,
} from "../src/model";
describe("director authoring seam", () => {
  it("films two concurrent actors and replaces only the selected actors future", () => {
    let p = blank("garden");
    p = film(p, 0, {
      frame: 0,
      actor: "pip",
      action: "walk",
      x: 200,
      y: 300,
      vx: 3,
      vy: 0,
    });
    p = film(p, 0, {
      frame: 48,
      actor: "pip",
      action: "jump",
      x: 344,
      y: 300,
      vx: 0,
      vy: 0,
    });
    p = film(p, 1, {
      frame: 12,
      actor: "moth",
      action: "wave",
      x: 500,
      y: 300,
      vx: 0,
      vy: 0,
    });
    expect(poseAt(p, 0, 24)?.x).toBe(272);
    expect(poseAt(p, 1, 11)).toBeNull();
    p = film(p, 0, {
      frame: 24,
      actor: "pip",
      action: "spin",
      x: 272,
      y: 300,
      vx: 0,
      vy: 0,
    });
    expect(p.lanes[0].map((c) => c.frame)).toEqual([0, 24]);
    expect(p.lanes[1]).toHaveLength(1);
    expect(poseAt(p, 0, 60)?.action).toBe("spin");
  });
});
describe("camera and persistence seam", () => {
  it("follows mean world placement and stops at scenic bounds", () => {
    let p = film(blank(), 0, {
      frame: 0,
      actor: "pip",
      action: "walk",
      x: 100,
      y: 300,
      vx: 6,
      vy: 0,
    });
    expect(cameraAt(p, 0)).toBe(0);
    expect(cameraAt(p, 100)).toBe(300);
    expect(cameraAt(p, 239)).toBe(600);
    p = film(p, 1, {
      frame: 0,
      actor: "moth",
      action: "stand",
      x: 100,
      y: 300,
      vx: 0,
      vy: 0,
    });
    expect(cameraAt(p, 100)).toBe(0);
  });
  it("round trips a take and rejects broken or out-of-range persisted data", () => {
    const p = film(blank(), 0, {
      frame: 0,
      actor: "moon",
      action: "spin",
      x: 400,
      y: 280,
      vx: 0,
      vy: 0,
    });
    expect(decode(JSON.stringify(p))).toEqual(p);
    expect(decode("{bad")).toBeNull();
    expect(decode(JSON.stringify({ ...p, length: Infinity }))).toBeNull();
    expect(
      decode(
        JSON.stringify({ ...p, lanes: [[{ ...p.lanes[0][0], x: -999 }], []] }),
      ),
    ).toBeNull();
  });
});

it("deletes future cues independently and replaces same-frame captions in time order", () => {
  let p = film(blank(), 0, {
    frame: 0,
    actor: "pip",
    action: "stand",
    x: 200,
    y: 300,
    vx: 0,
    vy: 0,
  });
  p = film(p, 0, {
    frame: 24,
    actor: "pip",
    action: "jump",
    x: 200,
    y: 300,
    vx: 0,
    vy: 0,
  });
  p = film(p, 1, {
    frame: 24,
    actor: "moth",
    action: "wave",
    x: 500,
    y: 300,
    vx: 0,
    vy: 0,
  });
  p = deleteCuesFrom(p, 0, 24);
  expect(p.lanes[0]).toHaveLength(1);
  expect(p.lanes[1]).toHaveLength(1);
  p = setCaption(p, { frame: 36, text: "Later", sound: false });
  p = setCaption(p, { frame: 0, text: "First", sound: false });
  p = setCaption(p, { frame: 36, text: "Replaced", sound: true });
  expect(p.captions.map((c) => c.text)).toEqual(["First", "Replaced"]);
  p = resize(p, 24);
  expect(p.lanes[1]).toHaveLength(0);
  expect(p.captions.map((c) => c.text)).toEqual(["First"]);
});
