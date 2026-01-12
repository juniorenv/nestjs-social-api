import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function ApiNotFoundErrorResponse(resource: string, customPath: string) {
  const path = customPath;

  return ApiResponse({
    status: 404,
    description: `Not Found - ${resource} not found`,
    schema: {
      example: {
        statusCode: 404,
        timestamp: "2025-12-14T10:30:00.000Z",
        path,
        message: {
          message: `${resource} with ID 123e4567-e89b-12d3-a456-426614174000 not found`,
          error: "Not Found",
        },
      },
    },
  });
}

export function ApiInvalidUUIDResponse(customPath: string) {
  const path = customPath;

  return ApiResponse({
    status: 400,
    description: "Bad Request - Invalid UUID format",
    schema: {
      example: {
        statusCode: 400,
        timestamp: "2025-12-14T10:30:00.000Z",
        path,
        message: {
          message: "Validation failed (uuid is expected)",
          error: "Bad Request",
        },
      },
    },
  });
}

export function ApiConflictErrorResponse(message: string, customPath: string) {
  const path = customPath;

  return ApiResponse({
    status: 409,
    description: "Conflict - Resource already exists",
    schema: {
      example: {
        statusCode: 409,
        timestamp: "2025-12-14T10:30:00.000Z",
        path,
        message: {
          message,
          error: "Conflict",
        },
      },
    },
  });
}

export function ApiUnauthorizedErrorResponse(
  customPath: string,
  additionalExamples?: Record<string, any>,
) {
  const path = customPath;

  const baseExamples = {
    missingToken: {
      summary: "Missing access token",
      description: "No token provided in request",
      value: {
        statusCode: 401,
        timestamp: "2025-12-14T20:00:02.260Z",
        path,
        message: {
          message: "Access token is required",
          error: "Unauthorized",
        },
      },
    },
    expiredToken: {
      summary: "Expired token",
      description: "The JWT token has expired",
      value: {
        statusCode: 401,
        timestamp: "2025-12-14T20:00:02.260Z",
        path,
        message: {
          message: "Token has expired",
          error: "Unauthorized",
        },
      },
    },
    invalidToken: {
      summary: "Invalid token format",
      description: "Token signature or structure is invalid",
      value: {
        statusCode: 401,
        timestamp: "2025-12-14T20:00:02.260Z",
        path,
        message: {
          message: "Invalid access token",
          error: "Unauthorized",
        },
      },
    },
    generalAuthFailure: {
      summary: "General authorization failure",
      description: "Generic auth error",
      value: {
        statusCode: 401,
        timestamp: "2025-12-14T20:00:02.260Z",
        path,
        message: {
          message: "Authorization failed",
          error: "Unauthorized",
        },
      },
    },
  };

  const allExamples = additionalExamples
    ? { ...baseExamples, ...additionalExamples }
    : baseExamples;

  return ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication failed",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 401 },
            timestamp: { type: "string", example: "2025-12-14T20:00:02.260Z" },
            path: {
              type: "string",
              example: path,
            },
            message: {
              type: "object",
              properties: {
                message: { type: "string" },
                error: { type: "string" },
              },
            },
          },
        },
        examples: allExamples,
      },
    },
  });
}

export function ApiDatabaseExceptionResponses(customPath: string) {
  return applyDecorators(
    ApiResponse({
      status: 500,
      description: "Internal Server Error - Database query or operation error",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 500 },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2025-12-15T14:49:04.911Z",
          },
          path: { type: "string", example: customPath },
          message: { type: "string", example: "Database error occurred" },
        },
      },
    }),
    ApiResponse({
      status: 503,
      description: "Service Unavailable - Database connection error",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 503 },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2025-12-15T14:49:04.911Z",
          },
          path: { type: "string", example: customPath },
          message: { type: "string", example: "Database connection failed" },
        },
      },
    }),
  );
}

export function ApiGroupForbiddenErrorResponse(customPath?: string) {
  const path = customPath || "/groups/123e4567-e89b-12d3-a456-426614174000";

  return ApiResponse({
    status: 403,
    description: "Forbidden - Only group owner can update",
    content: {
      "application/json": {
        examples: {
          notOwner: {
            summary: "Not Group Owner",
            value: {
              statusCode: 403,
              timestamp: "2025-12-14T10:30:00.000Z",
              path,
              message: {
                message: "Only the group owner can perform this action",
                error: "Forbidden",
              },
            },
          },
          notMember: {
            summary: "Not Group Member",
            value: {
              statusCode: 403,
              timestamp: "2025-12-14T10:30:00.000Z",
              path,
              message: {
                message: "You are not a member of this group",
                error: "Forbidden",
              },
            },
          },
        },
      },
    },
  });
}

export function ApiForbiddenErrorResponse(customPath: string) {
  const path = customPath;

  return ApiResponse({
    status: 403,
    description: "Forbidden - No permission to access this resource",
    schema: {
      example: {
        statusCode: 403,
        timestamp: "2025-01-12T13:01:19.818Z",
        path,
        message: {
          message: "You do not have permission to access this resource",
          error: "Forbidden",
        },
      },
    },
  });
}
