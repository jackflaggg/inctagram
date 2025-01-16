import { z } from 'zod';

const PasswordRecoveryRequestSchema = z.object({
    email: z.string().email(),
});

export namespace PasswordRecoveryCommand {
    export const RequestSchema = PasswordRecoveryRequestSchema;
    export type Request = z.infer<typeof RequestSchema>;
}