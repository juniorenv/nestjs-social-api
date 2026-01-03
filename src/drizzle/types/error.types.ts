import { DatabaseError } from "pg";

/**
 * Type guard to check if an error is a DrizzleQueryError with a DatabaseError cause
 * @param error - The error to check
 * @returns True if the error has a DatabaseError cause
 */
export function isDrizzleDbError(
  error: unknown,
): error is { cause: DatabaseError } {
  return (
    typeof error === "object" &&
    error !== null &&
    "cause" in error &&
    error.cause instanceof DatabaseError
  );
}

/**
 * Common PostgreSQL error codes
 */
export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  NOT_NULL_VIOLATION: "23502",
  CHECK_VIOLATION: "23514",
} as const;
