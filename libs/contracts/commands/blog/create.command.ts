import { z } from 'zod';
import { nameConstraints } from '../../constants/blog/blog-property.constraints';
import { BlogModels } from '../../models/blog/blog.models';

const BlogCreateRequestSchema = z.object({
    name: z.string().min(nameConstraints.minLength).max(nameConstraints.maxLength),
    description: z.string(),
    websiteUrl: z.string().url('Invalid URL'),
});

const BlogCreateResponseSchema = BlogModels.omit({ deletionStatus: true });

export namespace BlogCreateCommand {
    export const RequestSchema = BlogCreateRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = BlogCreateResponseSchema;
    export type Response = z.infer<typeof ResponseSchema>;
}