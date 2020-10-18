import superagent, { Response } from "superagent";

const BASE_PATH = "https://cloud.scorm.com/api/v2";

// const enum Auth {
//   OAUTH = "OAUTH",
//   APP_NORMAL = "APP_NORMAL",
//   APP_MANAGEMENT = "APP_MANAGEMENT",
// }

export interface AuthToken {
  access_token: string;
  expires_in?: number;
  token_type?: string;
}

export interface ErrorObject {
  message: string;
}

interface ErrorProperty {
  error: string;
}

interface HttpResponse extends Response {
  body: any;
  status: number;
}

interface HttpErrorResponse extends HttpResponse {
  body: ErrorProperty;
  error: any;
}

interface HttpError {
  response: HttpErrorResponse;
}

export interface PingResponse {
  apiMessage: string;
  currentTime: string;
}

export interface SuccessIndicator {
  success: boolean;
  message?: string;
}

export interface CourseMeta {
  title?: string;
  titleLanguage?: string;
  description?: string;
  descriptionLanguage?: string;
  duration?: string;
  typicaltime?: string;
  keywords?: string[];
}

export interface CourseActivity {
  externalIdentifier?: string;
  itemIdentifier?: string;
  resourceIdentifier?: string;
  activityType?: string;
  href?: string;
  scaledPassingScore?: string;
  title?: string;
  children?: CourseActivity[];
}

export interface Course {
  id?: string;
  title?: string;
  xapiActivityId?: string;
  created?: string; // Date
  updated?: string; // Date
  version?: number;
  registrationCount?: number;
  activityId?: string;
  courseLearningStandard?: string;
  tags?: string[];
  dispatched?: boolean;
  metadata?: CourseMeta;
  rootActivity?: CourseActivity;
}

export interface ImportResult {
  webPathToCourse?: string;
  parserWarnings?: string[];
  courseLanguages?: string[];
  course?: Course;
}

export interface ImportJobResult {
  jobId?: string;
  status?: string;
  message?: string;
  importResult?: ImportResult;
}

export interface CourseUploadResponse {
  courseId?: string;
  importJobResult?: ImportJobResult;
}

const TypeChecks = {
  containsErrorProperty: (x: any): x is ErrorProperty => {
    return x.error;
  },

  isErrorObject: (x: any): x is ErrorObject => {
    return x.message;
  },

  isHttpError: (x: any): x is HttpError => {
    return x.response && x.response.body && x.response.body.error;
  },
};

const StatusChecks = {
  isSuccess: (r: any) => {
    return r.status && (r.status === 200 || r.status === 204) ? true : false;
  },

  notFound: (r: any) => {
    return r.status && r.status === 404 ? true : false;
  },

  isUnauthorized: (e: any) => {
    if (e.status) {
      return e.status === 401 ? true : false;
    }
    return e.response && e.response.status === 401 ? true : false;
  },
};

const Util = {
  sleep: (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  },

  scormUploadType: (f: string): string => {
    if (!f || f.endsWith("zip")) {
      return "application/zip";
    }

    if (f.endsWith("pdf")) {
      return "application/pdf";
    }

    if (f.endsWith("mp3")) {
      return "audo/mpeg";
    }

    if (f.endsWith("mp4")) {
      return "video/mp4";
    }

    return "application/zip";
  },
};

export class ScormClientError extends Error {
  code?: string;
  status: number;
  cause: ErrorObject;

  constructor(cause: any, message?: string, status?: number) {
    const e = ScormClientError.parse(cause, message, status);

    super(e.message);

    this.name = "ScormClientError";

    this.code = e.code;
    this.message = e.message;
    this.status = e.status;
    this.cause = e.error;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScormClientError);
    }
  }

  private static parseMessage(cause: any, message?: string): string {
    if (message) {
      return message;
    }

    if (typeof cause === "string") {
      return cause;
    }

    if (TypeChecks.isHttpError(cause)) {
      return cause.response.body.error;
    }

    if (TypeChecks.containsErrorProperty(cause)) {
      return cause.error;
    }

    if (TypeChecks.isErrorObject(cause)) {
      return cause.message;
    }

    return "Unknown Error";
  }

  private static parseStatus(cause: any, status?: number): number | undefined {
    if (status) {
      return status;
    }

    if (TypeChecks.isHttpError(cause)) {
      return cause.response.status;
    }

    return undefined;
  }

  private static parseCode(cause: any): string | undefined {
    if (cause.code) {
      return cause.code;
    }

    return undefined;
  }

  private static parseErrorObject(cause: any): ErrorObject | undefined {
    return TypeChecks.isErrorObject(cause) ? cause : undefined;
  }

  private static parse(cause: any, message?: string, status?: number) {
    return {
      message: ScormClientError.parseMessage(cause, message),
      status: ScormClientError.parseStatus(cause, status),
      error: ScormClientError.parseErrorObject(cause),
      code: ScormClientError.parseCode(cause),
    };
  }
}

export class ScormClient {
  auth: AuthToken;
  appId: string;
  secretKey: string;
  scope: string;
  timeout: number;

  constructor(appId?: string, secretKey?: string, scope?: string, timeout?: number) {
    this.appId = appId;
    this.secretKey = secretKey;
    this.scope = scope;
    this.timeout = timeout;
  }

  private static get DEFAULT_TIMEOUT(): number {
    return 36000;
  }

  private async checkAuthentication(): Promise<AuthToken> {
    if (this.auth) {
      return this.auth;
    }

    if (this.appId && this.secretKey && this.scope) {
      return this.refreshAuthentication();
    }

    throw new ScormClientError("Not authenticated and no credentials are set", null, 401);
  }

  private async refreshAuthentication(): Promise<AuthToken> {
    if (this.appId && this.secretKey && this.scope) {
      return this.authenticate(this.appId, this.secretKey, this.scope);
    }

    throw new ScormClientError("Unable to refresh authentication token", null, 401);
  }

  private authString(): string {
    return this.auth ? `Bearer ${this.auth.access_token}` : "Bearer";
  }

  async authenticate(appId: string, secretKey: string, scope: string, timeout?: number): Promise<AuthToken> {
    this.auth = null;
    this.appId = appId;
    this.secretKey = secretKey;
    this.scope = scope;

    if (timeout) {
      this.timeout = timeout;
    }

    if (!this.timeout) {
      this.timeout = ScormClient.DEFAULT_TIMEOUT;
    }

    try {
      this.auth = (
        await superagent
          .post(`${BASE_PATH}/oauth/authenticate/application/token`)
          .auth(this.appId, this.secretKey)
          .send(`scope=${this.scope}`)
          .send(`expiration=${this.timeout}`)
      ).body;

      return this.auth;
    } catch (e) {
      throw new ScormClientError(e);
    }
  }

  async ping(isRetry = false): Promise<PingResponse> {
    await this.checkAuthentication();

    try {
      return (await superagent.get(`${BASE_PATH}/ping`).set("Authorization", this.authString())).body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.ping(true);
      }

      throw new ScormClientError(e);
    }
  }

  async getCourse(courseId: string, isRetry = false): Promise<Course> {
    await this.checkAuthentication();

    try {
      return (
        await superagent
          .get(`${BASE_PATH}/courses/${courseId}`)
          .set("Authorization", this.authString())
          .query(`includeRegistrationCount=true`)
          .query(`includeCourseMetadata=false`)
      ).body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.getCourse(courseId, true);
      }

      if (StatusChecks.notFound(e)) {
        return null;
      }

      throw new ScormClientError(e);
    }
  }

  async getCourses(isRetry = false): Promise<Course[]> {
    await this.checkAuthentication();

    try {
      const response = await superagent.get(`${BASE_PATH}/courses`).set("Authorization", this.authString());
      return response.body.courses || [];
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.getCourses(true);
      }

      throw new ScormClientError(e);
    }
  }

  async uploadCourse(
    courseId: string,
    filePath: string,
    waitForResult = 0,
    isRetry = false
  ): Promise<CourseUploadResponse> {
    await this.checkAuthentication();

    try {
      const response = await superagent
        .post(`${BASE_PATH}/courses/importJobs/upload`)
        .set("Authorization", this.authString())
        .set("uploadedContentType", Util.scormUploadType(filePath))
        .query(`courseId=${courseId}`)
        .query("mayCreateNewVersion=true")
        .attach("file", filePath);

      if (!response.body.result) {
        return {
          courseId: null,
        };
      }

      if (!waitForResult) {
        return {
          courseId: response.body.result,
        };
      }

      if (response.body.result && waitForResult) {
        await Util.sleep(waitForResult);

        const importJobResult = await this.getCourseUploadStatus(response.body.result);
        console.log(importJobResult);
        return {
          courseId: response.body.result,
          importJobResult,
        };
      }
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.uploadCourse(courseId, filePath, waitForResult, true);
      }

      throw new ScormClientError(e);
    }
  }

  async getCourseUploadStatus(jobId: string, isRetry = false): Promise<ImportJobResult> {
    await this.checkAuthentication();

    try {
      return (await superagent.get(`${BASE_PATH}/courses/importJobs/${jobId}`).set("Authorization", this.authString()))
        .body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.getCourseUploadStatus(jobId, true);
      }

      throw new ScormClientError(e);
    }
  }

  async setCourseTitle(courseId: string, title: string, isRetry = false): Promise<SuccessIndicator> {
    await this.checkAuthentication();

    try {
      const response = await superagent
        .put(`${BASE_PATH}/courses/${courseId}/title`)
        .set("Authorization", this.authString())
        .send({ title: title });

      // if (!StatusChecks.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to set course title '${courseId}'`);
      // }

      return {
        success: StatusChecks.isSuccess(response),
      };
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.setCourseTitle(courseId, title, true);
      }

      throw new ScormClientError(e);
    }
  }

  async deleteCourse(courseId: string, isRetry = false): Promise<SuccessIndicator> {
    await this.checkAuthentication();

    try {
      const response = await superagent
        .delete(`${BASE_PATH}/courses/${courseId}`)
        .set("Authorization", this.authString());

      // if (!StatusChecks.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to delete the course '${courseId}'`);
      // }

      return {
        success: StatusChecks.isSuccess(response),
      };
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.deleteCourse(courseId, true);
      }

      throw new ScormClientError(e);
    }
  }

  async getCourseVersions(courseId: string, isRetry = false): Promise<Course[]> {
    await this.checkAuthentication();

    try {
      const response = await superagent
        .get(`${BASE_PATH}/courses/${courseId}/versions`)
        .set("Authorization", this.authString())
        .query(`includeRegistrationCount=true`)
        .query(`includeCourseMetadata=false`);

      return response.body.courses || [];
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.getCourseVersions(courseId, true);
      }

      if (StatusChecks.notFound(e)) {
        return null;
      }

      throw new ScormClientError(e);
    }
  }

  async deleteCourseVersion(courseId: string, versionId: number, isRetry = false): Promise<SuccessIndicator> {
    await this.checkAuthentication();

    try {
      const response = await superagent
        .delete(`${BASE_PATH}/courses/${courseId}/versions/${versionId}`)
        .set("Authorization", this.authString());

      // if (!StatusChecks.isSuccess(response)) {
      //   throw new ScormClientError(`Failed to delete the course version '${courseId} ${versionId}'`);
      // }

      return {
        success: StatusChecks.isSuccess(response),
      };
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.deleteCourseVersion(courseId, versionId, true);
      }

      throw new ScormClientError(e);
    }
  }

  invalidateAuth(): void {
    this.auth = null;
    this.appId = null;
    this.secretKey = null;
    this.scope = null;
  }

  invalidateAuthToken(): void {
    this.auth = null;
  }
}
