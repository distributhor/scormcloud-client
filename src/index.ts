import superagent, { Response } from "superagent";

const BASE_PATH = "https://cloud.scorm.com/api/v2";

export interface AuthToken {
  access_token: string;
  expires_in?: number;
  token_type?: string;
}

export interface ErrorMessage {
  message: string;
}

export interface ErrorProperty {
  error: string;
}

export interface HttpResponse extends Response {
  body: any;
  status: number;
}

export interface HttpErrorResponse extends HttpResponse {
  body: ErrorProperty;
  error: any;
}

export interface HttpError {
  response: HttpErrorResponse;
}

export interface PingResponse {
  apiMessage: string;
  currentTime: string;
}

const TypeChecks = {
  containsErrorMessage: (x: any): x is ErrorMessage => {
    return x.message;
  },

  containsErrorProperty: (x: any): x is ErrorProperty => {
    return x.error;
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
  status: number;

  constructor(error: any, message?: string, status?: number) {
    const e = ScormClientError.parse(error, message, status);

    super(e.message);

    this.name = "ScormClientError";
    this.message = e.message;
    this.status = e.status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScormClientError);
    }
  }

  private static parseMessage(e: any, message?: string): string {
    if (message) {
      return message;
    }

    if (typeof e === "string") {
      return e;
    }

    if (TypeChecks.isHttpError(e)) {
      return e.response.body.error;
    }

    if (TypeChecks.containsErrorProperty(e)) {
      return e.error;
    }

    if (TypeChecks.containsErrorMessage(e)) {
      return e.message;
    }

    return "Unknown Error";
  }

  private static parseStatus(e: any, status?: number): number | undefined {
    if (status) {
      return status;
    }

    if (TypeChecks.isHttpError(e)) {
      return e.response.status;
    }

    return undefined;
  }

  private static parseError(e: any): ErrorMessage | undefined {
    return TypeChecks.containsErrorMessage(e) ? e : undefined;
  }

  private static parse(e: any, message?: string, status?: number) {
    return {
      message: ScormClientError.parseMessage(e, message),
      status: ScormClientError.parseStatus(e, status),
      error: ScormClientError.parseError(e),
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

  private static get OAUTH(): string {
    return "OAUTH";
  }

  private static get APP_NORMAL(): string {
    return "APP_NORMAL";
  }

  private static get APP_MANAGEMENT(): string {
    return "APP_MANAGEMENT";
  }

  private static get DEFAULT_TIMEOUT(): number {
    return 36000;
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
      const response = await superagent
        .post(`${BASE_PATH}/oauth/authenticate/application/token`)
        .auth(this.appId, this.secretKey)
        .send(`scope=${this.scope}`)
        .send(`expiration=${this.timeout}`);

      this.auth = response.body;

      return this.auth;
    } catch (e) {
      throw new ScormClientError(e);
    }
  }

  private async refreshAuthentication(): Promise<AuthToken> {
    if (this.appId && this.secretKey && this.scope) {
      return this.authenticate(this.appId, this.secretKey, this.scope);
    }

    throw new ScormClientError("Unable to refresh authentication token", null, 401);
  }

  private async checkIsAuthenticated(): Promise<AuthToken> {
    if (this.auth) {
      return this.auth;
    }

    if (this.appId && this.secretKey && this.scope) {
      return this.refreshAuthentication();
    }

    throw new ScormClientError("Not authenticated and no credentials are set", null, 401);
  }

  private authString(): string {
    return this.auth ? `Bearer ${this.auth.access_token}` : "Bearer";
  }

  async ping(isRetry = false): Promise<PingResponse> {
    await this.checkIsAuthenticated();

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

  async getCourses(isRetry = false): Promise<any> {
    await this.checkIsAuthenticated();

    try {
      return (await superagent.get(`${BASE_PATH}/courses`).set("Authorization", this.authString())).body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.getCourses(true);
      }

      throw new ScormClientError(e);
    }
  }

  async getCourse(courseId: string, isRetry = false): Promise<any> {
    await this.checkIsAuthenticated();

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

  async getCourseVersions(courseId: string, isRetry = false): Promise<any> {
    await this.checkIsAuthenticated();

    try {
      return (
        await superagent
          .get(`${BASE_PATH}/courses/${courseId}/versions`)
          .set("Authorization", this.authString())
          .query(`includeRegistrationCount=true`)
          .query(`includeCourseMetadata=false`)
      ).body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.getCourseVersions(courseId, true);
      }

      if (StatusChecks.notFound(e)) {
        return null; // course does not exist, but query was for course versions, return [] instead?
      }

      throw new ScormClientError(e);
    }
  }

  async uploadCourse(
    courseId: string,
    filePath: string,
    attemptToWaitForResult?: number,
    isRetry = false
  ): Promise<any> {
    await this.checkIsAuthenticated();

    try {
      const response = await superagent
        .post(`${BASE_PATH}/courses/importJobs/upload`)
        .set("Authorization", this.authString())
        .set("uploadedContentType", Util.scormUploadType(filePath))
        .query(`courseId=${courseId}`)
        .query("mayCreateNewVersion=true")
        .attach("file", filePath);

      if (response.body.result && attemptToWaitForResult) {
        await Util.sleep(attemptToWaitForResult);
        response.body.importJob = await this.getCourseUploadStatus(response.body.result);
      }

      return response.body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.uploadCourse(courseId, filePath, attemptToWaitForResult, true);
      }

      throw new ScormClientError(e);
    }
  }

  async getCourseUploadStatus(jobId: string, isRetry = false): Promise<any> {
    await this.checkIsAuthenticated();

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

  async setCourseTitle(courseId: string, title: string, isRetry = false): Promise<any> {
    await this.checkIsAuthenticated();

    try {
      const response = await superagent
        .put(`${BASE_PATH}/courses/${courseId}/title`)
        .set("Authorization", this.authString())
        .send({ title: title });

      if (!StatusChecks.isSuccess(response)) {
        throw new ScormClientError(`Failed to set course title '${courseId}'`);
      }

      return response.body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.setCourseTitle(courseId, title, true);
      }

      throw new ScormClientError(e);
    }
  }

  async deleteCourse(courseId: string, isRetry = false): Promise<any> {
    await this.checkIsAuthenticated();

    try {
      const response = await superagent
        .delete(`${BASE_PATH}/courses/${courseId}`)
        .set("Authorization", this.authString());

      if (!StatusChecks.isSuccess(response)) {
        throw new ScormClientError(`Failed to delete the course '${courseId}'`);
      }

      return response.body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.deleteCourse(courseId, true);
      }

      throw new ScormClientError(e);
    }
  }

  async deleteCourseVersion(courseId: string, versionId: number, isRetry = false): Promise<any> {
    await this.checkIsAuthenticated();

    try {
      const response = await superagent
        .delete(`${BASE_PATH}/courses/${courseId}/versions/${versionId}`)
        .set("Authorization", this.authString());

      if (!StatusChecks.isSuccess(response)) {
        throw new ScormClientError(`Failed to delete the course version '${courseId} ${versionId}'`);
      }

      return response.body;
    } catch (e) {
      if (!isRetry && StatusChecks.isUnauthorized(e)) {
        await this.refreshAuthentication();
        return this.deleteCourseVersion(courseId, versionId, true);
      }

      throw new ScormClientError(e);
    }
  }
}
