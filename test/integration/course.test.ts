import * as path from 'path'
import * as dotenv from 'dotenv'
import { ScormClient } from '../../src/client'

dotenv.config({ path: path.join(__dirname, '.env') })

// const client = new ScormClient(
//   process.env.SCORMCLOUD_APP_ID,
//   process.env.SCORMCLOUD_SECRET_KEY,
//   process.env.SCORMCLOUD_SCOPE
// );

const client = ScormClient.getInstance(
  process.env.SCORMCLOUD_APP_ID,
  process.env.SCORMCLOUD_SECRET_KEY,
  process.env.SCORMCLOUD_SCOPE
)

// const TEST_COURSE_ID = 'TESTABCXYZ'

describe('ScormCloud Course Integration Tests', () => {
  // beforeEach(() => {
  //   client.authenticate(process.env.SCORMCLOUD_APP_ID, process.env.SCORMCLOUD_SECRET_KEY, process.env.SCORMCLOUD_SCOPE);
  // });

  test('Ping ScormCloud API', async () => {
    expect.assertions(2)

    const r = await client.ping()

    expect(r.apiMessage).toBeDefined()
    expect(r.currentTime).toBeDefined()

    // client.invalidateAuth();
    // try {
    //   await client.ping();
    // } catch (e) {
    //   expect(e.status).toEqual(401);
    //   expect(e.message).toEqual("Not authenticated and no credentials are set");
    // }
  })

  // test("Upload, Fetch & Delete Course", async () => {
  //   expect.assertions(9);

  //   // check that course does not already exist
  //   const course1 = await client.getCourse(TEST_COURSE_ID);
  //   expect(course1).toBeNull();

  //   // upload a course
  //   const response1 = await client.uploadCourse(TEST_COURSE_ID, path.join(__dirname, "../fixtures/shiraz.pdf"), {
  //     waitForResult: 5000,
  //   });

  //   expect(response1.courseId).toBeDefined();

  //   // fetch the course and confirm it exists
  //   const course2 = await client.getCourse(TEST_COURSE_ID);
  //   expect(course2).toBeDefined();
  //   expect(course2.title).toBeDefined();

  //   // upload course again, should fail because it already exists
  //   try {
  //     await client.uploadCourse(TEST_COURSE_ID, path.join(__dirname, "../fixtures/shiraz.pdf"));
  //   } catch (e) {
  //     expect(e.status).toEqual(409);
  //     expect(e.message.startsWith(`Course [${TEST_COURSE_ID}] already exists in app`)).toBeTruthy();
  //   }

  //   // upload the course again, but allow new version to be created
  //   const response2 = await client.uploadCourse(TEST_COURSE_ID, path.join(__dirname, "../fixtures/shiraz.pdf"), {
  //     mayCreateNewVersion: true,
  //     waitForResult: 7000,
  //   });

  //   expect(response2.courseId).toBeDefined();

  //   // delete the course
  //   const response3 = await client.deleteCourse(TEST_COURSE_ID);
  //   expect(response3.success).toBeTruthy();

  //   // fetch the course and confirm it no longer exists
  //   const course3 = await client.getCourse(TEST_COURSE_ID);
  //   expect(course3).toBeNull();
  // });
})
