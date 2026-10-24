export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message)
    this.status = status
    this.extra = extra
  }
}

export const fail = (status, message, extra) => {
  throw new HttpError(status, message, extra)
}

export function toResponse(error) {
  if (error instanceof HttpError) return { status: error.status, data: { message: error.message, ...error.extra } }
  if (error?.status === 422 && error.extra) return { status: 422, data: { message: error.message, ...error.extra } }
  return { status: 500, data: { message: 'خطای داخلی سرور' } }
}
