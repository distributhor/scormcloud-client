**[ScormCloud Client - v0.0.9](../README.md)**

> [Globals](../README.md) / ["client"](../modules/_client_.md) / ScormClientError

# Class: ScormClientError

## Hierarchy

- [Error](_client_.scormclienterror.md#error)

  ↳ **ScormClientError**

## Index

### Constructors

- [constructor](_client_.scormclienterror.md#constructor)

### Properties

- [cause](_client_.scormclienterror.md#cause)
- [httpStatus](_client_.scormclienterror.md#httpstatus)
- [message](_client_.scormclienterror.md#message)
- [name](_client_.scormclienterror.md#name)
- [stack](_client_.scormclienterror.md#stack)
- [Error](_client_.scormclienterror.md#error)

## Constructors

### constructor

\+ **new ScormClientError**(`cause`: any, `message?`: string, `httpStatus?`: number): [ScormClientError](_client_.scormclienterror.md)

_Defined in [src/client.ts:88](https://github.com/distributhor/scormcloud-client/blob/b730efd/src/client.ts#L88)_

#### Parameters:

| Name          | Type   |
| ------------- | ------ |
| `cause`       | any    |
| `message?`    | string |
| `httpStatus?` | number |

**Returns:** [ScormClientError](_client_.scormclienterror.md)

## Properties

### cause

• **cause**: [ErrorObject](../interfaces/_types_.errorobject.md)

_Defined in [src/client.ts:88](https://github.com/distributhor/scormcloud-client/blob/b730efd/src/client.ts#L88)_

---

### httpStatus

• **httpStatus**: number

_Defined in [src/client.ts:87](https://github.com/distributhor/scormcloud-client/blob/b730efd/src/client.ts#L87)_

---

### message

• **message**: string

_Inherited from [ScormClientError](_client_.scormclienterror.md).[message](_client_.scormclienterror.md#message)_

_Defined in node_modules/typescript/lib/lib.es5.d.ts:974_

---

### name

• **name**: string

_Inherited from [ScormClientError](_client_.scormclienterror.md).[name](_client_.scormclienterror.md#name)_

_Defined in node_modules/typescript/lib/lib.es5.d.ts:973_

---

### stack

• `Optional` **stack**: string

_Inherited from [ScormClientError](_client_.scormclienterror.md).[stack](_client_.scormclienterror.md#stack)_

_Defined in node_modules/typescript/lib/lib.es5.d.ts:975_

---

### Error

▪ `Static` **Error**: ErrorConstructor

_Defined in node_modules/typescript/lib/lib.es5.d.ts:984_
