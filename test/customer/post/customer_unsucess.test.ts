import { app } from "../../../app.ts";
import supertest from "supertest";
import { restore } from "../../utils/database.ts";
import mysql, { type Connection } from "mysql2/promise";

let connection: Connection;

function getMysqlConn() {
	return mysql.createConnection({
		host: "127.0.0.1",
		port: 3306,
		user: "watsa",
		password: "watsa",
		database: "food_db",
	});
}

beforeAll(async () => {
	connection = await getMysqlConn();
});

afterAll(async () => {
	await connection.end();
});

describe("create customer", () => {
	it("should get error", async () => {
		const { error, body } = await supertest(app)
			.post("/customer/2")
			.send({})
			.expect(400);
		console.log("debug ->", body);
		expect(body.error).toMatch("name is require");
	});
});

describe("create customer", () => {
	it("should get pass 200", async () => {
		const { error, body } = await supertest(app)
			.post("/customer/2")
			.send({ name: 55, email: 44, address: 66 })
			.expect(400);

		expect(body.error).toMatch("name is require");
	});
});
