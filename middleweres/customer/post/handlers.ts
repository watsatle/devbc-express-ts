import { RequestHandler } from "express";
import { mySchema } from "./schema";
import { mySqlConnection } from "../../../app";

export const handlers: RequestHandler = async (req, res, next) => {
	const conn = await mySqlConnection().catch(next);
	if (!conn) return;
	const validReqBody = req.body as mySchema;
	try {
		await conn.query(`INSERT INTO customers (name,email,address) 
		                       VALUES ('${validReqBody.name}','${validReqBody.email}','${validReqBody.address}')`);
	} catch (err) {
		await conn.rollback();
		await conn.end();
		next(err);
	} finally {
		await conn.end();
	}
};

// export const handlers: RequestHandler = (req, res, next) => {
// 	const validReqBody = req.body as mySchema;
// 	let connection: Connection;
// 	mySqlConnection()
// 		.then((conn) => {
// 			connection = conn;
// 			return conn.query(`INSERT INTO customers (name,email,address)
//                               VALUES ('${validReqBody.name}','${validReqBody.email}','${validReqBody.address}')`);
// 		})
// 		.then(([rows]) => {
// 			connection.end();
// 			res.json({ result: rows });
// 		})
// 		.catch((err) => {
// 			connection.rollback();
// 			console.log(err);
// 			res.status(500).send(err);
// 		});
// 	next();
// };
