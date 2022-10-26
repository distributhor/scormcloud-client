[SCORM Cloud Client - v0.0.10](../README.md) / [client](../modules/client.md) / ScormClient

# Class: ScormClient

[client](../modules/client.md).ScormClient

The class can be used via it's constructor

```typescript
const client = new ScormClient();
```

```

## Table of contents

### Constructors

- [constructor](client.ScormClient.md#constructor)

### Properties

- [appId](client.ScormClient.md#appid)
- [authorisations](client.ScormClient.md#authorisations)
- [defaultExpiration](client.ScormClient.md#defaultexpiration)
- [defaultScope](client.ScormClient.md#defaultscope)
- [secretKey](client.ScormClient.md#secretkey)

### Accessors

- [DEFAULT\_TIMEOUT](client.ScormClient.md#default_timeout)

### Methods

- [authenticate](client.ScormClient.md#authenticate)
- [authorise](client.ScormClient.md#authorise)
- [createLaunchLink](client.ScormClient.md#createlaunchlink)
- [createRegistration](client.ScormClient.md#createregistration)
- [deleteCourse](client.ScormClient.md#deletecourse)
- [deleteCourseVersion](client.ScormClient.md#deletecourseversion)
- [deleteRegistration](client.ScormClient.md#deleteregistration)
- [getAuthToken](client.ScormClient.md#getauthtoken)
- [getBearerString](client.ScormClient.md#getbearerstring)
- [getCourse](client.ScormClient.md#getcourse)
- [getCourseUploadStatus](client.ScormClient.md#getcourseuploadstatus)
- [getCourseVersions](client.ScormClient.md#getcourseversions)
- [getCourses](client.ScormClient.md#getcourses)
- [getRegistrationProgress](client.ScormClient.md#getregistrationprogress)
- [getRegistrations](client.ScormClient.md#getregistrations)
- [getRegistrationsForCourse](client.ScormClient.md#getregistrationsforcourse)
- [getRegistrationsForLearner](client.ScormClient.md#getregistrationsforlearner)
- [getTargetScope](client.ScormClient.md#gettargetscope)
- [ping](client.ScormClient.md#ping)
- [registrationExists](client.ScormClient.md#registrationexists)
- [setCourseTitle](client.ScormClient.md#setcoursetitle)
- [uploadCourse](client.ScormClient.md#uploadcourse)

## Constructors

### constructor

• **new ScormClient**(`appId?`, `secretKey?`, `defaultScope?`, `defaultExpiration?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `appId?` | `string` |
| `secretKey?` | `string` |
| `defaultScope?` | `string` |
| `defaultExpiration?` | `number` |

#### Defined in

[src/client.ts:210](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L210)

## Properties

### appId

• `Private` `Optional` `Readonly` **appId**: `string`

#### Defined in

[src/client.ts:202](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L202)

___

### authorisations

• `Private` `Readonly` **authorisations**: `Map`<`string`, [`AuthToken`](../interfaces/types.AuthToken.md)\>

#### Defined in

[src/client.ts:208](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L208)

___

### defaultExpiration

• `Private` `Optional` `Readonly` **defaultExpiration**: `number`

#### Defined in

[src/client.ts:206](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L206)

___

### defaultScope

• `Private` `Optional` `Readonly` **defaultScope**: `string`

#### Defined in

[src/client.ts:205](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L205)

___

### secretKey

• `Private` `Optional` `Readonly` **secretKey**: `string`

#### Defined in

[src/client.ts:203](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L203)

## Accessors

### DEFAULT\_TIMEOUT

• `Static` `Private` `get` **DEFAULT_TIMEOUT**(): `number`

#### Returns

`number`

#### Defined in

[src/client.ts:217](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L217)

## Methods

### authenticate

▸ **authenticate**(`authScope?`, `timeout?`): `Promise`<[`AuthToken`](../interfaces/types.AuthToken.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authScope?` | `string` | The ScormCloud permission authScope |
| `timeout?` | `number` | The amount of time, in seconds, after which the auth token should expire |

#### Returns

`Promise`<[`AuthToken`](../interfaces/types.AuthToken.md)\>

Returns an AuthToken if successfull

#### Defined in

[src/client.ts:282](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L282)

___

### authorise

▸ `Private` **authorise**(`scope?`): `Promise`<`undefined` \| [`AuthToken`](../interfaces/types.AuthToken.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope?` | `string` \| [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<`undefined` \| [`AuthToken`](../interfaces/types.AuthToken.md)\>

#### Defined in

[src/client.ts:255](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L255)

___

### createLaunchLink

▸ **createLaunchLink**(`registrationId`, `redirectOnExitUrl`, `options?`): `Promise`<[`LaunchLink`](../interfaces/types.LaunchLink.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `registrationId` | `string` |
| `redirectOnExitUrl` | `string` |
| `options` | [`CreateLaunchLinkOptions`](../interfaces/types.CreateLaunchLinkOptions.md) |

#### Returns

`Promise`<[`LaunchLink`](../interfaces/types.LaunchLink.md)\>

#### Defined in

[src/client.ts:627](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L627)

___

### createRegistration

▸ **createRegistration**(`learner`, `courseId`, `registrationId`, `options?`): `Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `learner` | [`Learner`](../interfaces/types.Learner.md) |
| `courseId` | `string` |
| `registrationId` | `string` |
| `options` | [`CreateRegistrationOptions`](../interfaces/types.CreateRegistrationOptions.md) |

#### Returns

`Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Defined in

[src/client.ts:542](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L542)

___

### deleteCourse

▸ **deleteCourse**(`courseId`, `options?`): `Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `courseId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Defined in

[src/client.ts:453](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L453)

___

### deleteCourseVersion

▸ **deleteCourseVersion**(`courseId`, `versionId`, `options?`): `Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `courseId` | `string` |
| `versionId` | `number` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Defined in

[src/client.ts:492](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L492)

___

### deleteRegistration

▸ **deleteRegistration**(`registrationId`, `options?`): `Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `registrationId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Defined in

[src/client.ts:608](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L608)

___

### getAuthToken

▸ `Private` **getAuthToken**(`scope?`): `undefined` \| [`AuthToken`](../interfaces/types.AuthToken.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope?` | `string` \| [`Options`](../interfaces/types.Options.md) |

#### Returns

`undefined` \| [`AuthToken`](../interfaces/types.AuthToken.md)

#### Defined in

[src/client.ts:237](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L237)

___

### getBearerString

▸ `Private` **getBearerString**(`scope?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope?` | `string` \| [`Options`](../interfaces/types.Options.md) |

#### Returns

`string`

#### Defined in

[src/client.ts:248](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L248)

___

### getCourse

▸ **getCourse**(`courseId`, `options?`): `Promise`<`undefined` \| [`Course`](../interfaces/types.Course.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `courseId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<`undefined` \| [`Course`](../interfaces/types.Course.md)\>

#### Defined in

[src/client.ts:335](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L335)

___

### getCourseUploadStatus

▸ **getCourseUploadStatus**(`jobId`, `options?`): `Promise`<[`ImportJobResult`](../interfaces/types.ImportJobResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `jobId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`ImportJobResult`](../interfaces/types.ImportJobResult.md)\>

#### Defined in

[src/client.ts:419](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L419)

___

### getCourseVersions

▸ **getCourseVersions**(`courseId`, `options?`): `Promise`<`undefined` \| [`Course`](../interfaces/types.Course.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `courseId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<`undefined` \| [`Course`](../interfaces/types.Course.md)[]\>

#### Defined in

[src/client.ts:472](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L472)

___

### getCourses

▸ **getCourses**(`options?`): `Promise`<[`Course`](../interfaces/types.Course.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`Course`](../interfaces/types.Course.md)[]\>

#### Defined in

[src/client.ts:359](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L359)

___

### getRegistrationProgress

▸ **getRegistrationProgress**(`registrationId`, `options?`): `Promise`<[`RegistrationProgress`](../interfaces/types.RegistrationProgress.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `registrationId` | `string` |
| `options` | [`RegistrationProgressOptions`](../interfaces/types.RegistrationProgressOptions.md) |

#### Returns

`Promise`<[`RegistrationProgress`](../interfaces/types.RegistrationProgress.md)\>

#### Defined in

[src/client.ts:650](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L650)

___

### getRegistrations

▸ **getRegistrations**(`options?`): `Promise`<[`Registration`](../interfaces/types.Registration.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`Registration`](../interfaces/types.Registration.md)[]\>

#### Defined in

[src/client.ts:519](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L519)

___

### getRegistrationsForCourse

▸ **getRegistrationsForCourse**(`courseId`, `options?`): `Promise`<[`Registration`](../interfaces/types.Registration.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `courseId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`Registration`](../interfaces/types.Registration.md)[]\>

#### Defined in

[src/client.ts:511](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L511)

___

### getRegistrationsForLearner

▸ **getRegistrationsForLearner**(`learnerId`, `options?`): `Promise`<[`Registration`](../interfaces/types.Registration.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `learnerId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`Registration`](../interfaces/types.Registration.md)[]\>

#### Defined in

[src/client.ts:515](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L515)

___

### getTargetScope

▸ `Private` **getTargetScope**(`scope?`): `undefined` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope?` | `string` \| [`Options`](../interfaces/types.Options.md) |

#### Returns

`undefined` \| `string`

#### Defined in

[src/client.ts:221](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L221)

___

### ping

▸ **ping**(`options?`): `Promise`<[`PingResponse`](../interfaces/types.PingResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`PingResponse`](../interfaces/types.PingResponse.md)\>

#### Defined in

[src/client.ts:325](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L325)

___

### registrationExists

▸ **registrationExists**(`registrationId`, `options?`): `Promise`<`Boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `registrationId` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<`Boolean`\>

#### Defined in

[src/client.ts:578](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L578)

___

### setCourseTitle

▸ **setCourseTitle**(`courseId`, `title`, `options?`): `Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `courseId` | `string` |
| `title` | `string` |
| `options` | [`Options`](../interfaces/types.Options.md) |

#### Returns

`Promise`<[`SuccessIndicator`](../interfaces/types.SuccessIndicator.md)\>

#### Defined in

[src/client.ts:433](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L433)

___

### uploadCourse

▸ **uploadCourse**(`courseId`, `filePath`, `options?`): `Promise`<[`CourseUploadResponse`](../interfaces/types.CourseUploadResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `courseId` | `string` |
| `filePath` | `string` |
| `options` | [`CourseUploadOptions`](../interfaces/types.CourseUploadOptions.md) |

#### Returns

`Promise`<[`CourseUploadResponse`](../interfaces/types.CourseUploadResponse.md)\>

#### Defined in

[src/client.ts:370](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L370)
