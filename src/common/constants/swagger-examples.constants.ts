export const SWAGGER_EXAMPLES = {
  USER_ID: "123e4567-e89b-12d3-a456-426614174000",
  USER_ID_ALT: "987e4567-e89b-12d3-a456-426614174999",

  GROUP_ID: "456e4567-e89b-12d3-a456-426614174111",
  GROUP_ID_ALT: "789e4567-e89b-12d3-a456-426614174222",

  POST_ID: "321e4567-e89b-12d3-a456-426614174333",

  COMMENT_ID: "654e4567-e89b-12d3-a456-426614174444",

  PROFILE_ID: "789e4567-e89b-12d3-a456-426614174222",

  TIMESTAMP: "2025-12-14T10:30:00.000Z",
  TIMESTAMP_ALT: "2025-12-14T15:45:00.000Z",

  GROUP_NAME_TYPESCRIPT: "TypeScript",
  GROUP_NAME_RUST: "Rust",
  GROUP_NAME_GO: "GO",
  GROUP_NAME_JAVA: "Java",

  USER_NAME: "John Doe",
  USER_NAME_ALT: "Jane Doe",

  USER_EMAIL: "john.doe@example.com",
  USER_EMAIL_ALT: "jane.doe@example.com",
} as const;

export const generatePathExample = (
  basePath: string,
  ...ids: string[]
): string => {
  return `${basePath}/${ids.join("/")}`;
};
