import { app } from "../../../app.ts";
import supertest from "supertest";
import { restore } from "../../utils/database.ts";
import mysql, { type Connection } from "mysql2/promise";

let connection: Connection;

beforeAll(async () => {
	connection = await getMysqlConn();
});

afterAll(async () => {
	await connection.end();
});

describe("check data before create customer", () => {
	it("should have 4 customers", async () => {
		const [result] = await connection.query("SELECT * FROM customers;");
		expect(result).toHaveLength(4);
	});
});

// describe("create customer", () => {
// 	it("should get error", async () => {
// 		const { error, body } = await supertest(app)
// 			.post("/customer/2")
// 			.send({})
// 			.expect(400);
// 		console.log("debug ->", body);
// 		expect(body.error).toMatch("name is require");
// 	});
// });

// describe("create customer", () => {
// 	it("should get pass 200", async () => {
// 		const { error, body } = await supertest(app)
// 			.post("/customer/2")
// 			.send({ name: 55 })
// 			.expect(400);
// 		console.log("debug ->", body);
// 		expect(body.error).toMatch("name is require");
// 	});
// });

describe("check data after create customer", () => {
	it("should have plus customers", async () => {
		const [result] = await connection.query("SELECT * FROM customers;");
		expect(result).toHaveLength(5);
	});
});
function getMysqlConn(): mysql.Connection | PromiseLike<mysql.Connection> {
	throw new Error("Function not implemented.");
}
