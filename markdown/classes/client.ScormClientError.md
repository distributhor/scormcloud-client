[SCORM Cloud Client - v0.0.10](../README.md) / [client](../modules/client.md) / ScormClientError

# Class: ScormClientError

[client](../modules/client.md).ScormClientError

## Hierarchy

- `Error`

  ↳ **`ScormClientError`**

## Table of contents

### Constructors

- [constructor](client.ScormClientError.md#constructor)

### Properties

- [cause](client.ScormClientError.md#cause)
- [httpStatus](client.ScormClientError.md#httpstatus)
- [message](client.ScormClientError.md#message)
- [name](client.ScormClientError.md#name)
- [stack](client.ScormClientError.md#stack)
- [prepareStackTrace](client.ScormClientError.md#preparestacktrace)
- [stackTraceLimit](client.ScormClientError.md#stacktracelimit)

### Methods

- [captureStackTrace](client.ScormClientError.md#capturestacktrace)
- [parse](client.ScormClientError.md#parse)
- [parseErrorObject](client.ScormClientError.md#parseerrorobject)
- [parseHttpStatus](client.ScormClientError.md#parsehttpstatus)
- [parseMessage](client.ScormClientError.md#parsemessage)

## Constructors

### constructor

• **new ScormClientError**(`cause`, `message?`, `httpStatus?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cause` | `any` |
| `message?` | `string` |
| `httpStatus?` | `number` |

#### Overrides

Error.constructor

#### Defined in

[src/client.ts:123](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L123)

## Properties

### cause

• **cause**: `undefined` \| [`ErrorObject`](../interfaces/types.ErrorObject.md)

#### Defined in

[src/client.ts:121](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L121)

___

### httpStatus

• **httpStatus**: `undefined` \| `number`

#### Defined in

[src/client.ts:120](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L120)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1041

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1040

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1042

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:4

___

### parse

▸ `Static` `Private` **parse**(`cause`, `message?`, `httpStatus?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cause` | `any` |
| `message?` | `string` |
| `httpStatus?` | `number` |

#### Returns

`any`

#### Defined in

[src/client.ts:183](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L183)

___

### parseErrorObject

▸ `Static` `Private` **parseErrorObject**(`cause`): `undefined` \| [`ErrorObject`](../interfaces/types.ErrorObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cause` | `any` |

#### Returns

`undefined` \| [`ErrorObject`](../interfaces/types.ErrorObject.md)

#### Defined in

[src/client.ts:179](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L179)

___

### parseHttpStatus

▸ `Static` `Private` **parseHttpStatus**(`cause`, `httpStatus?`): `undefined` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cause` | `any` |
| `httpStatus?` | `number` |

#### Returns

`undefined` \| `number`

#### Defined in

[src/client.ts:167](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L167)

___

### parseMessage

▸ `Static` `Private` **parseMessage**(`cause`, `message?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cause` | `any` |
| `message?` | `string` |

#### Returns

`string`

#### Defined in

[src/client.ts:139](https://github.com/distributhor/scormcloud-client/blob/8456234/src/client.ts#L139)
