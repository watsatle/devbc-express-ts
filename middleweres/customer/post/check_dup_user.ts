import { RequestHandler } from "express";
import { mySqlConnection } from "../../../app";
import mysql, { RowDataPacket, type Connection } from "mysql2/promise";
import { mySchema } from "./schema";
import { log } from "console";

type CustomerData = {
	name: string;
	email: string;
	address: string;
} & RowDataPacket;

export const checkDuplicateUser: RequestHandler = (req, res, next) => {
	const validReqBody = req.body as mySchema;
	let connection: Connection;
	mySqlConnection()
		.then((conn) => {
			connection = conn;
			return conn.query<CustomerData[]>(
				`SELECT * FROM customers WHERE email = ${mysql.escape(
					validReqBody.email,
				)}`,
			);
		})
		.then(([rows]) => {
			// connection.end();
			console.log("->", rows);
			if (rows.length > 0) {
				return res.status(400).json({ error: "email is already exist" });
			}
			next();
		})
		.catch((err) => {
			next(err);
		});
};
