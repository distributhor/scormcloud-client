import {
  Response,
  ResponseError,
  HTTPError
} from 'superagent'

export interface ErrorObject {
  message: string
}

/** @internal */
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

export interface AuthToken {
  access_token: string
  expires_in?: number
  token_type?: string
  expires_at?: number
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

export interface Registration {
  id: string
  totalSecondsTracked?: number
  firstAccessDate?: string
  lastAccessDate?: string
  completedDate?: string
  createdDate?: string
  course?: Course
  learner?: Learner
}

export interface RegistrationProgress {
  id: string
  course: Course
  learner: Learner
  totalSecondsTracked: number
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

export interface LaunchLink {
  launchLink: string
}

export interface CourseImportResponse {
  courseId?: string
  importJobId?: string
  importJobResult?: ImportJobResult
}

export interface Learner {
  id: string
  firstName?: string
  lastName?: string
  email?: string
}

export interface Options {
  [key: string]: any
  /** The auth scope to use for the given method invocation */
  scope?: string
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

export interface CourseImportOptions extends Options {
  waitForResult?: number
  mayCreateNewVersion?: boolean
}

export interface RegistrationOptions extends Options {
  /**
   * To create a registration against a specific version of a course. Unless you have a reason for using this,
   * you probably do not need to.
   */
  courseVersion?: number
}

export interface LaunchLinkOptions extends Options {
  expiry?: number
}

export interface RegistrationProgressOptions extends Options {
  includeChildResults?: boolean
  includeInteractionsAndObjectives?: boolean
  includeRuntime?: boolean
}
