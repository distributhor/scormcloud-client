/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
import { DateTime } from 'luxon'
import request from 'superagent'
import {
  AuthToken,
  HttpError,
  ErrorObject,
  ErrorProperty,
  Options,
  Course,
  Learner,
  LaunchLink,
  Registration,
  PingResponse,
  ImportJobResult,
  SuccessIndicator,
  CourseFetchOptions,
  CourseQueryOptions,
  CourseQueryResponse,
  CourseImportOptions,
  CourseImportResponse,
  LaunchLinkOptions,
  RegistrationOptions,
  RegistrationFetchOptions,
  RegistrationQueryOptions,
  RegistrationQueryResponse,
  CourseVersionFetchOptions,
  CourseVersionAssetUploadOptions
} from './types'

/** @internal */
const BASE_PATH = 'https://cloud.scorm.com/api/v2'

/** @internal */
const HttpStatus = {
  isSuccess: (r: any): boolean => {
    return !!(r.status && (r.status === 200 || r.status === 204))
  },

  notFound: (r: any): boolean => {
    return !!(r.status && r.status === 404)
  },

  isUnauthorized: (e: any): boolean => {
    if (e.status) {
      return e.status === 401
    }
    return !!(e.response && e.response.status === 401)
  }
}

/** @internal */
export const TypeChecks = {
  containsErrorProperty: (x: any): x is ErrorProperty => {
    if (x.error) {
      return true
    }

    return false
  },

  isErrorObject: (x: any): x is ErrorObject => {
    if (x.message) {
      return true
    }

    return false
  },

  isAuthToken: (x: any): x is AuthToken => {
    if (x.access_token) {
      return true
    }

    return false
  },

  isHttpError: (x: any): x is HttpError => {
    if (x.response?.error) {
      return true
    }

    return false
  }
}

/** @internal */
export const Util = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  hasProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    // eslint-disable-next-line no-prototype-builtins
    return obj.hasOwnProperty(prop)
  },

  getOption: (name: string, options?: Partial<Options>): any => {
    return options?.[name]
  },

  sleep: (milliseconds: number): unknown => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  },

  scormUploadType: (f: string): string => {
    if (!f) {
      throw new ScormClientError('No scorm file path/name received')
    }

    if (f.toLowerCase().endsWith('zip')) {
      return 'application/zip'
    }

    if (f.toLowerCase().endsWith('pdf')) {
      return 'application/pdf'
    }

    if (f.toLowerCase().endsWith('mp3')) {
      return 'audo/mpeg'
    }

    if (f.toLowerCase().endsWith('mp4')) {
      return 'video/mp4'
    }

    throw new ScormClientError('Invalid scorm file type, only zip, pdf, mp3 and mp4 supported')
  }
}

export class ScormClientError extends Error {
  public httpStatus: number | undefined
  public cause: ErrorObject | undefined

  /** @internal */
  constructor(cause: any, message?: string, httpStatus?: number) {
    const e = ScormClientError.parse(cause, message, httpStatus)

    super(e.message)

    this.name = 'ScormClientError'
    this.message = e.message
    this.cause = e.error

    this.httpStatus = e.httpStatus

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScormClientError)
    }
  }

  private static parseMessage(cause: any, message?: string): string {
    if (message) {
      return message
    }

    if (typeof cause === 'string') {
      return cause
    }

    if (TypeChecks.isHttpError(cause)) {
      if (cause.response.body.error) {
        return cause.response.body.error
      }

      return cause.response.error.message
    }

    if (TypeChecks.containsErrorProperty(cause)) {
      return cause.error
    }

    if (TypeChecks.isErrorObject(cause)) {
      return cause.message
    }

    return 'Unknown Error'
  }

  private static parseHttpStatus(cause: any, httpStatus?: number): number | undefined {
    if (httpStatus) {
      return httpStatus
    }

    if (TypeChecks.isHttpError(cause)) {
      return cause.response.status
    }

    return undefined
  }

  private static parseErrorObject(cause: any): ErrorObject | undefined {
    return TypeChecks.isErrorObject(cause) ? cause : undefined
  }

  private static parse(cause: any, message?: string, httpStatus?: number): any {
    return {
      message: ScormClientError.parseMessage(cause, message),
      httpStatus: ScormClientError.parseHttpStatus(cause, httpStatus),
      error: ScormClientError.parseErrorObject(cause)
    }
  }
}

/**
 *
 * Usage example:
 *
 * ```ts
 * import { ScormClient } from 'scorm-client'
 *
 * const client = new ScormClient(appId, secretKey, "read")
 *
 * // will fetch a course using a token with the default scope, in this case 'read'
 * const course: Course = await client.getCourse(courseId)
 *
 * // will delete a course using a token with 'write' scope
 * const result: SuccessIndicator = await client.deleteCourse(courseId, { scope: 'write' })
 * ```
 *
 * You will notice that no call has been made to the `authenticate()` method before starting to use the client.
 * When a method is invoked and no valid auth token for the given scope can be found, then the client will attempt
 * to authenticate and fetch a token for that scope. As such, tokens are explicitly associated with a specific scope,
 * and the client will internally manage a set of tokens and their associated scopes.
 *
 * Any future calls for a given scope will use the token associated with it. If no scope is specified (in the
 * `options` for a method), then the default scope (assigned at client instantiation) will be assumed. You are able
 * to manually `authenticate()` different scopes, which is simply asking the client to fetch and store a token for
 * a scope, such that it is immediately available in method calls later.
 *
 * Note: the scope can also be a list of space separated scopes, e.g. "write:course read:registration". In such a
 * case the token will be associated with all the specified scopes.
 */
export class ScormClient {
  private readonly appId: string
  private readonly secretKey: string

  private readonly defaultScope: string
  private readonly defaultExpiry: number

  private readonly authorisations = new Map<string, AuthToken>()

  /**
   * @param appId A SCORM Cloud application ID
   * @param secretKey The secret key for the given application ID
   * @param defaultScope An auth scope or space separated list of scopes, e.g. "write:course read:registration".
   * This will be the default scope used if a method on the client is invoked without specifying an explicit
   * scope in the method's {@link types.Options}
   * @param defaultExpiry The amount of time, in seconds, after which auth tokens should expire. If unspecified,
   * it will default to 3600 (1 hour)
   */
  constructor(appId: string, secretKey: string, defaultScope: string, defaultExpiry: number = 3600) {
    this.appId = appId
    this.secretKey = secretKey
    this.defaultScope = defaultScope
    this.defaultExpiry = defaultExpiry
  }

  private getTargetScope(scope?: string | Options): string | undefined {
    if (!scope) {
      return this.defaultScope
    }

    if (typeof scope === 'string') {
      return scope
    }

    if (scope?.scope) {
      return scope.scope
    }

    return this.defaultScope
  }

  private getAuthToken(scope?: string | Options): AuthToken | undefined {
    const targetScope = this.getTargetScope(scope)
    if (!targetScope) {
      return undefined
    }

    return this.authorisations.has(targetScope)
      ? this.authorisations.get(targetScope)
      : undefined
  }

  private getBearerString(scope?: string | Options): string {
    const authToken = this.getAuthToken(scope)
    return authToken
      ? `Bearer ${authToken.access_token}`
      : ''
  }

  private async authorise(scope?: string | Options): Promise<AuthToken | undefined> {
    const authToken = this.getAuthToken(scope)

    if (!authToken) {
      if (this.appId && this.secretKey) {
        const targetScope = this.getTargetScope(scope)
        if (targetScope) {
          return await this.authenticate(targetScope)
        }

        throw new ScormClientError('Unspecified scope', undefined, 401)
      }

      throw new ScormClientError('No authentication credentials found', undefined, 401)
    }

    if (authToken.expires_at && DateTime.now().valueOf() > authToken.expires_at) {
      if (this.appId && this.secretKey) {
        const targetScope = this.getTargetScope(scope)
        if (targetScope) {
          return await this.authenticate(targetScope)
        }

        throw new ScormClientError('Unspecified scope', undefined, 401)
      }

      throw new ScormClientError('Unable to refresh authentication token', undefined, 401)
    }

    return authToken
  }

  /**
   * Attempt to authenticate and store an auth token, associated with a given scope
   *
   * @param scope An auth scope or space separated list of scopes
   * @param expiry The amount of time, in seconds, after which the auth token should expire. If unspecified,
   * it will use the default value provided in the constructor.
   * @throws {@link ScormClientError} with an `httpStatus` of 401 on authentication failure
   */
  async authenticate(scope: string, expiry?: number): Promise<AuthToken> {
    if (!this.appId) {
      throw new ScormClientError('No APP ID defined')
    }

    if (!this.secretKey) {
      throw new ScormClientError('No SECRET KEY defined')
    }

    const ttl = expiry ?? this.defaultExpiry

    try {
      const response = await request
        .post(`${BASE_PATH}/oauth/authenticate/application/token`).type('form')
        .auth(this.appId, this.secretKey)
        .send(`scope=${scope}`)
        .send(`expiration=${ttl}`)

      if (!TypeChecks.isAuthToken(response.body)) {
        throw new ScormClientError('Invalid auth token received')
      }

      const token = response.body

      token.expires_at = DateTime.now().plus({ seconds: ttl - 60 }).valueOf()

      this.authorisations.set(scope, token)

      return response.body
    } catch (e) {
      // this.authToken = undefined ??
      throw new ScormClientError(e)
    }
  }

  /**
   * Get back a message indicating that the API is working
   *
   * [API Method - PingAppId](https://cloud.scorm.com/docs/v2/reference/swagger/#/ping/PingAppId)
   *
   * @param options Options
   * @throws {@link ScormClientError} if invalid ping response received, or an error was encountered
   */
  async ping(options: Options = {}): Promise<PingResponse> {
    await this.authorise(options)

    try {
      return (await request.get(`${BASE_PATH}/ping`).set('Authorization', this.getBearerString(options))).body
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * Returns detailed information about the course.
   *
   * [API Method - GetCourse](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/GetCourse)
   *
   * @param courseId The course ID
   * @param options CourseFetchOptions
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
   * @returns The requested {@link types.Course}, or `undefined` if the course was not found
   */
  async getCourse(courseId: string, options: CourseFetchOptions = {}): Promise<Course | undefined> {
    await this.authorise(options)

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    try {
      const query: any = {
        includeRegistrationCount: options.includeRegistrationCount ?? undefined,
        includeCourseMetadata: options.includeCourseMetadata ?? undefined
      }

      return (
        await request
          .get(`${BASE_PATH}/courses/${courseId}`)
          .set('Authorization', this.getBearerString(options))
          .query(query)
      ).body
    } catch (e) {
      if (HttpStatus.notFound(e)) {
        return undefined
      }

      throw new ScormClientError(e)
    }
  }

  /**
   * Returns a list of courses. Can be filtered to provide a subset of results.
   *
   * This request is paginated and will only provide a limited amount of resources at a time. If there are more
   * results to be collected, a more token provided with the response which can be passed to get the next page
   * of results. When passing this token, no other filter parameters can be sent as part of the request. The
   * resources will continue to respect the filters passed in by the original request.

   * [API Method - GetCourses](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/GetCourses)
   *
   * @param options CourseQueryOptions
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
   * @returns A {@link types.CourseQueryResponse} that has a property named `courses`, which is an array
   * of type {@link types.Course}, or an empty array if no courses were found. It also includes a
   * '`more`' property which, if present, can be used to retrieve the next paginated set of results
   */
  async getCourses(options: CourseQueryOptions = {}): Promise<CourseQueryResponse> {
    await this.authorise(options)

    try {
      const query: any = {
        since: options.since ?? undefined,
        until: options.until ?? undefined,
        datetimeFilter: options.datetimeFilter ?? undefined,
        tags: options.tags ?? undefined,
        filter: options.filter ?? undefined,
        filterBy: options.filterBy ?? undefined,
        orderBy: options.orderBy ?? undefined,
        more: options.more ?? undefined,
        includeCourseMetadata: options.includeCourseMetadata ?? undefined,
        includeRegistrationCount: options.includeRegistrationCount ?? undefined
      }

      return (
        await request
          .get(`${BASE_PATH}/courses`)
          .set('Authorization', this.getBearerString(options))
          .query(query)
      ).body
    } catch (e) {
      if (HttpStatus.notFound(e)) {
        throw new ScormClientError(e, 'Bad request, likely due to invalid query options', 400)
      }

      throw new ScormClientError(e)
    }
  }

  /**
   * Creates a course from a package uploaded from your file system. The package will be sent as part of the request
   * and will be stored in SCORM Cloud. An import job ID will be returned, which can be used with {@link getCourseImportStatus}
   * to view the status of the import. Courses represent the learning material a learner will progress through.
   * Note: The import job ID is only valid for one week after the course import finishes.
   *
   * [API Method - CreateUploadAndImportCourseJob](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/CreateUploadAndImportCourseJob)
   *
   * @param courseId The course ID
   * @param filePath The path to the file that must be imported to SCORM Cloud
   * @param options CourseImportOptions
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
   * @returns A {@link types.CourseImportResponse} if successfull
   */
  async importCourse(
    courseId: string,
    filePath: string,
    options: CourseImportOptions = {}
  ): Promise<CourseImportResponse> {
    await this.authorise(options)

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    if (!filePath) {
      throw new ScormClientError('No filePath provided')
    }

    const fileType = Util.scormUploadType(filePath)
    const authString = this.getBearerString(options)

    try {
      const query = {
        courseId,
        mayCreateNewVersion: options.mayCreateNewVersion ?? undefined,
        postbackUrl: options.postbackUrl ?? undefined
      }

      async function postUploadJob(
        filePath: string,
        fileType: string,
        authString: string,
        options: CourseImportOptions): Promise<request.Response> {
        const contentMetadata = options.contentMetadata ?? undefined

        if (contentMetadata) {
          return await request
            .post(`${BASE_PATH}/courses/importJobs/upload`).type('form')
            .set('Authorization', authString)
            .set('uploadedContentType', fileType)
            .query(query)
            .send({ contentMetadata })
            .attach('file', filePath)
        }

        return await request
          .post(`${BASE_PATH}/courses/importJobs/upload`).type('form')
          .set('Authorization', authString)
          .set('uploadedContentType', fileType)
          .query(query)
          .attach('file', filePath)
      }

      const response = await postUploadJob(filePath, fileType, authString, options)

      if (!response.body.result) {
        return {
          courseId: undefined,
          importJobId: undefined
        }
      }

      if (!options.waitForResult) {
        return {
          courseId,
          importJobId: response.body.result,
          importJobResult: undefined
        }
      }

      await Util.sleep(options.waitForResult)

      const importJobResult = await this.getCourseImportStatus(response.body.result)

      return {
        courseId,
        importJobId: response.body.result,
        importJobResult
      }
    } catch (e) {
      // TODO : handle "409 conflict, courseId exists and mayCreateNewVersion is false" ?
      throw new ScormClientError(e)
    }
  }

  /**
   * Check the status of a course import. This can be called incrementally to check the progress of a call to any
   * of the import options. Note: The import job ID is only valid for one week after the course import finishes.
   *
   * [API Method - GetImportJobStatus](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/GetImportJobStatus)
   *
   * @param jobId The import job ID
   * @param options Options
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
   * @returns A {@link types.ImportJobResult}, or `undefined` if no job result was not found
   */
  async getCourseImportStatus(jobId: string, options: Options = {}): Promise<ImportJobResult | undefined> {
    await this.authorise(options)

    if (!jobId) {
      throw new ScormClientError('No jobId provided')
    }

    try {
      return (
        await request
          .get(`${BASE_PATH}/courses/importJobs/${jobId}`)
          .set('Authorization', this.getBearerString(options))
      ).body
    } catch (e) {
      if (HttpStatus.notFound(e)) {
        return undefined
      }

      throw new ScormClientError(e)
    }
  }

  /**
   * Updates the title of the course.
   *
   * [API Method - SetCourseTitle](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/SetCourseTitle)
   *
   * @param courseId The course ID
   * @param title The new title to be set
   * @param options Options
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered,
   * or if the referenced course does not exist
   * @returns A {@link types.SuccessIndicator}
   */
  async setCourseTitle(courseId: string, title: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    if (!title) {
      throw new ScormClientError('No title provided')
    }

    try {
      const response = await request
        .put(`${BASE_PATH}/courses/${courseId}/title`)
        .set('Authorization', this.getBearerString(options))
        .send({ title })

      const success = HttpStatus.isSuccess(response)

      return {
        success,
        message: success ? '' : `Failed to set course title '${courseId}'`
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * Deletes the specified course. When a course is deleted, so is everything connected to the course. This includes:
   * - Registrations
   * - Invitations
   * - Dispatches
   * - Debug Logs
   *
   * [API Method - DeleteCourse](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/DeleteCourse)
   *
   * @param courseId The course ID
   * @param options Options
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered,
   * or if the referenced course does not exist
   * @returns A {@link types.SuccessIndicator}
   */
  async deleteCourse(courseId: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    try {
      const response = await request
        .delete(`${BASE_PATH}/courses/${courseId}`)
        .set('Authorization', this.getBearerString(options))

      const success = HttpStatus.isSuccess(response)

      return {
        success,
        message: success ? '' : `Failed to delete course '${courseId}'`
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * TODO: Test this function to see what happens with non-existent courses and/or course versions and confirm what
   * is return and what is thrown. Update the function to handle scenarios appropriately ...
   *
   * Returns information about all versions of the course. This can be useful to see information such as registration
   * counts and modification times across the versions of a course.
   *
   * [API Method - GetCourseVersions](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/GetCourseVersions)
   *
   * @param courseId The course ID
   * @param options CourseVersionFetchOptions
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered,
   * @returns An array of {@link types.Course}, or an empty array if no courses were found. This method does not
   * support pagination, all versions will be returned
   */
  async getCourseVersions(courseId: string, options: CourseVersionFetchOptions = {}): Promise<Course[] | undefined> {
    await this.authorise(options)

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    try {
      const query: any = {
        since: options.since ?? undefined,
        until: options.until ?? undefined,
        includeCourseMetadata: options.includeCourseMetadata ?? undefined,
        includeRegistrationCount: options.includeRegistrationCount ?? undefined
      }

      const response = await request
        .get(`${BASE_PATH}/courses/${courseId}/versions`)
        .set('Authorization', this.getBearerString(options))
        .query(query)

      return response.body.courses || []
    } catch (e) {
      if (HttpStatus.notFound(e)) {
        throw new ScormClientError(e, 'Bad request, likely due to invalid query options', 400)
      }

      throw new ScormClientError(e)
    }
  }

  /**
   * Deletes the specified version of the course. If deleting the last remaining version of the course,
   * the course itself will be deleted and no longer accessible. When a course is deleted, so is everything
   * connected to the course. This includes:
   * - Registrations
   * - Invitations
   * - Dispatches
   * - Debug Logs
   *
   * [API Method - DeleteCourseVersion](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/DeleteCourseVersion)
   *
   * @param courseId The course ID
   * @param versionNumber The version number
   * @param options Options
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered,
   * or if the referenced course does not exist
   * @returns A {@link types.SuccessIndicator}
   */
  async deleteCourseVersion(courseId: string, versionNumber: number, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    if (!versionNumber) {
      throw new ScormClientError('No versionNumber provided')
    }

    try {
      const response = await request
        .delete(`${BASE_PATH}/courses/${courseId}/versions/${versionNumber}`)
        .set('Authorization', this.getBearerString(options))

      const success = HttpStatus.isSuccess(response)

      return {
        success,
        message: success ? '' : `Failed to delete course version '${courseId}:${versionNumber}'`
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * Creates or updates an asset file uploaded from your file system into the course version. The file will be sent
   * as part of the request and will be stored in SCORM Cloud alongside the course. This is a useful way to modify
   * the course structure without needing to reimport the whole course after you've made changes.
   *
   * If the course structure is being heavily modified, consider creating a new version instead. This can be done by
   * calling {@link importCourse}, while passing true for mayCreateNewVersion
   *
   * [API Method - UploadCourseVersionAssetFile](https://cloud.scorm.com/docs/v2/reference/swagger/#/course/UploadCourseVersionAssetFile)
   *
   * @param courseId The course ID
   * @param versionNumber The version number
   * @param filePath The local path to the file that must be imported to SCORM Cloud
   * @param destinationPath The relative path from the course's base directory on SCORM Cloud, to where the asset file will be uploaded
   * @param options CourseVersionAssetUploadOptions
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
   * @returns A {@link types.CourseVersionAssetUploadResponse} if successfull
   */
  async uploadCourseVersionAssetFile(
    courseId: string,
    versionNumber: number,
    filePath: string,
    destinationPath: string,
    options: CourseVersionAssetUploadOptions = {}
  ): Promise<SuccessIndicator> {
    await this.authorise(options)

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    if (!versionNumber) {
      throw new ScormClientError('No versionNumber provided')
    }

    if (!filePath) {
      throw new ScormClientError('No filePath provided')
    }

    if (!destinationPath) {
      throw new ScormClientError('No destinationPath provided')
    }

    try {
      const query = {
        updateAssetPolicy: options.updateAssetPolicy ?? undefined
      }

      const response = await request
        .post(`${BASE_PATH}/courses/${courseId}/versions/${versionNumber}/asset/upload`).type('form')
        .set('Authorization', this.getBearerString(options))
        .query(query)
        .send({ destination: destinationPath })
        .attach('file', filePath)

      const success = HttpStatus.isSuccess(response)

      const file: string = success && response.body.filename ? response.body.filename : ''
      const destination: string = success && response.body.destination ? response.body.destination : ''
      const successMessage = success && file
        ? `File '${file}' uploaded to '${destination}'`
        : 'File uploaded'

      return {
        success,
        message: success ? successMessage : `Failed to set upload asset for course '${courseId}'`
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * Creates a new registration. Registrations are the billable unit in SCORM Cloud, and represents the link between
   * a learner and a course. A registration will contain a few pieces of information such as learner identifiers,
   * the id of the course being registered for, and several other optional fields.
   *
   * A registration must be tied to a specific course at creation time. When the registration is "launched"
   * (see {@link createLaunchLink}), the course specified at creation time will be launched.
   *
   * [API Method - CreateRegistration](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/CreateRegistration)
   *
   * @param registrationId An ID for this registration
   * @param courseId The course ID for which the learner should be registered
   * @param learner The details of the learner, at minimum a learner ID should be specified
   * @param options RegistrationOptions
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered,
   * or if the referenced course or learner does not exist, or if creating a duplicate registration
   * @returns A {@link types.SuccessIndicator}
   */
  async createRegistration(
    registrationId: string,
    courseId: string,
    learner: Learner,
    options: RegistrationOptions = {}
  ): Promise<SuccessIndicator> {
    await this.authorise(options)

    if (!registrationId) {
      throw new ScormClientError('No registrationId provided')
    }

    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    if (!learner) {
      throw new ScormClientError('No learner details provided')
    }

    try {
      const query = {
        courseVersion: options.courseVersion ?? undefined
      }

      const registration = {
        courseId,
        learner,
        registrationId,
        xapiRegistrationId: options.xapiRegistrationId ?? undefined,
        learnerTags: options.learnerTags ?? undefined,
        courseTags: options.courseTags ?? undefined,
        registrationTags: options.registrationTags ?? undefined,
        postBack: options.postBack ?? undefined,
        initialRegistrationState: options.initialRegistrationState ?? undefined,
        initialSettings: options.initialSettings ?? undefined
      }

      const response = await request
        .post(`${BASE_PATH}/registrations`)
        .set('Authorization', this.getBearerString(options))
        .query(query)
        .send(registration)

      const success = HttpStatus.isSuccess(response)

      return {
        success,
        message: success ? '' : `Failed to create registration '${registrationId}'`
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * Checks that the registration exists within SCORM Cloud. No registration data will be returned for this call.
   * If you are looking for information about the registration, try using {@link getRegistration} instead.
   *
   * [API Method - GetRegistration](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/GetRegistration)
   *
   * @param registrationId An ID for which registration to check
   * @param options Options
   * @throws {@link ScormClientError} if an invalid request was made
   * @returns A boolean true or false
   */
  async registrationExists(registrationId: string, options: Options = {}): Promise<Boolean> {
    await this.authorise(options)

    if (!registrationId) {
      throw new ScormClientError('No registrationId provided')
    }

    try {
      const response = await request
        .head(`${BASE_PATH}/registrations/${registrationId}`)
        .set('Authorization', this.getBearerString(options))

      if (HttpStatus.isSuccess(response)) {
        return true
      }

      if (HttpStatus.notFound(response)) {
        return false
      }

      throw new ScormClientError(`Bad request: ${response.status}`)
    } catch (e) {
      if (HttpStatus.isSuccess(e)) {
        return true
      }

      if (HttpStatus.notFound(e)) {
        return false
      }

      throw new ScormClientError(e)
    }
  }

  /**
   * Deletes the specified registration. This will also delete all instances of the registration.
   *
   * [API Method - DeleteRegistration](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/DeleteRegistration)
   *
   * @param registrationId The registration ID
   * @param options Options
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered,
   * or if the referenced registration does not exist
   * @returns A {@link types.SuccessIndicator}
   */
  async deleteRegistration(registrationId: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

    if (!registrationId) {
      throw new ScormClientError('No registrationId provided')
    }

    try {
      const response = await request
        .delete(`${BASE_PATH}/registrations/${registrationId}`)
        .set('Authorization', this.getBearerString(options))

      const success = HttpStatus.isSuccess(response)

      return {
        success,
        message: success ? '' : `Failed to delete registration '${registrationId}'`
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * Returns detailed information about the registration. This includes completion status, time taken, score,
   * and pass/fail status.
   *
   * [API Method - GetRegistrationProgress](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/GetRegistrationProgress)
   *
   * @param registrationId The registration ID for which to return progress
   * @param options RegistrationFetchOptions
   */
  async getRegistration(registrationId: string, options: RegistrationFetchOptions = {}): Promise<Registration> {
    await this.authorise(options)

    if (!registrationId) {
      throw new ScormClientError('No registrationId provided')
    }

    try {
      const query: any = {
        includeChildResults: options.includeChildResults ?? undefined,
        includeInteractionsAndObjectives: options.includeInteractionsAndObjectives ?? undefined,
        includeRuntime: options.includeRuntime ?? undefined
      }

      return (
        await request
          .get(`${BASE_PATH}/registrations/${registrationId}`)
          .set('Authorization', this.getBearerString(options))
          .query(query)
      ).body
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  /**
   * This is an overloaded method for {@link getRegistration}, and is exactly the same thing. It exists purely to provide a
   * method named in similar fashion to the official API.
   *
   * [API Method - GetRegistrationProgress](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/GetRegistrationProgress)
   *
   * @param registrationId The registration ID for which to return progress
   * @param options RegistrationFetchOptions
   */
  async getRegistrationProgress(registrationId: string, options: RegistrationFetchOptions = {}): Promise<Registration> {
    return await this.getRegistration(registrationId, options)
  }

  /**
   * Returns a list of registrations for the given course. Can be filtered to provide a subset of results.
   *
   * This request is paginated and will only provide a limited amount of resources at a time. If there are more
   * results to be collected, a more token provided with the response which can be passed to get the next page
   * of results. When passing this token, no other filter parameters can be sent as part of the request. The
   * resources will continue to respect the filters passed in by the original request.
   *
   * [API Method - GetRegistrations](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/GetRegistrations)
   *
   * @param courseId The course ID for which to return registrations
   * @param options RegistrationQueryOptions
   * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
   * @returns A {@link types.RegistrationQueryResponse} that has a property named `registrations`, which is an array
   * of type {@link types.Registration}, or an empty array if no registrations were found. It also includes a
   * '`more`' property which, if present, can be used to retrieve the next paginated set of results
   */
  async getRegistrationsForCourse(courseId: string, options: RegistrationQueryOptions = {}): Promise<RegistrationQueryResponse> {
    if (!courseId) {
      throw new ScormClientError('No courseId provided')
    }

    return await this.getRegistrations(Object.assign({ courseId }, options))
  }

  /**
     * Returns a list of registrations for the given learner. Can be filtered to provide a subset of results.
     *
     * This request is paginated and will only provide a limited amount of resources at a time. If there are more
     * results to be collected, a more token provided with the response which can be passed to get the next page
     * of results. When passing this token, no other filter parameters can be sent as part of the request. The
     * resources will continue to respect the filters passed in by the original request.
     *
     * [API Method - GetRegistrations](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/GetRegistrations)
     *
     * @param learnerId The learner ID for which to return registrations
     * @param options RegistrationQueryOptions
     * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
     * @returns A {@link types.RegistrationQueryResponse} that has a property named `registrations`, which is an array
     * of type {@link types.Registration}, or an empty array if no registrations were found. It also includes a
     * '`more`' property which, if present, can be used to retrieve the next paginated set of results
     */
  async getRegistrationsForLearner(learnerId: string, options: RegistrationQueryOptions = {}): Promise<RegistrationQueryResponse> {
    if (!learnerId) {
      throw new ScormClientError('No learnerId provided')
    }

    return await this.getRegistrations(Object.assign({ learnerId }, options))
  }

  /**
     * Returns a list of registrations. Can be filtered to provide a subset of results.
     *
     * This request is paginated and will only provide a limited amount of resources at a time. If there are more
     * results to be collected, a more token provided with the response which can be passed to get the next page
     * of results. When passing this token, no other filter parameters can be sent as part of the request. The
     * resources will continue to respect the filters passed in by the original request.
     *
     * [API Method - GetRegistrations](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/GetRegistrations)
     *
     * @param options RegistrationQueryOptions
     * @throws {@link ScormClientError} if an invalid request was made, or an error encountered
     * @returns A {@link types.RegistrationQueryResponse} that has a property named `registrations`, which is an array
     * of type {@link types.Registration}, or an empty array if no registrations were found. It also includes a
     * '`more`' property which, if present, can be used to retrieve the next paginated set of results
     */
  async getRegistrations(options: RegistrationQueryOptions = {}): Promise<RegistrationQueryResponse> {
    await this.authorise(options)

    try {
      const query: any = {
        courseId: options.courseId ?? undefined,
        learnerId: options.learnerId ?? undefined,
        since: options.since ?? undefined,
        until: options.until ?? undefined,
        datetimeFilter: options.datetimeFilter ?? undefined,
        tags: options.tags ?? undefined,
        filter: options.filter ?? undefined,
        filterBy: options.filterBy ?? undefined,
        orderBy: options.orderBy ?? undefined,
        more: options.more ?? undefined,
        includeChildResults: options.includeChildResults ?? undefined,
        includeInteractionsAndObjectives: options.includeInteractionsAndObjectives ?? undefined,
        includeRuntime: options.includeRuntime ?? undefined
      }

      return (
        await request
          .get(`${BASE_PATH}/registrations`)
          .set('Authorization', this.getBearerString(options))
          .query(query)
      ).body
    } catch (e) {
      if (HttpStatus.notFound(e)) {
        throw new ScormClientError(e, 'Bad request, likely due to invalid query options', 400)
      }

      throw new ScormClientError(e)
    }
  }

  /**
   * Get a launch link, which is a relatively short lived url, used to launch the course for a given registration.
   * Launch links are meant as a way to provide access to your content. When a learner visits the link, the course
   * will be launched and registration progress will start to be tracked.
   *
   * [API Method - BuildRegistrationLaunchLink](https://cloud.scorm.com/docs/v2/reference/swagger/#/registration/BuildRegistrationLaunchLink)
   *
   * @param registrationId The registration ID for which to create and return a launch link
   * @param redirectOnExitUrl The URL the application should redirect to when the learner exits or completes a course.
   * Alternatively one of the following keywords can be used:
   *  - closer : A page that automatically tries to close the browser tab/window
   *  - blank : A blank page
   *  - message : A page with a message about the course being complete
   *
   * If an invalid url is specified, the Message.html page will be loaded
   * @param options LaunchLinkOptions
   */
  async createLaunchLink(
    registrationId: string,
    redirectOnExitUrl: string,
    options: LaunchLinkOptions = {}
  ): Promise<LaunchLink> {
    await this.authorise(options)

    if (!registrationId) {
      throw new ScormClientError('No registrationId provided')
    }

    if (!redirectOnExitUrl) {
      throw new ScormClientError('No redirectOnExitUrl provided')
    }

    try {
      const query = {
        redirectOnExitUrl,
        expiry: options.expiry ?? undefined,
        tracking: options.tracking ?? undefined,
        startSco: options.startSco ?? undefined,
        culture: options.culture ?? undefined,
        cssUrl: options.cssUrl ?? undefined,
        learnerTags: options.learnerTags ?? undefined,
        courseTags: options.courseTags ?? undefined,
        registrationTags: options.registrationTags ?? undefined,
        additionalvalues: options.additionalvalues ?? undefined,
        launchAuth: options.launchAuth ?? undefined
      }

      return (
        await request
          .post(`${BASE_PATH}/registrations/${registrationId}/launchLink`)
          .set('Authorization', this.getBearerString(options))
          .send(query)
      ).body
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  // /** @ignore */
  // invalidateAuth(): void {
  //   this.appId = undefined
  //   this.secretKey = undefined
  // }

  // /** @ignore */
  // invalidateAuthToken(): void {
  //   // this.authToken = undefined
  // }
}
