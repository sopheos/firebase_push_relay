import { ZodError } from "zod";

class HttpError extends Error {
  static readonly DEFAULT = "default";
  static readonly VALIDATION = "validation";
  static readonly SAVE = "save";

  status: number;
  error: string;
  errors: ErrorItem[];
  extra: Record<string, any> = {};

  /**
   * @param {number} [status=500] - The HTTP status code. Defaults to 500.
   * @param {string} [error=HttpError.DEFAULT] - The error code. Defaults to HttpError.DEFAULT.
   * @param {ErrorItem[]} [errors=[]] - An array of error items. Defaults to an empty array.
   */
  constructor(
    status: number = 500,
    error: string = HttpError.DEFAULT,
    errors: ErrorItem[] = [],
  ) {
    super(error);
    this.status = status;
    this.error = error;
    this.errors = errors;
  }

  setExtra(key: string, value: any): this {
    this.extra[key] = value;
    return this;
  }

  static create(
    status: number = 500,
    error: string = HttpError.DEFAULT,
    errors: ErrorItem[] = [],
  ): HttpError {
    return new this(status, error, errors);
  }

  static fromZod(
    zodError: ZodError,
    status: number = 400,
    error: string = HttpError.VALIDATION,
  ): HttpError {
    const errors: ErrorItem[] = [];

    zodError.issues.forEach((issue) => {
      errors.push(
        new ErrorItem(issue.path.join("."), issue.code, issue.message),
      );
    });

    return new HttpError(status, error, errors);
  }
}

export class ErrorItem {
  path: string;
  code: string;
  message: string | undefined | null;

  constructor(
    path: string,
    code: string,
    message: string | undefined | null = undefined,
  ) {
    this.path = path;
    this.code = code;
    this.message = message;
  }
}

export default HttpError;
