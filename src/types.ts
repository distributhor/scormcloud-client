import { Response } from 'superagent'

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

/** @internal */
export interface ErrorProperty {
  error: string
}

/** @internal */
interface HttpResponse extends Response {
  body: any
  status: number
}

/** @internal */
interface HttpErrorResponse extends HttpResponse {
  body: ErrorProperty
  error: any
}

/** @internal */
export interface HttpError {
  response: HttpErrorResponse
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

export interface CourseUploadOptions extends Options {
  waitForResult?: number
  mayCreateNewVersion?: boolean
}
