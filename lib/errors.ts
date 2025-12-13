export class SyncError extends Error {
  constructor(
    message: string,
    public step: string,
    public cause?: unknown
  ) {
    super(message)
    this.name = 'SyncError'
  }
}
