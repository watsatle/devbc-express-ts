import express, { ErrorRequestHandler } from "express";
import ServerlessHttp from "serverless-http";
import bodyParser from "body-parser";
import mysql, { type Connection } from "mysql2/promise";
import cors from "cors";
import z from "zod";
import { createCustomer } from "./middleweres/customer/post";
import { transactionReq } from "./middleweres/transaction/post";

export const app = express();

app.use(cors());
app.use(bodyParser.json());

export function mySqlConnection() {
	return mysql.createConnection({
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
	});
}

app.post("/customers", ...createCustomer);

app.post("/transactions", ...transactionReq);

app.get("/menu", (req, res) => {
	mySqlConnection()
		.then((conn) => conn.query("SELECT * FROM food_items "))
		.then(([rows]) => res.json({ result: rows }))
		.catch((err) => {
			res.status(500).send(err);
		});
});

app.get("/customer", (req, res) => {
	mySqlConnection()
		.then((conn) => conn.query("SELECT id FROM customers WHERE id='2'"))
		.then(([rows]) => res.json({ result: rows }))
		.catch((err) => {
			res.status(500).send(err);
		});
});

app.post("/unused", (req, res) => {
	const name = req.body.name;

	const mySchema = z.object({
		name: z.string(),
		email: z.string(),
		address: z.number(),
	});

	type mySchema = z.infer<typeof mySchema>;

	const validateReqBody = mySchema.safeParse(req.body);

	if (!validateReqBody.success) {
		return res.status(400).json({ error: validateReqBody.error });
	}

	// if (!name) {
	// 	return res.status(400).json({ error: "name is required" });
	// }

	// if (typeof name !== "string") {
	// 	return res.status(400).json({ error: "name must be string" });
	// }
	let connection: Connection;
	mySqlConnection()
		.then((conn) => {
			connection = conn;
			return conn.query(`INSERT INTO customers (name,email,address) 
                                  VALUES ('${validateReqBody.data.name}','${validateReqBody.data.email}','${validateReqBody.data.address}')`);
		})
		.then(([rows]) => {
			connection.end();
			res.json({ result: rows });
		})
		.catch((err) => {
			connection.end();
			console.log(err);
			res.status(500).send(err);
		});
});

app.get("/health", (_req, res) => {
	res.status(200).json({
		status: "OK",
		details: "All systems are functioning properly",
		timestamp: new Date().toISOString(),
	});
});

//all menu

// get store_id
app.get("/store/:id", (req, res) => {
	mySqlConnection()
		.then((conn) =>
			conn.query(`SELECT * FROM stores WHERE id = ${req.params.id}`),
		)
		.then(([rows]) => res.json({ result: rows }))
		.catch((err) => {
			res.status(500).send(err);
		});
});
app.patch("/customer/3", (req, res) => {
	mySqlConnection()
		.then((conn) =>
			conn.query(
				'UPDATE customers SET id = "2", name = "Jane Smith", address = "1234 Main St" ',
			),
		)
		.then(([rows]) => res.json({ result: rows }))
		.catch((err) => {
			res.status(500).send(err);
		});
});

app.delete("/del", (req, res) => {
	mySqlConnection()
		.then((conn) => conn.query(`DELETE FROM customers WHERE id = '${req}'`))
		.then((rows) => res.json({ result: rows }))
		.catch((err) => {
			res.status(500).send("error");
		});
});

// app.post('/debug/:id/:foo', (req, res) => {
//   res.json({test : "post",
//   query : req.query,
//   param : req.params,
//   body : req.body,})
// });

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	res.status(500);
	console.log("error handler", err);
	res.render("error", { error: err });
};
app.use(errorHandler);
