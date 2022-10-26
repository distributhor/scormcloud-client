[scormcloud-client](../README.md) / client

# Module: client

## Table of contents

### Classes

- [ScormClient](../classes/client.ScormClient.md)
- [ScormClientError](../classes/client.ScormClientError.md)

### Variables

- [TypeChecks](client.md#typechecks)
- [Util](client.md#util)

## Variables

### TypeChecks

• `Const` **TypeChecks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `containsErrorProperty` | (`x`: `any`) => x is ErrorProperty |
| `isAuthToken` | (`x`: `any`) => x is AuthToken |
| `isErrorObject` | (`x`: `any`) => x is ErrorObject |
| `isHttpError` | (`x`: `any`) => x is HttpError |

#### Defined in

[src/client.ts:48](https://github.com/distributhor/scormcloud-client/blob/49508a5/src/client.ts#L48)

___

### Util

• `Const` **Util**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getOption` | (`name`: `string`, `options?`: `Partial`<[`Options`](../interfaces/types.Options.md)\>) => `any` |
| `scormUploadType` | (`f`: `string`) => `string` |
| `sleep` | (`milliseconds`: `number`) => `unknown` |
| `hasProperty` | <X, Y\>(`obj`: `X`, `prop`: `Y`) => obj is X & Record<Y, unknown\> |

#### Defined in

[src/client.ts:83](https://github.com/distributhor/scormcloud-client/blob/49508a5/src/client.ts#L83)
