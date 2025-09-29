import { mapEthersError } from "../../lib/errors";

describe("mapEthersError", () => {
  test("map 4001 -> User rejected", () => {
    const err = mapEthersError({ code: 4001, message: "User rejected" });
    expect(err.message).toMatch(/User rejected/);
  });

  test("insufficient funds", () => {
    const err = mapEthersError({ message: "insufficient funds for gas * price + value" });
    expect(err.message).toMatch(/Insufficient funds/);
  });

  test("wrong network mismatch", () => {
    const err = mapEthersError({ message: "chain mismatch detected" });
    expect(err.message).toMatch(/Wrong network/i);
  });

  test("execution reverted", () => {
    const err = mapEthersError({ message: "execution reverted: reason" });
    expect(err.message).toMatch(/Transaction reverted/i);
  });
});