/* eslint-disable jest/no-conditional-expect */
import * as path from 'path'
import * as dotenv from 'dotenv'
import { ScormClient } from '../../src/client'

dotenv.config({ path: path.join(__dirname, '.env') })

const COURSE_FIXTURE = 'shiraz.pdf'
const COURSE_ID = 'COURSEABC'
const LEARNER_ID = 'LEARNER123'
const REGISTRATION_ID = 'REGXYZ'

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
  })

  test('Upload & Fetch Course', async () => {
    expect.assertions(14)

    // check that course does not already exist
    const course1 = await client.getCourse(COURSE_ID)

    expect(course1).toBeUndefined()

    // upload a course
    const r1 = await client.uploadCourse(COURSE_ID, path.join(__dirname, `../fixtures/${COURSE_FIXTURE}`), {
      waitForResult: 5000
    })

    expect(r1.courseId).toBeDefined()
    expect(r1.courseId).toEqual(COURSE_ID)
    expect(r1.importJobId).toBeDefined()
    expect(r1.importJobResult).toBeDefined()
    expect(r1.importJobResult?.status).toEqual('COMPLETE')

    // fetch the course and confirm it exists
    const course2 = await client.getCourse(COURSE_ID)

    expect(course2).toBeDefined()
    expect(course2?.id).toEqual(COURSE_ID)
    expect(course2?.title).toEqual('shiraz')

    // upload course again, should fail because it already exists
    try {
      await client.uploadCourse(COURSE_ID, path.join(__dirname, `../fixtures/${COURSE_FIXTURE}`))
    } catch (e) {
      expect(e.httpStatus).toEqual(409)
      expect(e.message.startsWith(`Course [${COURSE_ID}] already exists`)).toBeTruthy()
    }

    // upload the course again, but allow new version to be created
    const r2 = await client.uploadCourse(COURSE_ID, path.join(__dirname, `../fixtures/${COURSE_FIXTURE}`), {
      mayCreateNewVersion: true,
      waitForResult: 7000
    })

    expect(r2.courseId).toBeDefined()
    expect(r2.importJobId).toBeDefined()
    expect(r2.importJobResult).toBeDefined()
  })

  test('Create & Fetch Registration', async () => {
    expect.assertions(10)

    const r1 = await client.getRegistrationsForCourse(COURSE_ID)
    expect(r1).toEqual([])

    const r2 = await client.registrationExists(REGISTRATION_ID)
    expect(r2).toBeFalsy()

    const r3 = await client.createRegistration({ id: LEARNER_ID }, COURSE_ID, REGISTRATION_ID)
    expect(r3.success).toBeTruthy()

    const r4 = await client.getRegistrationsForCourse(COURSE_ID)
    expect(r4.length).toEqual(1)
    expect(r4[0].id).toEqual(REGISTRATION_ID)

    const r5 = await client.getRegistrationsForLearner(LEARNER_ID)
    expect(r5.length).toEqual(1)
    expect(r5[0].id).toEqual(REGISTRATION_ID)

    const r6 = await client.registrationExists(REGISTRATION_ID)
    expect(r6).toBeTruthy()

    try {
      await client.createRegistration({ id: LEARNER_ID }, COURSE_ID, REGISTRATION_ID)
    } catch (e) {
      expect(e.httpStatus).toEqual(400)
      expect(e.message.startsWith(`Registration with id [${REGISTRATION_ID}] already exists`)).toBeTruthy()
    }
  })

  test('Delete Course & Registration', async () => {
    // delete the registration
    const r1 = await client.deleteRegistration(REGISTRATION_ID)
    expect(r1.success).toBeTruthy()

    // confirm the registration no longer exists
    const r2 = await client.registrationExists(REGISTRATION_ID)
    expect(r2).toBeFalsy()

    try {
      await client.deleteRegistration(REGISTRATION_ID)
    } catch (e) {
      expect(e.httpStatus).toEqual(404)
      expect(e.message.startsWith('Could not find registration')).toBeTruthy()
    }

    // delete the course
    const r3 = await client.deleteCourse(COURSE_ID)
    expect(r3.success).toBeTruthy()

    // confirm the course no longer exists
    const course = await client.getCourse(COURSE_ID)
    expect(course).toBeUndefined()

    try {
      await client.deleteCourse(COURSE_ID)
    } catch (e) {
      expect(e.httpStatus).toEqual(404)
      expect(e.message.startsWith('Could not find course')).toBeTruthy()
    }
  })

  // test('Delete Registration', async () => {
  //   await client.deleteRegistration(REGISTRATION_ID)
  //   expect(1).toEqual(1)
  // })

  // test('Delete Course', async () => {
  //   await client.deleteCourse(COURSE_ID)
  //   expect(1).toEqual(1)
  // })
})
