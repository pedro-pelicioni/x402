import { describe, it, expect } from "vitest";
import { createPaywall } from "../src/server.js";

describe("createPaywall", () => {
  it("throws on invalid payTo address", () => {
    expect(() =>
      createPaywall({
        price: "$0.01",
        payTo: "invalid",
        network: "testnet",
      }),
    ).toThrow("Invalid payTo address");
  });

  it("throws on empty payTo", () => {
    expect(() =>
      createPaywall({
        price: "$0.01",
        payTo: "",
        network: "testnet",
      }),
    ).toThrow("Invalid payTo address");
  });

  it("creates middleware with valid options", () => {
    const middleware = createPaywall({
      price: "$0.01",
      payTo: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
      network: "testnet",
    });
    expect(typeof middleware).toBe("function");
  });

  it("creates middleware with defaults", () => {
    const middleware = createPaywall({
      price: 0.01,
      payTo: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
    });
    expect(typeof middleware).toBe("function");
  });

  it("creates middleware with custom facilitator URL", () => {
    const middleware = createPaywall({
      price: "$0.05",
      payTo: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
      network: "testnet",
      facilitatorUrl: "https://custom-facilitator.com",
    });
    expect(typeof middleware).toBe("function");
  });
});
