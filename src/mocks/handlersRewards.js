import { rest } from "msw";

const PAGE_SIZE = 5;

const mockRewards = Array.from({ length: 13 }).map((_, idx) => ({
  id: idx + 1,
  type: idx % 2 === 0 ? "Mission Reward" : "Staking Reward",
  amount: { value: (idx + 1) * 10, symbol: "UFO", decimals: 18 },
  date: Date.now() - (idx + 1) * 86400000,
  status: "claimable"
}));

export const rewardsHandlers = [
  rest.get("/api/rewards", (req, res, ctx) => {
    const cursor = Number(req.url.searchParams.get("cursor") || 0);
    const slice = mockRewards.slice(cursor, cursor + PAGE_SIZE);
    const nextCursor = cursor + PAGE_SIZE < mockRewards.length ? cursor + PAGE_SIZE : null;

    const totalClaimable = mockRewards
      .filter(r => r.status === "claimable")
      .reduce((acc, r) => acc + r.amount.value, 0);

    return res(
      ctx.status(200),
      ctx.json({
        rewards: slice,
        nextCursor,
        totalClaimable
      })
    );
  }),

  rest.post("/api/rewards/prepare-claim", async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ proof: [], signature: "0x", amount: 0, nonce: Date.now(), expiry: Date.now() + 60000 })
    );
  }),

  rest.post("/api/rewards/claimed", async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  })
];