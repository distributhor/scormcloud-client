/* eslint-disable jest/no-conditional-expect */
import * as path from 'path'
import * as dotenv from 'dotenv'
import { ScormClient } from '../../src/client'

dotenv.config({ path: path.join(__dirname, '.env') })

const client = new ScormClient(
  process.env.SCORMCLOUD_APP_ID ?? '',
  'BLAH',
  'read'
)

describe('Scorm Cloud Auth Test', () => {
  test('Ping ScormCloud API with invalid auth credentials', async () => {
    expect.assertions(1)

    try {
      await client.ping()
    } catch (e) {
      expect(e.httpStatus).toEqual(401)
      console.log(e.message)
      // expect(e.message.startsWith('Provided credentials are invalid')).toBeTruthy()
    }
  })
})
