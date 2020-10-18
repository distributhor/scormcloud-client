"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScormClient = exports.ScormClientError = void 0;
const superagent_1 = __importDefault(require("superagent"));
const BASE_PATH = "https://cloud.scorm.com/api/v2";
const TypeChecks = {
  isErrorObject: (x) => {
    return x.message;
  },
  isHttpErrorData: (x) => {
    return x.error;
  },
  isHttpClientResponse: (x) => {
    return x.response && x.response.body && x.response.body.error;
  },
};
const Util = {
  sleep: (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  },
  scormUploadType: (f) => {
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
class ScormClientError extends Error {
  constructor(error, message, status) {
    const e = ScormClientError.parse(error, message, status);
    super(e.message);
    this.name = "ScormClientError";
    this.message = e.message;
    this.status = e.status;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScormClientError);
    }
  }
  static parseMessage(e, message) {
    if (message) {
      return message;
    }
    if (typeof e === "string") {
      return e;
    }
    if (TypeChecks.isHttpClientResponse(e)) {
      return e.response.body.error;
    }
    if (TypeChecks.isHttpErrorData(e)) {
      return e.error;
    }
    if (TypeChecks.isErrorObject(e)) {
      return e.message;
    }
    return "Unknown Error";
  }
  static parseStatus(e, status) {
    if (status) {
      return status;
    }
    if (TypeChecks.isHttpClientResponse(e)) {
      return e.response.status;
    }
    return undefined;
  }
  static parseError(e) {
    return TypeChecks.isErrorObject(e) ? e : undefined;
  }
  static parse(e, message, status) {
    return {
      message: ScormClientError.parseMessage(e, message),
      status: ScormClientError.parseStatus(e, status),
      error: ScormClientError.parseError(e),
    };
  }
}
exports.ScormClientError = ScormClientError;
class ScormClient {
  constructor(appId, secretKey, scope, timeout) {
    this.appId = appId;
    this.secretKey = secretKey;
    this.scope = scope;
    this.timeout = timeout;
  }
  static get OAUTH() {
    return "OAUTH";
  }
  static get APP_NORMAL() {
    return "APP_NORMAL";
  }
  static get APP_MANAGEMENT() {
    return "APP_MANAGEMENT";
  }
  static get DEFAULT_TIMEOUT() {
    return 36000;
  }
  authenticate(appId, secretKey, scope, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
      this.auth = null;
      this.appId = appId;
      this.secretKey = secretKey;
      this.scope = scope;
      if (timeout) {
        this.timeout = timeout;
      }
      // If a timeout was not explicitly provided, and a timeout value is
      // already present on this.timeout (perhaps in case of token refresh),
      // then use the existing value, otherwise default
      if (!this.timeout) {
        this.timeout = ScormClient.DEFAULT_TIMEOUT;
      }
      try {
        const response = yield superagent_1.default
          .post(`${BASE_PATH}/oauth/authenticate/application/token`)
          .auth(this.appId, this.secretKey)
          .send(`scope=${this.scope}`)
          .send(`expiration=${this.timeout}`);
        this.auth = response.body;
        return this.auth;
      } catch (e) {
        throw new ScormClientError(e.response || e);
      }
    });
  }
  refreshAuthentication() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.appId && this.secretKey && this.scope) {
        return this.authenticate(this.appId, this.secretKey, this.scope);
      }
      throw new ScormClientError("Unable to refresh authentication token", null, 401);
    });
  }
  checkIsAuthenticated() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.auth) {
        return this.auth;
      }
      if (this.appId && this.secretKey && this.scope) {
        return this.refreshAuthentication();
      }
      throw new ScormClientError("Not authenticated and no credentials set", null, 401);
    });
  }
  authString() {
    return this.auth ? `Bearer ${this.auth.access_token}` : "Bearer";
  }
  ping(isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default.get(`${BASE_PATH}/ping`).set("Authorization", this.authString());
        return response.body;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.ping(true);
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  getCourses(isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      this.auth = null;
      try {
        const response = yield superagent_1.default.get(`${BASE_PATH}/courses`).set("Authorization", this.authString());
        return response.body;
      } catch (e) {
        console.log(e instanceof Error);
        console.log(Object.keys(e));
        console.log("-----------");
        console.log(Object.keys(e.response));
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.getCourses(true);
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  getCourse(courseId, isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default
          .get(`${BASE_PATH}/courses/${courseId}`)
          .set("Authorization", this.authString())
          .query(`includeRegistrationCount=true`)
          .query(`includeCourseMetadata=false`);
        return response.body;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.getCourse(courseId, true);
        }
        if (e.response && e.response.status === 404) {
          return null;
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  getCourseVersions(courseId, isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default
          .get(`${BASE_PATH}/courses/${courseId}/versions`)
          .set("Authorization", this.authString())
          .query(`includeRegistrationCount=true`)
          .query(`includeCourseMetadata=false`);
        return response.body;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.getCourseVersions(courseId, true);
        }
        if (e.response && e.response.status === 404) {
          return null;
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  // TODO: set title on upload
  uploadCourse(courseId, filePath, attemptToWaitForResult, isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default
          .post(`${BASE_PATH}/courses/importJobs/upload`)
          .set("Authorization", this.authString())
          .set("uploadedContentType", Util.scormUploadType(filePath))
          .query(`courseId=${courseId}`)
          .query("mayCreateNewVersion=true")
          .attach("file", filePath);
        const upload = response.body;
        if (upload.result && attemptToWaitForResult) {
          yield Util.sleep(attemptToWaitForResult);
          upload.importJob = yield this.getCourseUploadStatus(upload.result);
        }
        return upload;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.uploadCourse(courseId, filePath, attemptToWaitForResult, true);
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  getCourseUploadStatus(jobId, isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default
          .get(`${BASE_PATH}/courses/importJobs/${jobId}`)
          .set("Authorization", this.authString());
        return response.body;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.getCourseUploadStatus(jobId, true);
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  setCourseTitle(courseId, title, isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default
          .put(`${BASE_PATH}/courses/${courseId}/title`)
          .set("Authorization", this.authString())
          .send({ title: title });
        if (response.status !== 204) {
          throw new ScormClientError(`Failed to set course title '${courseId}'`);
        }
        return response.body;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.setCourseTitle(courseId, title, true);
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  deleteCourse(courseId, isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default
          .delete(`${BASE_PATH}/courses/${courseId}`)
          .set("Authorization", this.authString());
        if (response.status !== 204) {
          throw new ScormClientError(`Failed to delete the course '${courseId}'`);
        }
        return response.body;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.deleteCourse(courseId, true);
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
  deleteCourseVersion(courseId, versionId, isRetry = false) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.checkIsAuthenticated();
      try {
        const response = yield superagent_1.default
          .delete(`${BASE_PATH}/courses/${courseId}/versions/${versionId}`)
          .set("Authorization", this.authString());
        if (response.status !== 204) {
          throw new ScormClientError(`Failed to delete the course version '${courseId} ${versionId}'`);
        }
        return response.body;
      } catch (e) {
        if (!isRetry && e.response && e.response.status === 401) {
          yield this.refreshAuthentication();
          return this.deleteCourseVersion(courseId, versionId, true);
        }
        throw new ScormClientError(e.response || e);
      }
    });
  }
}
exports.ScormClient = ScormClient;
//# sourceMappingURL=index.js.map
