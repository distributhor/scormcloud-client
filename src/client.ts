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
  CourseUploadOptions,
  CourseUploadResponse,
  RegistrationProgress,
  CreateLaunchLinkOptions,
  CreateRegistrationOptions,
  RegistrationProgressOptions
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
    if (!f || f.endsWith('zip')) {
      return 'application/zip'
    }

    if (f.endsWith('pdf')) {
      return 'application/pdf'
    }

    if (f.endsWith('mp3')) {
      return 'audo/mpeg'
    }

    if (f.endsWith('mp4')) {
      return 'video/mp4'
    }

    return 'application/zip'
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

  async ping(options: Options = {}): Promise<PingResponse> {
    await this.authorise(options)

    try {
      return (await request.get(`${BASE_PATH}/ping`).set('Authorization', this.getBearerString(options))).body
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  async getCourse(courseId: string, options: Options = {}): Promise<Course | undefined> {
    await this.authorise(options)

    try {
      const query: any = {
        includeRegistrationCount: options.includeRegistrationCount ?? true,
        includeCourseMetadata: options.includeCourseMetadata ?? false
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

  async getCourses(options: Options = {}): Promise<Course[]> {
    await this.authorise(options)

    try {
      const response = await request.get(`${BASE_PATH}/courses`).set('Authorization', this.getBearerString(options))
      return response.body.courses || []
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  async uploadCourse(
    courseId: string,
    filePath: string,
    options: CourseUploadOptions = {}
  ): Promise<CourseUploadResponse> {
    await this.authorise(options)

    try {
      const query = {
        courseId,
        mayCreateNewVersion: options.mayCreateNewVersion ?? false
      }

      const response = await request
        .post(`${BASE_PATH}/courses/importJobs/upload`).type('form')
        .set('Authorization', this.getBearerString(options))
        .set('uploadedContentType', Util.scormUploadType(filePath))
        .query(query)
        .attach('file', filePath)

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

      const importJobResult = await this.getCourseUploadStatus(response.body.result)

      return {
        courseId,
        importJobId: response.body.result,
        importJobResult
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  async getCourseUploadStatus(jobId: string, options: Options = {}): Promise<ImportJobResult> {
    await this.authorise(options)

    try {
      return (
        await request
          .get(`${BASE_PATH}/courses/importJobs/${jobId}`)
          .set('Authorization', this.getBearerString(options))
      ).body
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  async setCourseTitle(courseId: string, title: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

    try {
      const response = await request
        .put(`${BASE_PATH}/courses/${courseId}/title`).type('form')
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

  async deleteCourse(courseId: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

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

  async getCourseVersions(courseId: string, options: Options = {}): Promise<Course[] | undefined> {
    await this.authorise(options)

    try {
      const response = await request
        .get(`${BASE_PATH}/courses/${courseId}/versions`)
        .set('Authorization', this.getBearerString(options))
        .query('includeRegistrationCount=true')
        .query('includeCourseMetadata=false')

      return response.body.courses || []
    } catch (e) {
      if (HttpStatus.notFound(e)) {
        return undefined
      }

      throw new ScormClientError(e)
    }
  }

  async deleteCourseVersion(courseId: string, versionId: number, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

    try {
      const response = await request
        .delete(`${BASE_PATH}/courses/${courseId}/versions/${versionId}`)
        .set('Authorization', this.getBearerString(options))

      const success = HttpStatus.isSuccess(response)

      return {
        success,
        message: success ? '' : `Failed to delete course version '${courseId}:${versionId}'`
      }
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  async getRegistrationsForCourse(courseId: string, options: Options = {}): Promise<Registration[]> {
    return await this.getRegistrations(Object.assign({ courseId }, options))
  }

  async getRegistrationsForLearner(learnerId: string, options: Options = {}): Promise<Registration[]> {
    return await this.getRegistrations(Object.assign({ learnerId }, options))
  }

  async getRegistrations(options: Options = {}): Promise<Registration[]> {
    await this.authorise(options)

    try {
      const query: any = {
        courseId: options.courseId ?? undefined,
        learnerId: options.learnerId ?? undefined,
        since: options.since ?? undefined,
        until: options.until ?? undefined,
        datetimeFilter: options.datetimeFilter ?? undefined
      }

      const response = await request
        .get(`${BASE_PATH}/registrations`)
        .set('Authorization', this.getBearerString(options))
        .query(query)

      return response.body.registrations || []
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  async createRegistration(
    learner: Learner,
    courseId: string,
    registrationId: string,
    options: CreateRegistrationOptions = {}
  ): Promise<SuccessIndicator> {
    await this.authorise(options)

    try {
      const query = {
        courseVersion: options.courseVersion ?? undefined
      }

      const registration = {
        courseId,
        registrationId,
        learner
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

  async registrationExists(registrationId: string, options: Options = {}): Promise<Boolean> {
    await this.authorise(options)

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

  async deleteRegistration(registrationId: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

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

  async createLaunchLink(
    registrationId: string,
    redirectOnExitUrl: string,
    options: CreateLaunchLinkOptions = {}
  ): Promise<LaunchLink> {
    await this.authorise(options)

    try {
      const query = {
        redirectOnExitUrl
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

  async getRegistrationProgress(registrationId: string, options: RegistrationProgressOptions = {}): Promise<RegistrationProgress> {
    await this.authorise(options)

    try {
      const query: any = {
        includeChildResults: options.includeChildResults ?? false,
        includeInteractionsAndObjectives: options.includeInteractionsAndObjectives ?? false,
        includeRuntime: options.includeRuntime ?? false
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
