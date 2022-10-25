import {
  Response,
  ResponseError,
  HTTPError
} from 'superagent'

// const enum Auth {
//   OAUTH = "OAUTH",
//   APP_NORMAL = "APP_NORMAL",
//   APP_MANAGEMENT = "APP_MANAGEMENT",
// }

export interface AuthToken {
  access_token: string
  expires_in?: number
  token_type?: string
}

export interface ErrorObject {
  message: string
}

export interface ErrorProperty {
  error: string
}

/** @internal */
export interface HttpResponse extends Response {
  body: any
  status: number
}

/** @internal */
export interface HttpError extends ResponseError {
  status: number
  response: HttpErrorResponse
}

/** @internal */
interface HttpErrorResponse extends Response {
  body: ErrorProperty
  error: HTTPError
}

export interface PingResponse {
  apiMessage: string
  currentTime: string
}

export interface SuccessIndicator {
  success: boolean
  message?: string
}

export interface CourseMeta {
  title?: string
  titleLanguage?: string
  description?: string
  descriptionLanguage?: string
  duration?: string
  typicaltime?: string
  keywords?: string[]
}

export interface CourseActivity {
  externalIdentifier?: string
  itemIdentifier?: string
  resourceIdentifier?: string
  activityType?: string
  href?: string
  scaledPassingScore?: string
  title?: string
  children?: CourseActivity[]
}

export interface Course {
  id?: string
  title?: string
  xapiActivityId?: string
  created?: string // Date
  updated?: string // Date
  version?: number
  registrationCount?: number
  activityId?: string
  courseLearningStandard?: string
  tags?: string[]
  dispatched?: boolean
  metadata?: CourseMeta
  rootActivity?: CourseActivity
}

export interface ImportResult {
  webPathToCourse?: string
  parserWarnings?: string[]
  courseLanguages?: string[]
  course?: Course
}

export interface ImportJobResult {
  jobId?: string
  status?: string
  message?: string
  importResult?: ImportResult
}

export interface CourseUploadResponse {
  courseId?: string
  importJobId?: string
  importJobResult?: ImportJobResult
}

export interface Options {
  [key: string]: any
  // isRetry?: boolean;
}

// export class Opts extends Map<string, any> implements Options {
//   constructor(obj?: Partial<Options>) {
//     super()
//     // Object.assign(this, obj)
//     if (obj) {
//       for (const k of Object.keys(obj)) {
//         this.set(k, obj[k])
//       }
//     }
//   }
// }

export interface CourseUploadOptions extends Options {
  waitForResult?: number
  mayCreateNewVersion?: boolean
}
