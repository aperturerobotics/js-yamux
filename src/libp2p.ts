import type { Duplex, Source } from 'it-stream-types'
import type { Uint8ArrayList } from 'uint8arraylist'

// Direction describes which side initiated a muxed connection or stream.
export type Direction = 'inbound' | 'outbound'

// AbortOptions carries an optional abort signal.
export interface AbortOptions {
  signal?: AbortSignal
}

// Logger is the minimal callable logger surface used by the muxer stack.
export interface Logger {
  (formatter: any, ...args: any[]): void
  error(formatter: any, ...args: any[]): void
  trace(formatter: any, ...args: any[]): void
  enabled: boolean
  newScope(name: string): Logger
}

// ComponentLogger builds per-component loggers.
export interface ComponentLogger {
  forComponent(name: string): Logger
}

// Stream is the supported duplex stream shape handled by the muxer.
export interface Stream
  extends Duplex<
    AsyncGenerator<Uint8ArrayList>,
    Source<Uint8ArrayList | Uint8Array>,
    Promise<void>
  > {
  close(options?: AbortOptions): Promise<void>
  closeRead(options?: AbortOptions): Promise<void>
  closeWrite(options?: AbortOptions): Promise<void>
  abort(err: Error): void
}

// StreamMuxerInit configures an individual muxer instance.
export interface StreamMuxerInit {
  onIncomingStream?(stream: Stream): void
  onStreamEnd?(stream: Stream): void
  direction?: Direction
  log?: Logger
}

// StreamMuxerFactory constructs stream muxers over a duplex transport.
export interface StreamMuxerFactory {
  protocol: string
  createStreamMuxer(init?: StreamMuxerInit): StreamMuxer
}

// StreamMuxer is the supported multiplexed transport surface.
export interface StreamMuxer
  extends Duplex<AsyncGenerator<Uint8Array | Uint8ArrayList>> {
  protocol: string
  readonly streams: Stream[]
  newStream(name?: string): Stream | Promise<Stream>
  close(options?: AbortOptions): Promise<void>
  abort(err: Error): void
}

// serviceCapabilities matches the libp2p well-known capability symbol.
export const serviceCapabilities = Symbol.for('@libp2p/service-capabilities')

export class AbortError extends Error {
  static name = 'AbortError'

  constructor (message: string = 'The operation was aborted') {
    super(message)
    this.name = 'AbortError'
  }
}

export class InvalidParametersError extends Error {
  static name = 'InvalidParametersError'

  constructor (message = 'Invalid parameters') {
    super(message)
    this.name = 'InvalidParametersError'
  }
}

export class MuxerClosedError extends Error {
  static name = 'MuxerClosedError'

  constructor (message = 'The muxer is closed') {
    super(message)
    this.name = 'MuxerClosedError'
  }
}

export class TooManyOutboundProtocolStreamsError extends Error {
  static name = 'TooManyOutboundProtocolStreamsError'

  constructor (message = 'Too many outbound protocol streams') {
    super(message)
    this.name = 'TooManyOutboundProtocolStreamsError'
  }
}
