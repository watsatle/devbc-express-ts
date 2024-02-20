import { RequestHandler, response } from "express";
import { mySqlConnection } from "../../../app";
import z from "zod";
import mysql, { ResultSetHeader } from "mysql2/promise";

export const ReqBodyTransaction = z.object({
	customerId: z.number(),
	orderItems: z
		.array(
			z.object({
				foodItemId: z.number(),
				quantity: z.number(),
			}),
		)
		.min(1),
});
export type ReqBodyTransaction = z.infer<typeof ReqBodyTransaction>;
export const schemaValidation: RequestHandler = (req, res, next) => {
	const validateReqBody = ReqBodyTransaction.safeParse(req.body);

	if (!validateReqBody.success) {
		return res.status(400).json({ error: validateReqBody.error });
	}
	next();
};

export const handlerTransaction: RequestHandler = async (req, res, next) => {
	const { customerId: reqCustomerId, orderItems }: ReqBodyTransaction =
		req.body;

	const conn = await mySqlConnection().catch(next);
	if (!conn) return;
	try {
		await conn.beginTransaction();

		const [rows, _] = await conn.query<ResultSetHeader>(
			`INSERT INTO transactions (customer_id) VALUES (${reqCustomerId}
			)`,
		);

		const insertOrderItem = orderItems.map((value) => [
			rows.insertId,
			value.foodItemId,
			value.quantity,
		]);
		const format = conn.format(
			"INSERT INTO order_items (transaction_id, food_item_id, quantity) VALUES ? ;",
			[insertOrderItem],
		);
		console.log("->format", format);
		await conn.query(format);

		await conn.commit();
		res.json([{ msaasge: "Create Complete" }]);
	} catch (err) {
		await conn?.rollback();
		await conn.end();

		next(err);
	} finally {
		await conn.end();
	}
};
