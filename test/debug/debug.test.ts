/* eslint-disable jest/no-conditional-expect */
import * as path from 'path'
import * as dotenv from 'dotenv'
import { ScormClient } from '../../src/client'

dotenv.config({ path: path.join(__dirname, '.debug.env') })

const client = new ScormClient(
  process.env.SCORMCLOUD_APP_ID ?? '',
  process.env.SCORMCLOUD_SECRET_KEY ?? '',
  process.env.SCORMCLOUD_SCOPE ?? 'read'
)

describe('Scorm Cloud Debug Tests', () => {
  test('Ping ScormCloud API', async () => {
    expect.assertions(2)

    const r1 = await client.ping()

    expect(r1.apiMessage).toBeDefined()
    expect(r1.currentTime).toBeDefined()
  })

  test('Fetch Course Import Status', async () => {
    const r1 = await client.getCourseImportStatus('N9LLNMD6Z1356474284-om')

    console.log(r1)

    expect(1).toBeDefined()
  })
})
