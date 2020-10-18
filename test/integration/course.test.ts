import * as fs from "fs";
import * as path from "path";
import { ScormClient } from "../../";

require("dotenv").config({ path: path.join(__dirname, ".env") });

const client = new ScormClient();

describe("ScormCloud Course Integration Tests", () => {
  beforeEach(() => {
    client.authenticate(process.env.SCORMCLOUD_APP_ID, process.env.SCORMCLOUD_SECRET_KEY, process.env.SCORMCLOUD_SCOPE);
  });

  test("Ping ScormCloud API", async () => {
    expect.assertions(3);

    const r = await client.ping();

    expect(r.apiMessage).toBeTruthy();
    expect(r.currentTime).toBeTruthy();

    client.invalidateAuth();

    try {
      await client.ping();
    } catch (e) {
      expect(e.message).toEqual("Not authenticated and no credentials are set");
    }
  });

  test("Upload, Fetch & Delete Course", async () => {
    expect.assertions(1);

    const r1 = await client.uploadCourse("iTESTXYZ", path.join(__dirname, "../fixtures/shiraz.pdf"), 5000);

    expect(r1.courseId).toBeTruthy();

    // const r2 = await client.uploadCourse("iTESTXYZ", path.join(__dirname, "../fixtures/shiraz.pdf"));

    // client.invalidateAuth();

    // try {
    //   await client.ping();
    // } catch (e) {
    //   expect(e.message).toEqual("Not authenticated and no credentials are set");
    // }
  });
});
