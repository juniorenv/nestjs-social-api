import { SetMetadata } from "@nestjs/common";

/**
 * Decorator to specify resource type for ResourceOwnershipGuard
 *
 * @param type - The type of resource ('post' or 'comment')
 *
 * @example
 * @Patch(':postId')
 * @UseGuards(AuthGuard, ResourceOwnershipGuard)
 * @ResourceType('post')
 * async update(@Param('postId') postId: string) { ... }
 */
export const ResourceType = (type: "post" | "comment") =>
  SetMetadata("resourceType", type);
