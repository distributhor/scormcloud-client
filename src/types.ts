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

export interface CourseReference {
  id: string
  title?: string
  version: number
}

export const enum CompletionStatus {
  UNKNOWN = 'UNKNOWN',
  COMPLETED = 'COMPLETED',
  INCOMPLETE = 'INCOMPLETE',
}

export const enum SuccessStatus {
  UNKNOWN = 'UNKNOWN',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export interface Score {
  scaled: number
}

export interface CompletionAmount {
  scaled: number
}

export interface Registration {
  id: string
  instance?: number
  xapiRegistrationId?: string
  dispatchId?: string
  updated?: string // DATE
  registrationCompletion?: CompletionStatus
  registrationCompletionAmount?: number
  registrationSuccess?: SuccessStatus
  score?: Score
  totalSecondsTracked?: number
  firstAccessDate?: string // DATE
  lastAccessDate?: string // DATE
  completedDate?: string // DATE
  createdDate?: string // DATE
  course: CourseReference
  learner: Learner
  tags?: string[]
  globalObjectives?: Objective[]
  sharedData?: KeyValueEntry[]
  suspendedActivityId?: string
  activityDetails?: ActivityResult
}

export interface Objective {
  id: string
  primary?: boolean
  score?: Score
  scoreMax?: number
  scoreMin?: number
  scoreRaw?: number
  previousScoreScaled?: number
  firstScoreScaled?: number
  progressMeasure?: number
  firstSuccessTimeStamp?: string
  objectiveCompletion?: CompletionStatus
  objectiveSuccess?: SuccessStatus
  previousObjectiveSuccess?: SuccessStatus
}

export interface ActivityResult {
  id: string
  title?: string
  attempts?: number
  activityCompletion?: CompletionStatus
  activitySuccess?: SuccessStatus
  score?: Score
  timeTracked?: string
  completionAmount?: CompletionAmount
  suspended?: boolean
  children?: ActivityResult[]
  objectives?: Objective[]
  staticProperties?: StaticProperties
  runtime?: any // TODO
}

export interface StaticProperties {
  completionThreshold?: string
  launchData?: string
  maxTimeAllowed?: string
  scaledPassingScore?: number
  scaledPassingScoreUsed?: boolean
  timeLimitAction?: string
}

export interface KeyValueEntry {
  id: string
  value: string
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
  email?: string
  firstName?: string
  lastName?: string
}

export const enum ResultsFormat {
  ACTIVITY = 'ACTIVITY',
  COURSE = 'COURSE',
  FULL = 'FULL',
}

export const enum PostBackAuthType {
  HTTPBASIC = 'HTTPBASIC',
  FORM = 'FORM',
}

export interface PostBackOptions {
  url: string
  authType?: PostBackAuthType
  userName?: string
  password?: string
  resultsFormat?: ResultsFormat
  legacy?: boolean
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
   * To create a registration against a specific version of a course. Unless you have a reason for using this,hcxhur
   * you probably do not need to.
   */
  courseVersion?: number
  xapiRegistrationId?: string
  learnerTags?: string[]
  courseTags?: string[]
  registrationTags?: string[]
  postBack?: PostBackOptions
  initialRegistrationState?: Registration
  initialSettings?: any // TODO
}

export interface LaunchLinkOptions extends Options {
  expiry?: number
}

export interface RegistrationProgressOptions extends Options {
  includeChildResults?: boolean
  includeInteractionsAndObjectives?: boolean
  includeRuntime?: boolean
}
