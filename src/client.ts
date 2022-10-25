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
 * The class can be used via it's constructor
 *
 * ```typescript
 * const client = new ScormClient();
 * ```
 *
 * ```
 */
export class ScormClient {
  private appId?: string
  private secretKey?: string

  private readonly defaultScope?: string
  private readonly defaultExpiration?: number

  private readonly authorisations = new Map<string, AuthToken>()

  constructor(appId?: string, secretKey?: string, defaultScope?: string, defaultExpiration?: number) {
    this.appId = appId
    this.secretKey = secretKey
    this.defaultScope = defaultScope
    this.defaultExpiration = defaultExpiration
  }

  private static get DEFAULT_TIMEOUT(): number {
    return 36000
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
    if (authToken) {
      return authToken
    }

    if (this.appId && this.secretKey) {
      return await this.refreshAuthentication(scope)
    }

    throw new ScormClientError('No authentication credentials are set', undefined, 401)
  }

  private async refreshAuthentication(scope?: string | Options): Promise<AuthToken | undefined> {
    if (this.appId && this.secretKey) {
      return await this.authenticate(this.getTargetScope(scope))
    }

    throw new ScormClientError('Unable to refresh authentication token', undefined, 401)
  }

  /**
   * @param authScope  The ScormCloud permission authScope
   * @param timeout The amount of time, in seconds, after which the auth token should expire
   * @returns Returns an AuthToken if successfull
   */
  async authenticate(authScope?: string, timeout?: number): Promise<AuthToken> {
    if (!this.appId) {
      throw new ScormClientError('No APP ID defined')
    }

    if (!this.secretKey) {
      throw new ScormClientError('No SECRET KEY defined')
    }

    const scope = authScope ?? this.defaultScope
    if (!scope) {
      throw new ScormClientError('No AUTH SCOPE defined')
    }

    let expiry = timeout ?? this.defaultExpiration
    if (!expiry) {
      expiry = ScormClient.DEFAULT_TIMEOUT
    }

    try {
      const response = await request
        .post(`${BASE_PATH}/oauth/authenticate/application/token`).type('form')
        .auth(this.appId, this.secretKey)
        .send(`scope=${scope}`)
        .send(`expiration=${expiry}`)

      if (!TypeChecks.isAuthToken(response.body)) {
        throw new ScormClientError('Invalid auth token received')
      }

      this.authorisations.set(scope, response.body)

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
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.ping(Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async getCourse(courseId: string, options: Options = {}): Promise<Course | undefined> {
    await this.authorise(options)

    try {
      return (
        await request
          .get(`${BASE_PATH}/courses/${courseId}`)
          .set('Authorization', this.getBearerString(options))
          .query('includeRegistrationCount=true')
          .query('includeCourseMetadata=false')
      ).body
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.getCourse(courseId, Object.assign({ isRetry: true }, options))
      }

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
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
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
    await this.authorise(options)

    try {
      const query: any = {
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
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.uploadCourse(courseId, filePath, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async getCourseUploadStatus(jobId: string, options: Options = {}): Promise<ImportJobResult> {
    await this.authorise(options)

    try {
      return (await request.get(`${BASE_PATH}/courses/importJobs/${jobId}`).set('Authorization', this.getBearerString(options)))
        .body
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.getCourseUploadStatus(jobId, Object.assign({ isRetry: true }, options))
      }

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

      // if (!HttpStatus.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to set course title '${courseId}'`);
      // }

      return {
        success: HttpStatus.isSuccess(response)
      }
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.setCourseTitle(courseId, title, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  async deleteCourse(courseId: string, options: Options = {}): Promise<SuccessIndicator> {
    await this.authorise(options)

    try {
      const response = await request
        .delete(`${BASE_PATH}/courses/${courseId}`)
        .set('Authorization', this.getBearerString(options))

      // if (!HttpStatus.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to delete the course '${courseId}'`);
      // }

      return {
        success: HttpStatus.isSuccess(response)
      }
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.deleteCourse(courseId, Object.assign({ isRetry: true }, options))
      }

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
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.getCourseVersions(courseId, Object.assign({ isRetry: true }, options))
      }

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

      // if (!HttpStatus.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to delete the course version '${courseId} ${versionId}'`);
      // }

      return {
        success: HttpStatus.isSuccess(response)
      }
    } catch (e) {
      if (!options.isRetry && HttpStatus.isUnauthorized(e)) {
        await this.refreshAuthentication(options)
        return await this.deleteCourseVersion(courseId, versionId, Object.assign({ isRetry: true }, options))
      }

      throw new ScormClientError(e)
    }
  }

  /** @ignore */
  invalidateAuth(): void {
    this.appId = undefined
    this.secretKey = undefined
  }

  /** @ignore */
  invalidateAuthToken(): void {
    // this.authToken = undefined
  }
}
