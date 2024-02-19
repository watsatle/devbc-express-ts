import { RequestHandler, response } from "express";
import { mySqlConnection } from "../../../app";
import z from "zod";
import mysql, { ResultSetHeader } from "mysql2/promise";

export const ReqBodyTransaction = z.object({
	customer_id: z.number(),

	food_item_id: z.number(),
	quantity: z.number(),
});
export type ReqBodyTransaction = z.infer<typeof ReqBodyTransaction>;

export const handlerTransaction: RequestHandler = async (req, res, next) => {
	const {
		customer_id: reqCustomerId,
		food_item_id: reqFoodItemId,
		quantity: reqQuantity,
	}: ReqBodyTransaction = req.body;

	const conn = await mySqlConnection().catch(next);
	if (!conn) return;
	try {
		await conn.beginTransaction();

		const [rows, _] = await conn.query<ResultSetHeader>(
			`INSERT INTO transactions (customer_id) VALUES (${reqCustomerId}
			)`,
		);
		console.log("-> shoudbe insert transactions", rows.insertId);
		await conn.query(
			`INSERT INTO order_items (transaction_id, food_item_id, quantity) VALUES (${rows.insertId}, ${reqFoodItemId}, ${reqQuantity})`,
		);

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
