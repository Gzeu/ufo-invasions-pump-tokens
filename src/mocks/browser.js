import { setupWorker } from "msw";
import { rewardsHandlers } from "./handlersRewards";

export const worker = setupWorker(...rewardsHandlers);