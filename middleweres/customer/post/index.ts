import { RequestHandler } from "express";
import { schemaValidation } from "./schema";
import { handlers } from "./handlers";
import { checkDuplicateUser } from "./check_dup_user";

export const createCustomer: RequestHandler[] = [
	schemaValidation,
	checkDuplicateUser,
	handlers,
];
