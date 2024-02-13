import { app } from "../../../app.ts";
import supertest from "supertest";
import { restore } from "../../utils/database.ts";

beforeAll(() => {
	restore();
});

describe("get customer", () => {
	it("should get all custommer 4 item", async () => {
		const { body } = await supertest(app).get("/customer").expect(200);
		console.log(body);
		expect(body.result).toHaveLength(4);
	});
});
