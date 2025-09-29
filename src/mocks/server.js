import { setupServer } from "msw/node";
import { rewardsHandlers } from "./handlersRewards";

export const server = setupServer(...rewardsHandlers);