import { SetMetadata } from "@nestjs/common";

/**
 * Decorator to specify which body field contains the owner ID
 * Used with BodyOwnershipGuard
 *
 * @param fieldName - The name of the field in request body
 *
 * @example
 * @Post()
 * @UseGuards(AuthGuard, BodyOwnershipGuard)
 * @OwnerField('authorId')
 * async create(@Body() dto: CreateCommentDto) { ... }
 */
export const OwnerField = (fieldName: string) =>
  SetMetadata("ownerField", fieldName);
