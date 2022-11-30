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

export const enum JobStatus {
  RUNNING = 'RUNNING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface Score {
  /** Scaled score between 0 and 100 */
  scaled: number
}

export interface CompletionAmount {
  scaled: number
}

export interface Registration {
  id: string
  instance?: number

  /** xAPI registration id associated with this registration */
  xapiRegistrationId?: string

  /** Dispatch ID for this registration, if applicable */
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

export interface ItemValueEntry {
  item: string
  value: string
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
  status?: JobStatus
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

export interface PaginatedResponse {
  /** A pagination token with which the next set of results can be retrieved. When passing this token to a
   * request that accepts them, no other filter parameters should be sent as part of that request. The resources
   * will continue to respect the filters passed in by the original request. */
  more?: string
}

export interface CourseQueryResponse extends PaginatedResponse {
  courses: Course[]
}

export interface RegistrationQueryResponse extends PaginatedResponse {
  registrations: Registration[]
}

export interface Learner {
  id: string

  /** Optional email address associated with the learner */
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
  /** The url to post back to */
  url: string

  /** Optional parameter to specify how to authorize against the given postbackurl, can be 'form' or 'httpbasic'.
   * If form authentication, the username and password for authentication are submitted as form fields 'username'
   * and 'password', and the registration data as the form field 'data'. If httpbasic authentication is used,
   * the username and password are placed in the standard Authorization HTTP header, and the registration data
   * is the body of the message (sent as text/xml content type). This field is set to 'form' by default. */
  authType?: PostBackAuthType

  /** The user name to be used in authorizing the postback of data to the URL specified by postback url. */
  userName?: string

  /** The password to be used in authorizing the postback of data to the URL specified by postback url. */
  password?: string

  /** This parameter allows you to specify a level of detail in the information that is posted back while
   * the course is being taken. It may be one of three values: 'course' (course summary), 'activity' (activity
   * summary), or 'full' (full detail), and is set to 'course' by default. The information will be posted as
   * xml, and the format of that xml is specified below under the method 'getRegistrationResult' */
  resultsFormat?: ResultsFormat

  /** This paramenter is ONLY used for backwards compatibility with XML postback implementations. You probably
   * shouldn't need to use this unless you're currently transitioning from the V1 api to the V2 api and already
   * have existing XML postback logic in your application, but have not yet built out JSON postback logic. If a
   * registration is created with the V2 api we will assume that you're expecting JSON results unless otherwise
   * specified. */
  legacy?: boolean
}

export interface Options {
  // [key: string]: any

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

export const enum DateFilterField {
  CREATED = 'created',
  UPDATED = 'updated',
}

export interface DateFilter {
  /** Filter by ISO 8601 TimeStamp inclusive (defaults to UTC) */
  since?: string

  /** Filter by ISO 8601 TimeStamp inclusive (defaults to UTC) */
  until?: string
}

export interface QueryOptions extends DateFilter {
  /** The auth scope to use for the given method invocation */
  scope?: string

  /** Specifies field that `since` and `until` parameters (see {@link DateFilter}) are applied to */
  datetimeFilter?: DateFilterField

  /** Filter items matching ANY tag provided (not ALL) */
  tags?: string[]

  /** Optional string which filters results by a specified field, described by `filterBy` */
  filter?: string

  /** Optional parameter for specifying the field on which to run the filter. To know which fields are
   * valid fields for the particular query, consult the official API reference docs for the targeted
   * method (eg, [GetCourses](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/GetCourses)),
   * or see the client documentation for the method that overrides this interface (eg,
   * {@link CourseQueryOptions}) */
  filterBy?: string

  /** Optional parameter for specifying the field and order by which to sort the results. To know which fields
   * are valid fields for the particular query, consult the official API reference docs for the targeted method.
   * (eg, [GetRegistrations](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/GetRegistrations)),
   * or see the client documentation for the method that overrides this interface (eg,
   * {@link RegistrationQueryOptions}) */
  orderBy?: string

  /** A pagination token that was returned on the `more` property of paginated requests. If there are more results
   * to be collected, the token can be provided here to get the next page of results. When passing this token,
   * no other filter parameters can be sent as part of the request. The resources will continue to respect the
   * filters passed in by the original request. */
  more?: string
}

export interface CourseImportOptions extends Options {
  /** Should the function wait for the upload to finish and then return? Use with caution with larger uploads.
   * When waiting for the result, the response returned will include the {@link ImportJobResult}, otherwise a
   * separate call is necessary to retrieve this result once the upload is complete. */
  waitForResult?: number

  /** Is it OK to create a new version of this course? If this is set to false and the course already exists,
   * the upload will fail. If true and the course already exists then a new version will be created. No effect
   * if the course doesn't already exist. Default value : false */
  mayCreateNewVersion?: boolean

  /** An optional parameter that specifies a URL to send a postback to when the course has finished uploading. */
  postbackUrl?: string

  // /** The MIME type identifier for the content to be uploaded. This is required if uploading a
  //  * media file (.pdf, .mp3, or .mp4). Default value : application/zip */
  // uploadedContentType?: string

  /** While this option is available in the official API, it's currently unsupported on this client and setting it
   * will have no effect. The client automatically determines the content type of the file by inspecting the file
   * name suffix (zip, pdf, mp3 or mp4) and then setting the option internally. It will throw an error if the file
   * is not one of these types. In future, if required, this automatic 'check and set' might be removed, allowing
   * users of the client to handle it manually instead, and thus enabling this property for use.
   */
  uploadedContentType?: string

  /** Serialized 'mediaFileMetadata' schema */
  contentMetadata?: string
}

export const enum AssetUpdatePolicy {
  REJECT = 'reject',
  STRICT = 'strict',
  LAX = 'lax',
}

export interface CourseVersionAssetUploadOptions extends Options {
  /** Describes how SCORM Cloud should handle importing asset files with respect to overwriting files.
   *
   * Valid values :
   *  - lax
   *  - reject
   *  - strict
   *
   * Default value : lax
   *
   * A 'reject' policy request will fail if the asset file already exists on the system ('overwriting' not
   * allowed). A 'strict' policy request will fail if the asset file does not already exist ('overwriting' is
   * required). A 'lax' policy request will not consider whether the file already exists (i.e., it will attempt
   * to import in all cases). */

  updateAssetPolicy?: AssetUpdatePolicy
}

export interface CourseFetchOptions extends Options {
  /** Include the registration count in the results. Default value : false */
  includeRegistrationCount?: boolean

  /** Include course metadata in the results. If the course has no metadata, adding this parameter has no effect.
   * Default value : false */
  includeCourseMetadata?: boolean
}

export interface CourseQueryOptions extends QueryOptions {
  // Overriding the superclass method only in order to generate typedoc comment specific to this class
  /** Optional parameter for specifying the field and order by which to sort the results. Valid values are :
    - tags
    - title
    - course_id */
  filterBy?: string

  // Overriding the superclass method only in order to generate typedoc comment specific to this class
  /** Optional parameter for specifying the field and order by which to sort the results. Valid values are :
    - created_asc
    - created_desc
    - updated_asc
    - updated_desc
    - title_asc
    - title_desc */
  orderBy?: string

  /** Include the registration count in the results. Default value : false */
  includeRegistrationCount?: boolean

  /** Include course metadata in the results. If the course has no metadata, adding this parameter has no effect.
   * Default value : false */
  includeCourseMetadata?: boolean
}

export interface CourseVersionFetchOptions extends DateFilter {
  /** The auth scope to use for the given method invocation */
  scope?: string

  /** Include the registration count in the results. Default value : false */
  includeRegistrationCount?: boolean

  /** Include course metadata in the results. If the course has no metadata, adding this parameter has no effect.
   * Default value : false */
  includeCourseMetadata?: boolean
}

export interface RegistrationFetchOptions extends Options {
  /** Include information about each learning object, not just the top level in the results */
  includeChildResults?: boolean

  /** Include interactions and objectives in the results */
  includeInteractionsAndObjectives?: boolean

  /** Include runtime details in the results */
  includeRuntime?: boolean
}

export interface RegistrationQueryOptions extends QueryOptions {
  /** Only retrieve resources having courseId */
  courseId?: string

  /** Only retrieve resources having learnerId */
  learnerId?: string

  // Overriding the superclass method only in order to generate typedoc comment specific to this class
  /** Optional parameter for specifying the field and order by which to sort the results. Valid values are :
    - tags
    - course_title
    - learner_first_name
    - learner_last_name
    - registration_id */
  filterBy?: string

  // Overriding the superclass method only in order to generate typedoc comment specific to this class
  /** Optional parameter for specifying the field and order by which to sort the results. Valid values are :
    - created_asc
    - created_desc
    - updated_asc
    - updated_desc
    - course_title_asc
    - course_title_desc
    - learner_first_name_asc
    - learner_first_name_desc
    - learner_last_name_asc
    - learner_last_name_desc */
  orderBy?: string

  /** Include information about each learning object, not just the top level in the results */
  includeChildResults?: boolean

  /** Include interactions and objectives in the results */
  includeInteractionsAndObjectives?: boolean

  /** Include runtime details in the results */
  includeRuntime?: boolean
}

export interface RegistrationOptions extends Options {
  /** Unless you have a reason for using this you probably do not need to */
  courseVersion?: number

  /** The xapiRegistrationId to be associated with this registration. If not specified, the system will assign
   * an xapiRegistrationId. As per the xApi specification, this must be a UUID. */
  xapiRegistrationId?: string

  learnerTags?: string[]
  courseTags?: string[]
  registrationTags?: string[]
  postBack?: PostBackOptions
  initialRegistrationState?: Registration
  initialSettings?: any // TODO
}

export const enum LaunchAuthType {
  COOKIES = 'cookies',
  VAULT = 'vault',
}

export interface LaunchAuthOptions {
  ipAddress?: boolean
  fingerprint?: boolean
  expiry?: number
  slidingExpiry?: number
}

export interface LaunchAuth {
  type?: LaunchAuthType
  options?: LaunchAuthOptions
}

export interface LaunchLinkOptions extends Options {
  /** Number of seconds from now this link will expire in. Defaults to 120s. Range 10s:300s */
  expiry?: number

  /** Should this launch be tracked? If false, SCORM Cloud will avoid tracking to the extent possible for the
   * standard being used. */
  tracking?: boolean

  /** For SCORM, SCO identifier to override launch, overriding the normal sequencing */
  startSco?: string

  /** This parameter should specify a culture code. If specified, and supported, the navigation and alerts in
   * the player will be displayed in the associated language. If not specified, the locale of the user’s browser
   * will be used. */
  culture?: string

  /** A Url pointing to custom css for the player to use */
  cssUrl?: string
  learnerTags?: string[]
  courseTags?: string[]
  registrationTags?: string[]
  additionalvalues?: ItemValueEntry[]
  launchAuth?: LaunchAuth
}
