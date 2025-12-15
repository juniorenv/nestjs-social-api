import { ApiResponse } from "@nestjs/swagger";

export function ApiNotFoundResponse(resource: string, customPath?: string) {
  const path = customPath || "/users/123e4567-e89b-12d3-a456-426614174000";

  return ApiResponse({
    status: 404,
    description: `${resource} not found`,
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

export function ApiInvalidUUIDResponse(customPath?: string) {
  const path = customPath || "/users/invalid-uuid";

  return ApiResponse({
    status: 400,
    description: "Invalid UUID format",
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

export function ApiConflictResponse(message: string, customPath?: string) {
  const path = customPath || "/users";

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

export function ApiUnauthorizedResponse(customPath?: string) {
  const path = customPath || "/users/123e4567-e89b-12d3-a456-426614174000";

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
        examples: {
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
        },
      },
    },
  });
}
