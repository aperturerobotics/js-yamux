export interface Logger {
  trace(msg: string, ...args: any[]): void
  error(msg: string, ...args: any[]): void
}
