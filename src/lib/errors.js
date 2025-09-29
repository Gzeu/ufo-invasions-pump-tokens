export function mapEthersError(err) {
  const code = err?.code;
  const msg = err?.message || String(err);

  if (code === 4001) {
    return new Error("User rejected the request");
  }
  if (msg.toLowerCase().includes("insufficient funds")) {
    return new Error("Insufficient funds for gas");
  }
  if (msg.toLowerCase().includes("chain") && msg.toLowerCase().includes("mismatch")) {
    return new Error("Wrong network. Please switch to the required network.");
  }
  if (msg.toLowerCase().includes("execution reverted")) {
    return new Error("Transaction reverted by EVM");
  }
  return err instanceof Error ? err : new Error(msg);
}