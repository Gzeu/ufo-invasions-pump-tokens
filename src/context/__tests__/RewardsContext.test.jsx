import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationProvider } from "../../context/NotificationContext";
import { RewardsProvider } from "../../context/RewardsContext";
import RewardsSection from "../../components/RewardsSection";
import * as rewardsServiceModule from "../../lib/rewardsService";

function setup() {
  return render(
    <NotificationProvider>
      <RewardsProvider>
        <RewardsSection />
      </RewardsProvider>
    </NotificationProvider>
  );
}

function fakeTx(hash = "0xabc") {
  return {
    hash,
    wait: jest.fn().mockResolvedValue({ status: 1, transactionHash: hash })
  };
}

describe("RewardsContext + RewardsSection", () => {
  test("afișează lista de rewards și totalul", async () => {
    setup();
    expect(await screen.findByText(/Your Rewards/i)).toBeInTheDocument();
    const cards = await screen.findAllByRole("article");
    expect(cards.length).toBeGreaterThan(0);
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  });

  test("claim pe un item elimină reward-ul și afișează notificare", async () => {
    const spyClaim = jest.spyOn(rewardsServiceModule.rewardsService, "claimOnChainSingle")
      .mockResolvedValue(fakeTx("0xtx123"));
    const spySync = jest.spyOn(rewardsServiceModule.rewardsService, "syncStatus")
      .mockResolvedValue();

    setup();

    const firstCard = await screen.findAllByRole("article");
    const btnClaim = within(firstCard[0]).getByRole("button", { name: /claim/i });

    await userEvent.click(btnClaim);

    expect(await screen.findByText(/awaiting confirmation/i)).toBeInTheDocument();

    await waitFor(async () => {
      const cardsAfter = await screen.findAllByRole("article");
      expect(cardsAfter.length).toBeLessThan(firstCard.length);
    });

    expect(await screen.findByText(/Reward claimed successfully/i)).toBeInTheDocument();

    expect(spyClaim).toHaveBeenCalledTimes(1);
    expect(spySync).toHaveBeenCalledTimes(1);
  });

  test("Claim All procesează toate claimable-urile (fallback secvențial)", async () => {
    const spyBatch = jest.spyOn(rewardsServiceModule.rewardsService, "claimOnChainBatch")
      .mockImplementation(async ({ rewardIds }) => {
        return {
          mode: "sequential",
          results: rewardIds.map((id, idx) => ({ id, tx: fakeTx(`0xseq${idx}`) }))
        };
      });
    const spySync = jest.spyOn(rewardsServiceModule.rewardsService, "syncStatus").mockResolvedValue();

    setup();

    await screen.findByText(/Your Rewards/i);
    const claimAllBtn = screen.getByRole("button", { name: /Claim All/i });
    expect(claimAllBtn).toBeEnabled();

    await userEvent.click(claimAllBtn);

    expect(await screen.findByText(/Claimed/i)).toBeInTheDocument();

    expect(spyBatch).toHaveBeenCalledTimes(1);
    expect(spySync).toHaveBeenCalled();
  });

  test("erorile sunt afișate în notificări (user rejected)", async () => {
    jest.spyOn(rewardsServiceModule.rewardsService, "claimOnChainSingle")
      .mockRejectedValue(Object.assign(new Error("User rejected the request"), { code: 4001 }));

    setup();

    const firstCard = await screen.findAllByRole("article");
    const btnClaim = within(firstCard[0]).getByRole("button", { name: /claim/i });

    await userEvent.click(btnClaim);

    expect(await screen.findByText(/User rejected/i)).toBeInTheDocument();
  });
});