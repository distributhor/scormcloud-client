/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
import request from 'superagent'
import {
  AuthToken,
  Course,
  CourseUploadOptions,
  CourseUploadResponse,
  ErrorObject,
  ErrorProperty,
  HttpError,
  ImportJobResult,
  Options,
  PingResponse,
  SuccessIndicator
} from './types'

/** @internal */
const BASE_PATH = 'https://cloud.scorm.com/api/v2'

/** @internal */
const TypeChecks = {
  containsErrorProperty: (x: any): x is ErrorProperty => {
    return x.error
  },

  isErrorObject: (x: any): x is ErrorObject => {
    return x.message
  },

  isHttpError: (x: any): x is HttpError => {
    // return x.response && x.response.body && x.response.body.error
    return x.response?.body?.error
  }
}

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
const Util = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  hasProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    // eslint-disable-next-line no-prototype-builtins
    return obj.hasOwnProperty(prop)
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

  constructor(cause: any, message?: string, httpStatus?: number) {
    const e = ScormClientError.parse(cause, message, httpStatus)

    super(e.message)

    this.name = 'ScormClientError'

    this.message = e.message
    this.httpStatus = e.httpStatus
    this.cause = e.error

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
      return cause.response.body.error
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
 * The class can be used via it's constructor
 *
 * ```typescript
 * const client = new ScormClient();
 * ```
 *
 * or you can obtain a singleton instance
 *
 * ```typescript
 * const client = ScormClient.getInstance();
 * ```
 */
export class ScormClient {
  private auth: AuthToken | undefined
  private appId: string | undefined
  private secretKey: string | undefined
  private scope: string | undefined
  private timeout: number | undefined

  private static instance: ScormClient

  constructor(appId?: string, secretKey?: string, scope?: string, timeout?: number) {
    this.appId = appId
    this.secretKey = secretKey
    this.scope = scope
    this.timeout = timeout
  }

  private static get DEFAULT_TIMEOUT(): number {
    return 36000
  }

  public static getInstance(appId?: string, secretKey?: string, scope?: string, timeout?: number): ScormClient {
    if (appId && secretKey && scope) {
      ScormClient.instance = new ScormClient(appId, secretKey, scope, timeout)
    }

    if (!ScormClient.instance) {
      throw new ScormClientError('No instance found, and no credentials with which to authenticate')
    }

    return ScormClient.instance
  }

  private async checkAuthentication(): Promise<AuthToken | undefined> {
    if (this.auth) {
      return this.auth
    }

    if (this.appId && this.secretKey && this.scope) {
      return await this.refreshAuthentication()
    }

    throw new ScormClientError('Not authenticated and no credentials are set', undefined, 401)
  }

  private async refreshAuthentication(): Promise<AuthToken | undefined> {
    if (this.appId && this.secretKey && this.scope) {
      return await this.authenticate(this.appId, this.secretKey, this.scope)
    }

    throw new ScormClientError('Unable to refresh authentication token', undefined, 401)
  }

  private authString(): string {
    return this.auth ? `Bearer ${this.auth.access_token}` : 'Bearer'
  }

  /**
   * @param appId  The ScormCloud application id
   * @param secretKey  The ScormCloud secrent key
   * @param scope  The ScormCloud permission scope
   * @param timeout The amount of time, in second, after which the authentication token should expire
   * @returns Returns an AuthToken if successfull
   */
  async authenticate(appId: string, secretKey: string, scope: string, timeout?: number): Promise<AuthToken | undefined> {
    this.auth = undefined
    this.appId = appId
    this.secretKey = secretKey
    this.scope = scope

    if (timeout) {
      this.timeout = timeout
    }

    if (!this.timeout) {
      this.timeout = ScormClient.DEFAULT_TIMEOUT
    }

    try {
      this.auth = (
        await request
          .post(`${BASE_PATH}/oauth/authenticate/application/token`).type('form')
          .auth(this.appId, this.secretKey)
          .send(`scope=${this.scope}`)
          .send(`expiration=${this.timeout}`)
      ).body

      return this.auth
    } catch (e) {
      throw new ScormClientError(e)
    }
  }

  async ping(options: Options = {}): Promise<PingResponse> {
    await this.checkAuthentication()

    try {
      return (await request.get(`${BASE_PATH}/ping`).set('Authorization', this.authString())).body
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.ping(Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async getCourse(courseId: string, options: Options = {}): Promise<Course | undefined> {
    await this.checkAuthentication()

    try {
      return (
        await request
          .get(`${BASE_PATH}/courses/${courseId}`)
          .set('Authorization', this.authString())
          .query('includeRegistrationCount=true')
          .query('includeCourseMetadata=false')
      ).body
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.getCourse(courseId, Object.assign({ isRetry: true }, options))
      }

      if (HttpStatus.notFound(e)) {
        return undefined
      }

      throw new ScormClientError(e)
    }
  }

  async getCourses(options: Options = {}): Promise<Course[]> {
    await this.checkAuthentication()

    try {
      const response = await request.get(`${BASE_PATH}/courses`).set('Authorization', this.authString())
      return response.body.courses || []
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.getCourses(Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async uploadCourse(
    courseId: string,
    filePath: string,
    options: CourseUploadOptions = {}
  ): Promise<CourseUploadResponse> {
    await this.checkAuthentication()

    try {
      const query: any = {
        courseId,
        mayCreateNewVersion: options.mayCreateNewVersion ?? false
      }

      const response = await request
        .post(`${BASE_PATH}/courses/importJobs/upload`).type('form')
        .set('Authorization', this.authString())
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
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.uploadCourse(courseId, filePath, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async getCourseUploadStatus(jobId: string, options: Options = {}): Promise<ImportJobResult> {
    await this.checkAuthentication()

    try {
      return (await request.get(`${BASE_PATH}/courses/importJobs/${jobId}`).set('Authorization', this.authString()))
        .body
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.getCourseUploadStatus(jobId, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async setCourseTitle(courseId: string, title: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.checkAuthentication()

    try {
      const response = await request
        .put(`${BASE_PATH}/courses/${courseId}/title`).type('form')
        .set('Authorization', this.authString())
        .send({ title })

      // if (!HttpStatus.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to set course title '${courseId}'`);
      // }

      return {
        success: HttpStatus.isSuccess(response)
      }
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.setCourseTitle(courseId, title, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async deleteCourse(courseId: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.checkAuthentication()

    try {
      const response = await request
        .delete(`${BASE_PATH}/courses/${courseId}`)
        .set('Authorization', this.authString())

      // if (!HttpStatus.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to delete the course '${courseId}'`);
      // }

      return {
        success: HttpStatus.isSuccess(response)
      }
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.deleteCourse(courseId, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async getCourseVersions(courseId: string, options: Options = {}): Promise<Course[] | undefined> {
    await this.checkAuthentication()

    try {
      const response = await request
        .get(`${BASE_PATH}/courses/${courseId}/versions`)
        .set('Authorization', this.authString())
        .query('includeRegistrationCount=true')
        .query('includeCourseMetadata=false')

      return response.body.courses || []
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.getCourseVersions(courseId, Object.assign({ isRetry: true }, options))
      }

      if (HttpStatus.notFound(e)) {
        return undefined
      }

      throw new ScormClientError(e)
    }
  }

  async deleteCourseVersion(courseId: string, versionId: number, options: Options = {}): Promise<SuccessIndicator> {
    await this.checkAuthentication()

    try {
      const response = await request
        .delete(`${BASE_PATH}/courses/${courseId}/versions/${versionId}`)
        .set('Authorization', this.authString())

      // if (!HttpStatus.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to delete the course version '${courseId} ${versionId}'`);
      // }

      return {
        success: HttpStatus.isSuccess(response)
      }
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication()
        return await this.deleteCourseVersion(courseId, versionId, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  /** @ignore */
  invalidateAuth(): void {
    this.auth = undefined
    this.appId = undefined
    this.secretKey = undefined
    this.scope = undefined
  }

  /** @ignore */
  invalidateAuthToken(): void {
    this.auth = undefined
  }
}
