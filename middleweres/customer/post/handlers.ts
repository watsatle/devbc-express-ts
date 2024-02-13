import { RequestHandler } from "express";
import mysql, { type Connection } from "mysql2/promise";
import { mySchema } from "./schema";
import { mySqlConnection } from "../../../app";

export const handlers: RequestHandler = (req, res, next) => {
	const validReqBody = req.body as mySchema;
	let connection: Connection;
	mySqlConnection()
		.then((conn) => {
			connection = conn;
			return conn.query(`INSERT INTO customers (name,email,address) 
                              VALUES ('${validReqBody.name}','${validReqBody.email}','${validReqBody.address}')`);
		})
		.then(([rows]) => {
			connection.end();
			res.json({ result: rows });
		})
		.catch((err) => {
			connection.rollback();
			console.log(err);
			res.status(500).send(err);
		});
	next();
};
