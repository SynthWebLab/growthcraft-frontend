/**
 * Validation Error class
 * Represents client-side or server-side input validation failures
 */

import { ApiError, ApiErrorOptions } from "./ApiError";

export interface FieldValidationError {
  field?: string;
  message: string;
}

export interface ValidationErrorOptions extends Omit<ApiErrorOptions, "code"> {
  fieldErrors?: FieldValidationError[];
}

export class ValidationError extends ApiError {
  public readonly fieldErrors: FieldValidationError[];

  constructor(message: string = "Validation failed", options: ValidationErrorOptions = {}) {
    super(message, {
      ...options,
      statusCode: options.statusCode || 400,
      code: "VALIDATION_ERROR",
    });
    this.name = "ValidationError";
    this.fieldErrors = options.fieldErrors || [];
  }

  /**
   * Extract formatted field error map { [field]: message }
   */
  public getFieldErrorMessageMap(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const err of this.fieldErrors) {
      if (err.field && !map[err.field]) {
        map[err.field] = err.message;
      }
    }
    return map;
  }

  public static isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }
}

export default ValidationError;
