import { computeLotAverages } from "./stocks";

describe("computeLotAverages", () => {
  it("computes weighted average for multiple lots", () => {
    const lots = [
      { shares: 2, price: "10" },
      { shares: 3, price: "20" },
    ];
    const { averageCost, totalShares } = computeLotAverages(lots);
    expect(totalShares).toBe(5);
    expect(averageCost).toBeCloseTo(16, 5); // (2*10 + 3*20)/5 = 80/5 =16
  });

  it("returns undefined average for empty lots", () => {
    const { averageCost, totalShares } = computeLotAverages([]);
    expect(averageCost).toBeUndefined();
    expect(totalShares).toBe(0);
  });

  it("skips invalid lots and still computes", () => {
    const lots = [
      { shares: "2", price: "10" },
      { shares: "x", price: "15" }, // invalid shares
      { shares: 3, price: "bad" }, // invalid price
      { shares: 5, price: "12" },
    ];
    // valid contributions: 2*10 + 5*12 = 20 + 60 = 80 over 7 shares => 11.428571...
    const { averageCost, totalShares } = computeLotAverages(lots);
    expect(totalShares).toBe(7);
    expect(averageCost).toBeCloseTo(11.4286, 4);
  });

  it("handles all invalid lots returning undefined", () => {
    const lots = [{ shares: "a", price: "b" }];
    const { averageCost, totalShares } = computeLotAverages(lots);
    expect(totalShares).toBe(0);
    expect(averageCost).toBeUndefined();
  });
});
