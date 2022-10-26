[scormcloud-client](../README.md) / [types](../modules/types.md) / HttpResponse

# Interface: HttpResponse

[types](../modules/types.md).HttpResponse

## Hierarchy

- `Response`

  ↳ **`HttpResponse`**

## Table of contents

### Properties

- [accepted](types.HttpResponse.md#accepted)
- [badRequest](types.HttpResponse.md#badrequest)
- [body](types.HttpResponse.md#body)
- [charset](types.HttpResponse.md#charset)
- [clientError](types.HttpResponse.md#clienterror)
- [error](types.HttpResponse.md#error)
- [files](types.HttpResponse.md#files)
- [forbidden](types.HttpResponse.md#forbidden)
- [header](types.HttpResponse.md#header)
- [headers](types.HttpResponse.md#headers)
- [info](types.HttpResponse.md#info)
- [links](types.HttpResponse.md#links)
- [noContent](types.HttpResponse.md#nocontent)
- [notAcceptable](types.HttpResponse.md#notacceptable)
- [notFound](types.HttpResponse.md#notfound)
- [ok](types.HttpResponse.md#ok)
- [readable](types.HttpResponse.md#readable)
- [redirect](types.HttpResponse.md#redirect)
- [redirects](types.HttpResponse.md#redirects)
- [serverError](types.HttpResponse.md#servererror)
- [status](types.HttpResponse.md#status)
- [statusCode](types.HttpResponse.md#statuscode)
- [statusType](types.HttpResponse.md#statustype)
- [text](types.HttpResponse.md#text)
- [type](types.HttpResponse.md#type)
- [unauthorized](types.HttpResponse.md#unauthorized)
- [xhr](types.HttpResponse.md#xhr)

### Methods

- [[asyncIterator]](types.HttpResponse.md#[asynciterator])
- [addListener](types.HttpResponse.md#addlistener)
- [emit](types.HttpResponse.md#emit)
- [eventNames](types.HttpResponse.md#eventnames)
- [get](types.HttpResponse.md#get)
- [getMaxListeners](types.HttpResponse.md#getmaxlisteners)
- [isPaused](types.HttpResponse.md#ispaused)
- [listenerCount](types.HttpResponse.md#listenercount)
- [listeners](types.HttpResponse.md#listeners)
- [off](types.HttpResponse.md#off)
- [on](types.HttpResponse.md#on)
- [once](types.HttpResponse.md#once)
- [pause](types.HttpResponse.md#pause)
- [pipe](types.HttpResponse.md#pipe)
- [prependListener](types.HttpResponse.md#prependlistener)
- [prependOnceListener](types.HttpResponse.md#prependoncelistener)
- [rawListeners](types.HttpResponse.md#rawlisteners)
- [read](types.HttpResponse.md#read)
- [removeAllListeners](types.HttpResponse.md#removealllisteners)
- [removeListener](types.HttpResponse.md#removelistener)
- [resume](types.HttpResponse.md#resume)
- [setEncoding](types.HttpResponse.md#setencoding)
- [setMaxListeners](types.HttpResponse.md#setmaxlisteners)
- [unpipe](types.HttpResponse.md#unpipe)
- [unshift](types.HttpResponse.md#unshift)
- [wrap](types.HttpResponse.md#wrap)

## Properties

### accepted

• **accepted**: `boolean`

#### Inherited from

Response.accepted

#### Defined in

node_modules/@types/superagent/index.d.ts:104

___

### badRequest

• **badRequest**: `boolean`

#### Inherited from

Response.badRequest

#### Defined in

node_modules/@types/superagent/index.d.ts:105

___

### body

• **body**: `any`

#### Overrides

Response.body

#### Defined in

[src/types.ts:30](https://github.com/distributhor/scormcloud-client/blob/49508a5/src/types.ts#L30)

___

### charset

• **charset**: `string`

#### Inherited from

Response.charset

#### Defined in

node_modules/@types/superagent/index.d.ts:107

___

### clientError

• **clientError**: `boolean`

#### Inherited from

Response.clientError

#### Defined in

node_modules/@types/superagent/index.d.ts:108

___

### error

• **error**: ``false`` \| `HTTPError`

#### Inherited from

Response.error

#### Defined in

node_modules/@types/superagent/index.d.ts:109

___

### files

• **files**: `any`

#### Inherited from

Response.files

#### Defined in

node_modules/@types/superagent/index.d.ts:110

___

### forbidden

• **forbidden**: `boolean`

#### Inherited from

Response.forbidden

#### Defined in

node_modules/@types/superagent/index.d.ts:111

___

### header

• **header**: `any`

#### Inherited from

Response.header

#### Defined in

node_modules/@types/superagent/index.d.ts:114

___

### headers

• **headers**: `any`

#### Inherited from

Response.headers

#### Defined in

node_modules/@types/superagent/index.d.ts:115

___

### info

• **info**: `boolean`

#### Inherited from

Response.info

#### Defined in

node_modules/@types/superagent/index.d.ts:116

___

### links

• **links**: `Record`<`string`, `string`\>

#### Inherited from

Response.links

#### Defined in

node_modules/@types/superagent/index.d.ts:117

___

### noContent

• **noContent**: `boolean`

#### Inherited from

Response.noContent

#### Defined in

node_modules/@types/superagent/index.d.ts:118

___

### notAcceptable

• **notAcceptable**: `boolean`

#### Inherited from

Response.notAcceptable

#### Defined in

node_modules/@types/superagent/index.d.ts:119

___

### notFound

• **notFound**: `boolean`

#### Inherited from

Response.notFound

#### Defined in

node_modules/@types/superagent/index.d.ts:120

___

### ok

• **ok**: `boolean`

#### Inherited from

Response.ok

#### Defined in

node_modules/@types/superagent/index.d.ts:121

___

### readable

• **readable**: `boolean`

#### Inherited from

Response.readable

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:201

___

### redirect

• **redirect**: `boolean`

#### Inherited from

Response.redirect

#### Defined in

node_modules/@types/superagent/index.d.ts:122

___

### redirects

• **redirects**: `string`[]

#### Inherited from

Response.redirects

#### Defined in

node_modules/@types/superagent/index.d.ts:131

___

### serverError

• **serverError**: `boolean`

#### Inherited from

Response.serverError

#### Defined in

node_modules/@types/superagent/index.d.ts:123

___

### status

• **status**: `number`

#### Overrides

Response.status

#### Defined in

[src/types.ts:31](https://github.com/distributhor/scormcloud-client/blob/49508a5/src/types.ts#L31)

___

### statusCode

• **statusCode**: `number`

#### Inherited from

Response.statusCode

#### Defined in

node_modules/@types/superagent/index.d.ts:125

___

### statusType

• **statusType**: `number`

#### Inherited from

Response.statusType

#### Defined in

node_modules/@types/superagent/index.d.ts:126

___

### text

• **text**: `string`

#### Inherited from

Response.text

#### Defined in

node_modules/@types/superagent/index.d.ts:127

___

### type

• **type**: `string`

#### Inherited from

Response.type

#### Defined in

node_modules/@types/superagent/index.d.ts:128

___

### unauthorized

• **unauthorized**: `boolean`

#### Inherited from

Response.unauthorized

#### Defined in

node_modules/@types/superagent/index.d.ts:129

___

### xhr

• **xhr**: `any`

#### Inherited from

Response.xhr

#### Defined in

node_modules/@types/superagent/index.d.ts:130

## Methods

### [asyncIterator]

▸ **[asyncIterator]**(): `AsyncIterableIterator`<`string` \| `Buffer`\>

#### Returns

`AsyncIterableIterator`<`string` \| `Buffer`\>

#### Inherited from

Response.\_\_@asyncIterator@3254

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:211

___

### addListener

▸ **addListener**(`eventName`, `listener`): [`HttpResponse`](types.HttpResponse.md)

Alias for `emitter.on(eventName, listener)`.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.addListener

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:354

___

### emit

▸ **emit**(`eventName`, ...`args`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

Response.emit

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:610

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

**`Since`**

v6.0.0

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

Response.eventNames

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:669

___

### get

▸ **get**(`header`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `string` |

#### Returns

`string`

#### Inherited from

Response.get

#### Defined in

node_modules/@types/superagent/index.d.ts:112

▸ **get**(`header`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | ``"Set-Cookie"`` |

#### Returns

`string`[]

#### Inherited from

Response.get

#### Defined in

node_modules/@types/superagent/index.d.ts:113

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to defaultMaxListeners.

**`Since`**

v1.0.0

#### Returns

`number`

#### Inherited from

Response.getMaxListeners

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:526

___

### isPaused

▸ **isPaused**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Response.isPaused

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:206

___

### listenerCount

▸ **listenerCount**(`eventName`): `number`

Returns the number of listeners listening to the event named `eventName`.

**`Since`**

v3.2.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |

#### Returns

`number`

#### Inherited from

Response.listenerCount

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:616

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

Response.listeners

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:539

___

### off

▸ **off**(`eventName`, `listener`): [`HttpResponse`](types.HttpResponse.md)

Alias for `emitter.removeListener()`.

**`Since`**

v10.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.off

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:499

___

### on

▸ **on**(`eventName`, `listener`): [`HttpResponse`](types.HttpResponse.md)

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`Since`**

v0.1.101

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.on

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:385

___

### once

▸ **once**(`eventName`, `listener`): [`HttpResponse`](types.HttpResponse.md)

Adds a **one-time**`listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`Since`**

v0.3.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.once

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:414

___

### pause

▸ **pause**(): [`HttpResponse`](types.HttpResponse.md)

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.pause

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:204

___

### pipe

▸ **pipe**<`T`\>(`destination`, `options?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `WritableStream`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination` | `T` |
| `options?` | `Object` |
| `options.end?` | `boolean` |

#### Returns

`T`

#### Inherited from

Response.pipe

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:207

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): [`HttpResponse`](types.HttpResponse.md)

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.prependListener

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:634

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): [`HttpResponse`](types.HttpResponse.md)

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.prependOnceListener

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:650

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

**`Since`**

v9.4.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

Response.rawListeners

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:569

___

### read

▸ **read**(`size?`): `string` \| `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `number` |

#### Returns

`string` \| `Buffer`

#### Inherited from

Response.read

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:202

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`HttpResponse`](types.HttpResponse.md)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.removeAllListeners

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:510

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): [`HttpResponse`](types.HttpResponse.md)

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and _before_ the last listener finishes execution
will not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.removeListener

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:494

___

### resume

▸ **resume**(): [`HttpResponse`](types.HttpResponse.md)

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.resume

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:205

___

### setEncoding

▸ **setEncoding**(`encoding`): [`HttpResponse`](types.HttpResponse.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoding` | `BufferEncoding` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.setEncoding

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:203

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`HttpResponse`](types.HttpResponse.md)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`Since`**

v0.3.5

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.setMaxListeners

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:520

___

### unpipe

▸ **unpipe**(`destination?`): [`HttpResponse`](types.HttpResponse.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `destination?` | `WritableStream` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.unpipe

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:208

___

### unshift

▸ **unshift**(`chunk`, `encoding?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `string` \| `Uint8Array` |
| `encoding?` | `BufferEncoding` |

#### Returns

`void`

#### Inherited from

Response.unshift

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:209

___

### wrap

▸ **wrap**(`oldStream`): [`HttpResponse`](types.HttpResponse.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `oldStream` | `ReadableStream` |

#### Returns

[`HttpResponse`](types.HttpResponse.md)

#### Inherited from

Response.wrap

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:210
