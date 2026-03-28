import { describe, it } from "node:test";
import request from "supertest";
import assert from "node:assert/strict";
import { StatusCodes } from "http-status-codes";
import { route } from "../src/presentation/http/routes/util/routes.ts";

import "./setup/mongo.ts";
import { createApp } from "../src/app.ts";

const app = createApp();

describe("health", () => {
  it("GET /health returns service health status", async () => {
    const res = await request(app).get(route("/health"));

    assert.equal(res.status, StatusCodes.OK);

    assert.equal(res.body.ok, true);
    assert.equal(res.body.service, process.env.SERVICE_NAME);
    assert.equal(typeof res.body.timestamp, "string");
  });
});
