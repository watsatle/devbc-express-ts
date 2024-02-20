import { app } from "../../../app.ts";
import supertest from "supertest";

describe("get store", () => {
  it("should get store id 1", async () => {
    const { body } = await supertest(app).get("/store/1").expect(200);
console.log (body)
    expect(body.result).toHaveLength(1);
    expect(body.result[0].id).toEqual(1)
    expect(body.result[0].name).toEqual("Good Eats")
  });
  it("should get empty from store id 0", async () => {
    const { body } = await supertest(app).get("/store/0").expect(200);
console.log (body)
    expect(body.result).toHaveLength(0);
  });
});