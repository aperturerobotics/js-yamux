/**
 * @packageDocumentation
 *
 * This module is a JavaScript implementation of [Yamux from Hashicorp](https://github.com/hashicorp/yamux/blob/master/spec.md) for JS.
 *
 * @example Using the low-level API
 *
 * ```js
 * import { yamux } from '@aptre/js-yamux'
 * import { pipe } from 'it-pipe'
 * import { duplexPair } from 'it-pair/duplex'
 * import all from 'it-all'
 *
 * // Connect two yamux muxers to demo basic stream multiplexing functionality
 *
 * const clientMuxer = yamux({
 *   client: true,
 *   onIncomingStream: stream => {
 *     // echo data on incoming streams
 *     pipe(stream, stream)
 *   },
 *   onStreamEnd: stream => {
 *     // do nothing
 *   }
 * })()
 *
 * const serverMuxer = yamux({
 *   client: false,
 *   onIncomingStream: stream => {
 *     // echo data on incoming streams
 *     pipe(stream, stream)
 *   },
 *   onStreamEnd: stream => {
 *     // do nothing
 *   }
 * })()
 *
 * // `p` is our "connections", what we use to connect the two sides
 * // In a real application, a connection is usually to a remote computer
 * const p = duplexPair()
 *
 * // connect the muxers together
 * pipe(p[0], clientMuxer, p[0])
 * pipe(p[1], serverMuxer, p[1])
 *
 * // now either side can open streams
 * const stream0 = clientMuxer.newStream()
 * const stream1 = serverMuxer.newStream()
 *
 * // Send some data to the other side
 * const encoder = new TextEncoder()
 * const data = [encoder.encode('hello'), encoder.encode('world')]
 * pipe(data, stream0)
 *
 * // Receive data back
 * const result = await pipe(stream0, all)
 *
 * // close a stream
 * stream1.close()
 *
 * // close the muxer
 * clientMuxer.close()
 * ```
 */

import type { Logger } from './logger.js'
import { Yamux } from './muxer.js'
import type { YamuxMuxerInit } from './muxer.js'

export { GoAwayCode, type FrameHeader, type FrameType } from './frame.js'
export type { YamuxMuxerInit }

export interface YamuxMuxerComponents {
  log?: Logger
}

export function yamux (init: YamuxMuxerInit = {}): (components: YamuxMuxerComponents) => StreamMuxerFactory {
  return (components) => new Yamux(components, init)
}
