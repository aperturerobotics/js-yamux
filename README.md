# @aptre/yamux

> Yamux stream multiplexer for JavaScript

# About

This module is a JavaScript implementation of [Yamux from Hashicorp] designed to be used with as few dependencies as possible.

This is a fork of [ChainSafe's js-libp2p-yamux] with the libp2p dependencies removed for use in standalone applications.

[Yamux from Hashicorp]: https://github.com/hashicorp/yamux/blob/master/spec.md
[ChainSafe's js-libp2p-yamux]: https://github.com/ChainSafe/js-libp2p-yamux

## Example - Using the low-level API

```js
import { yamux } from '@aptre/yamux'
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
$ npm i @aptre/yamux
```

or

```console
$ yarn add @aptre/yamux
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/aperturerobotics/js-yamux/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/aperturerobotics/js-yamux/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
