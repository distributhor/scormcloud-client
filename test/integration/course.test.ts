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
  process.env.SCORMCLOUD_APP_ID ?? '',
  process.env.SCORMCLOUD_SECRET_KEY ?? '',
  process.env.SCORMCLOUD_SCOPE ?? 'read'
)

describe('Scorm Cloud Integration Tests', () => {
  // beforeEach(async () => {
  //   await client.authenticate(
  //     process.env.SCORMCLOUD_APP_ID,
  //     process.env.SCORMCLOUD_SECRET_KEY,
  //     process.env.SCORMCLOUD_SCOPE
  //   )
  // })

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('Delete Registration', async () => {
  //   await client.deleteRegistration(REGISTRATION_ID)
  //   expect(1).toEqual(1)
  // })

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('Delete Course', async () => {
  //   await client.deleteCourse(COURSE_ID)
  //   expect(1).toEqual(1)
  // })

  test('Ping ScormCloud API', async () => {
    expect.assertions(6)

    const r1 = await client.ping()

    expect(r1.apiMessage).toBeDefined()
    expect(r1.currentTime).toBeDefined()

    const r2 = await client.ping()

    expect(r2.apiMessage).toBeDefined()
    expect(r2.currentTime).toBeDefined()

    const r3 = await client.ping({ scope: 'read' })

    expect(r3.apiMessage).toBeDefined()
    expect(r3.currentTime).toBeDefined()
  })

  test('Upload & Fetch Course', async () => {
    expect.assertions(14)

    // check that course does not already exist
    const course1 = await client.getCourse(COURSE_ID)

    expect(course1).toBeUndefined()

    // should upload a course
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

    // should fail to upload a duplicate course
    try {
      await client.uploadCourse(COURSE_ID, path.join(__dirname, `../fixtures/${COURSE_FIXTURE}`))
    } catch (e) {
      expect(e.httpStatus).toEqual(409)
      expect(e.message.startsWith(`Course [${COURSE_ID}] already exists`)).toBeTruthy()
    }

    // should upload the course again if version increment is allowed
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

    // confirm course has no registrations
    const r1 = await client.getRegistrationsForCourse(COURSE_ID)
    expect(r1).toEqual([])

    // confirm registration does not exist
    const r2 = await client.registrationExists(REGISTRATION_ID)
    expect(r2).toBeFalsy()

    // create registration
    const r3 = await client.createRegistration(REGISTRATION_ID, COURSE_ID, { id: LEARNER_ID })
    expect(r3.success).toBeTruthy()

    // confirm registration exists
    const r4 = await client.registrationExists(REGISTRATION_ID)
    expect(r4).toBeTruthy()

    // fetch registration
    const r5 = await client.getRegistrationsForCourse(COURSE_ID)
    expect(r5.length).toEqual(1)
    expect(r5[0].id).toEqual(REGISTRATION_ID)

    // fetch registration
    const r6 = await client.getRegistrationsForLearner(LEARNER_ID)
    expect(r6.length).toEqual(1)
    expect(r6[0].id).toEqual(REGISTRATION_ID)

    // should fail to create duplicate registration
    try {
      await client.createRegistration(REGISTRATION_ID, COURSE_ID, { id: LEARNER_ID })
    } catch (e) {
      expect(e.httpStatus).toEqual(400)
      expect(e.message.startsWith(`Registration with id [${REGISTRATION_ID}] already exists`)).toBeTruthy()
    }
  })

  test('Create Launch Link', async () => {
    expect.assertions(5)

    const link = await client.createLaunchLink(REGISTRATION_ID, 'https://cloud.scorm.com/')

    expect(link).toBeDefined()
    expect(link.launchLink).toBeDefined()
    expect(link.launchLink.startsWith('https://cloud.scorm.com/api/cloud/registration/launch')).toBeTruthy()

    try {
      await client.createLaunchLink('abc', 'https://cloud.scorm.com/')
    } catch (e) {
      expect(e.httpStatus).toEqual(404)
      expect(e.message.startsWith('Could not find registration [abc]')).toBeTruthy()
    }
  })

  test('Fetch Registration Progress', async () => {
    expect.assertions(5)

    const progress = await client.getRegistrationProgress(REGISTRATION_ID)

    expect(progress).toBeDefined()
    expect(progress.id).toEqual(REGISTRATION_ID)
    expect(progress.course.id).toEqual(COURSE_ID)
    expect(progress.learner.id).toEqual(LEARNER_ID)
    expect(progress.totalSecondsTracked).toBeDefined()
  })

  test('Delete Course & Registration', async () => {
    // delete the registration
    const r1 = await client.deleteRegistration(REGISTRATION_ID)
    expect(r1.success).toBeTruthy()

    // confirm the registration no longer exists
    const r2 = await client.registrationExists(REGISTRATION_ID)
    expect(r2).toBeFalsy()

    // confirm error is thrown when deleting non-existent registration
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

    // confirm error is thrown when deleting non-existent course
    try {
      await client.deleteCourse(COURSE_ID)
    } catch (e) {
      expect(e.httpStatus).toEqual(404)
      expect(e.message.startsWith('Could not find course')).toBeTruthy()
    }
  })
})
