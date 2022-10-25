/* eslint-disable jest/no-conditional-expect */
import * as path from 'path'
import * as dotenv from 'dotenv'
import { ScormClient } from '../../src/client'

dotenv.config({ path: path.join(__dirname, '.env') })

const client = new ScormClient(
  process.env.SCORMCLOUD_APP_ID,
  process.env.SCORMCLOUD_SECRET_KEY,
  process.env.SCORMCLOUD_SCOPE
)

describe('Scorm Cloud Integration Tests', () => {
  // beforeEach(async () => {
  //   await client.authenticate(
  //     process.env.SCORMCLOUD_APP_ID,
  //     process.env.SCORMCLOUD_SECRET_KEY,
  //     process.env.SCORMCLOUD_SCOPE
  //   )
  // })

  test('Ping ScormCloud API', async () => {
    expect.assertions(4)

    const r1 = await client.ping()

    expect(r1.apiMessage).toBeDefined()
    expect(r1.currentTime).toBeDefined()

    const r2 = await client.ping({ scope: 'read' })

    expect(r2.apiMessage).toBeDefined()
    expect(r2.currentTime).toBeDefined()

    // client.invalidateAuth();
    // try {
    //   await client.ping();
    // } catch (e) {
    //   expect(e.httpStatus).toEqual(401);
    //   expect(e.message).toEqual("Not authenticated and no credentials are set");
    // }
  })

  test('Upload, Fetch & Delete Course', async () => {
    // expect.assertions(9)

    const COURSE_ID = 'TESTABCXYZ'

    // check that course does not already exist
    const course1 = await client.getCourse(COURSE_ID)

    expect(course1).toBeUndefined()

    // upload a course
    const response1 = await client.uploadCourse(COURSE_ID, path.join(__dirname, '../fixtures/shiraz.pdf'), {
      waitForResult: 5000
    })

    expect(response1.courseId).toBeDefined()
    expect(response1.courseId).toEqual(COURSE_ID)
    expect(response1.importJobId).toBeDefined()
    expect(response1.importJobResult).toBeDefined()
    expect(response1.importJobResult?.status).toEqual('COMPLETE')

    // fetch the course and confirm it exists
    const course2 = await client.getCourse(COURSE_ID)

    expect(course2).toBeDefined()
    expect(course2?.id).toEqual(COURSE_ID)
    expect(course2?.title).toEqual('shiraz')

    // upload course again, should fail because it already exists
    try {
      await client.uploadCourse(COURSE_ID, path.join(__dirname, '../fixtures/shiraz.pdf'))
    } catch (e) {
      expect(e.httpStatus).toEqual(409)
      expect(e.message.startsWith(`Course [${COURSE_ID}] already exists`)).toBeTruthy()
    }

    // upload the course again, but allow new version to be created
    const response2 = await client.uploadCourse(COURSE_ID, path.join(__dirname, '../fixtures/shiraz.pdf'), {
      mayCreateNewVersion: true,
      waitForResult: 7000
    })

    expect(response2.courseId).toBeDefined()
    expect(response2.importJobId).toBeDefined()
    expect(response2.importJobResult).toBeDefined()

    // delete the course
    const response3 = await client.deleteCourse(COURSE_ID)
    expect(response3.success).toBeTruthy()

    // fetch the course and confirm it no longer exists
    const course3 = await client.getCourse(COURSE_ID)
    expect(course3).toBeUndefined()
  })
})
