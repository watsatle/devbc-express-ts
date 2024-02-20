import { RequestHandler } from "express";
import { handlerTransaction, schemaValidation } from "./handler_transaction";

export const transactionReq: RequestHandler[] = [
	schemaValidation,
	handlerTransaction,
];
