import { RequestHandler } from "express";
import { handlerTransaction } from "./handler_transaction";

export const transactionReq: RequestHandler[] = [handlerTransaction];
