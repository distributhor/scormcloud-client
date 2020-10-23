**[ScormCloud Client - v0.0.9](../README.md)**

> [Globals](../globals.md) / ["client"](../modules/_client_.md) / ScormClient

# Class: ScormClient

The class can be used via it's constructor

```typescript
const client = new ScormClient();
```

or you can obtain a singleton instance

```typescript
const client = ScormClient.getInstance();
```

## Hierarchy

- **ScormClient**

## Index

### Constructors

- [constructor](_client_.scormclient.md#constructor)

### Methods

- [authenticate](_client_.scormclient.md#authenticate)
- [deleteCourse](_client_.scormclient.md#deletecourse)
- [deleteCourseVersion](_client_.scormclient.md#deletecourseversion)
- [getCourse](_client_.scormclient.md#getcourse)
- [getCourseUploadStatus](_client_.scormclient.md#getcourseuploadstatus)
- [getCourseVersions](_client_.scormclient.md#getcourseversions)
- [getCourses](_client_.scormclient.md#getcourses)
- [ping](_client_.scormclient.md#ping)
- [setCourseTitle](_client_.scormclient.md#setcoursetitle)
- [uploadCourse](_client_.scormclient.md#uploadcourse)
- [getInstance](_client_.scormclient.md#getinstance)

## Constructors

### constructor

\+ **new ScormClient**(`appId?`: string, `secretKey?`: string, `scope?`: string, `timeout?`: number): [ScormClient](_client_.scormclient.md)

_Defined in [src/client.ts:175](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L175)_

#### Parameters:

| Name         | Type   |
| ------------ | ------ |
| `appId?`     | string |
| `secretKey?` | string |
| `scope?`     | string |
| `timeout?`   | number |

**Returns:** [ScormClient](_client_.scormclient.md)

## Methods

### authenticate

▸ **authenticate**(`appId`: string, `secretKey`: string, `scope`: string, `timeout?`: number): Promise\<[AuthToken](../interfaces/_types_.authtoken.md)>

_Defined in [src/client.ts:231](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L231)_

#### Parameters:

| Name        | Type   | Description                                                                       |
| ----------- | ------ | --------------------------------------------------------------------------------- |
| `appId`     | string | The ScormCloud application id                                                     |
| `secretKey` | string | The ScormCloud secrent key                                                        |
| `scope`     | string | The ScormCloud permission scope                                                   |
| `timeout?`  | number | The amount of time, in second, after which the authentication token should expire |

**Returns:** Promise\<[AuthToken](../interfaces/_types_.authtoken.md)>

Returns an AuthToken if successfull

---

### deleteCourse

▸ **deleteCourse**(`courseId`: string, `options?`: [Options](../interfaces/_types_.options.md)): Promise\<[SuccessIndicator](../interfaces/_types_.successindicator.md)>

_Defined in [src/client.ts:413](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L413)_

#### Parameters:

| Name       | Type                                        | Default value |
| ---------- | ------------------------------------------- | ------------- |
| `courseId` | string                                      | -             |
| `options`  | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[SuccessIndicator](../interfaces/_types_.successindicator.md)>

---

### deleteCourseVersion

▸ **deleteCourseVersion**(`courseId`: string, `versionId`: number, `options?`: [Options](../interfaces/_types_.options.md)): Promise\<[SuccessIndicator](../interfaces/_types_.successindicator.md)>

_Defined in [src/client.ts:463](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L463)_

#### Parameters:

| Name        | Type                                        | Default value |
| ----------- | ------------------------------------------- | ------------- |
| `courseId`  | string                                      | -             |
| `versionId` | number                                      | -             |
| `options`   | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[SuccessIndicator](../interfaces/_types_.successindicator.md)>

---

### getCourse

▸ **getCourse**(`courseId`: string, `options?`: [Options](../interfaces/_types_.options.md)): Promise\<[Course](../interfaces/_types_.course.md)>

_Defined in [src/client.ts:275](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L275)_

#### Parameters:

| Name       | Type                                        | Default value |
| ---------- | ------------------------------------------- | ------------- |
| `courseId` | string                                      | -             |
| `options`  | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[Course](../interfaces/_types_.course.md)>

---

### getCourseUploadStatus

▸ **getCourseUploadStatus**(`jobId`: string, `options?`: [Options](../interfaces/_types_.options.md)): Promise\<[ImportJobResult](../interfaces/_types_.importjobresult.md)>

_Defined in [src/client.ts:371](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L371)_

#### Parameters:

| Name      | Type                                        | Default value |
| --------- | ------------------------------------------- | ------------- |
| `jobId`   | string                                      | -             |
| `options` | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[ImportJobResult](../interfaces/_types_.importjobresult.md)>

---

### getCourseVersions

▸ **getCourseVersions**(`courseId`: string, `options?`: [Options](../interfaces/_types_.options.md)): Promise\<[Course](../interfaces/_types_.course.md)[]>

_Defined in [src/client.ts:438](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L438)_

#### Parameters:

| Name       | Type                                        | Default value |
| ---------- | ------------------------------------------- | ------------- |
| `courseId` | string                                      | -             |
| `options`  | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[Course](../interfaces/_types_.course.md)[]>

---

### getCourses

▸ **getCourses**(`options?`: [Options](../interfaces/_types_.options.md)): Promise\<[Course](../interfaces/_types_.course.md)[]>

_Defined in [src/client.ts:300](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L300)_

#### Parameters:

| Name      | Type                                        | Default value |
| --------- | ------------------------------------------- | ------------- |
| `options` | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[Course](../interfaces/_types_.course.md)[]>

---

### ping

▸ **ping**(`options?`: [Options](../interfaces/_types_.options.md)): Promise\<[PingResponse](../interfaces/_types_.pingresponse.md)>

_Defined in [src/client.ts:260](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L260)_

#### Parameters:

| Name      | Type                                        | Default value |
| --------- | ------------------------------------------- | ------------- |
| `options` | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[PingResponse](../interfaces/_types_.pingresponse.md)>

---

### setCourseTitle

▸ **setCourseTitle**(`courseId`: string, `title`: string, `options?`: [Options](../interfaces/_types_.options.md)): Promise\<[SuccessIndicator](../interfaces/_types_.successindicator.md)>

_Defined in [src/client.ts:387](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L387)_

#### Parameters:

| Name       | Type                                        | Default value |
| ---------- | ------------------------------------------- | ------------- |
| `courseId` | string                                      | -             |
| `title`    | string                                      | -             |
| `options`  | [Options](../interfaces/_types_.options.md) | {}            |

**Returns:** Promise\<[SuccessIndicator](../interfaces/_types_.successindicator.md)>

---

### uploadCourse

▸ **uploadCourse**(`courseId`: string, `filePath`: string, `options?`: [CourseUploadOptions](../interfaces/_types_.courseuploadoptions.md)): Promise\<[CourseUploadResponse](../interfaces/_types_.courseuploadresponse.md)>

_Defined in [src/client.ts:316](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L316)_

#### Parameters:

| Name       | Type                                                                | Default value |
| ---------- | ------------------------------------------------------------------- | ------------- |
| `courseId` | string                                                              | -             |
| `filePath` | string                                                              | -             |
| `options`  | [CourseUploadOptions](../interfaces/_types_.courseuploadoptions.md) | {}            |

**Returns:** Promise\<[CourseUploadResponse](../interfaces/_types_.courseuploadresponse.md)>

---

### getInstance

▸ `Static`**getInstance**(`appId?`: string, `secretKey?`: string, `scope?`: string, `timeout?`: number): [ScormClient](_client_.scormclient.md)

_Defined in [src/client.ts:188](https://github.com/distributhor/scormcloud-client/blob/6454752/src/client.ts#L188)_

#### Parameters:

| Name         | Type   |
| ------------ | ------ |
| `appId?`     | string |
| `secretKey?` | string |
| `scope?`     | string |
| `timeout?`   | number |

**Returns:** [ScormClient](_client_.scormclient.md)
