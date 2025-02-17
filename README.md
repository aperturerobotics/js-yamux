# @aptre/js-yamux

> Yamux stream multiplexer without libp2p deps

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

This module is a JavaScript implementation of [Yamux from Hashicorp](https://github.com/hashicorp/yamux/blob/master/spec.md) designed to be used with [js-libp2p](https://github.com/libp2p/js-libp2p).

## Example - Configure libp2p with Yamux

```typescript
import { yamux } from '@aptre/js-yamux'

const node = await createLibp2p({
  // ... other options
  streamMuxers: [
    yamux()
  ]
})
```

## Example - Using the low-level API

```js
import { yamux } from '@aptre/js-yamux'
import { pipe } from 'it-pipe'
import { duplexPair } from 'it-pair/duplex'
import all from 'it-all'

// Connect two yamux muxers to demo basic stream multiplexing functionality

const clientMuxer = yamux({
  client: true,
  onIncomingStream: stream => {
    // echo data on incoming streams
    pipe(stream, stream)
  },
  onStreamEnd: stream => {
    // do nothing
  }
})()

const serverMuxer = yamux({
  client: false,
  onIncomingStream: stream => {
    // echo data on incoming streams
    pipe(stream, stream)
  },
  onStreamEnd: stream => {
    // do nothing
  }
})()

// `p` is our "connections", what we use to connect the two sides
// In a real application, a connection is usually to a remote computer
const p = duplexPair()

// connect the muxers together
pipe(p[0], clientMuxer, p[0])
pipe(p[1], serverMuxer, p[1])

// now either side can open streams
const stream0 = clientMuxer.newStream()
const stream1 = serverMuxer.newStream()

// Send some data to the other side
const encoder = new TextEncoder()
const data = [encoder.encode('hello'), encoder.encode('world')]
pipe(data, stream0)

// Receive data back
const result = await pipe(stream0, all)

// close a stream
stream1.close()

// close the muxer
clientMuxer.close()
```

# Install

```console
$ npm i @aptre/js-yamux
```

# API Docs

- <https://ChainSafe.github.io/js-libp2p-yamux>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/ChainSafe/js-libp2p-yamux/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/ChainSafe/js-libp2p-yamux/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
