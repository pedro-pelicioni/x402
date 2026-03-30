import { describe, it, expect } from "vitest";
import {
  resolveNetwork,
  parsePrice,
  priceToTokenAmount,
  exceedsMaxPrice,
} from "../src/utils.js";

describe("resolveNetwork", () => {
  it("resolves testnet to stellar:testnet", () => {
    expect(resolveNetwork("testnet")).toBe("stellar:testnet");
  });

  it("resolves mainnet to stellar:pubnet", () => {
    expect(resolveNetwork("mainnet")).toBe("stellar:pubnet");
  });

  it("throws on invalid network", () => {
    expect(() => resolveNetwork("invalid" as any)).toThrow("Invalid network");
  });
});

describe("parsePrice", () => {
  it("parses dollar string", () => {
    expect(parsePrice("$0.01")).toBe(0.01);
  });

  it("parses plain string", () => {
    expect(parsePrice("0.01")).toBe(0.01);
  });

  it("parses number", () => {
    expect(parsePrice(0.01)).toBe(0.01);
  });

  it("parses whole dollar", () => {
    expect(parsePrice("$1")).toBe(1);
  });

  it("throws on negative price", () => {
    expect(() => parsePrice("-1")).toThrow("Invalid price");
  });

  it("throws on NaN", () => {
    expect(() => parsePrice("abc")).toThrow("Invalid price");
  });
});

describe("priceToTokenAmount", () => {
  it("converts $0.01 to 100000 (7 decimals)", () => {
    expect(priceToTokenAmount("$0.01")).toBe("100000");
  });

  it("converts $1.00 to 10000000", () => {
    expect(priceToTokenAmount("$1.00")).toBe("10000000");
  });

  it("converts number input", () => {
    expect(priceToTokenAmount(0.05)).toBe("500000");
  });
});

describe("exceedsMaxPrice", () => {
  it("returns false when amount is below max", () => {
    expect(exceedsMaxPrice("100000", "$0.10")).toBe(false);
  });

  it("returns false when amount equals max", () => {
    expect(exceedsMaxPrice("100000", "$0.01")).toBe(false);
  });

  it("returns true when amount exceeds max", () => {
    expect(exceedsMaxPrice("10000000", "$0.01")).toBe(true);
  });
});
