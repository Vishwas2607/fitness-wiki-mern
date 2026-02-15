import { registerSchema, type loginSchema } from "../../../lib/schemas/auth.validator";
import {z} from "zod";

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchemaExtended = registerSchema.extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
})
.refine((data)=> data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterPostDataType = z.infer<typeof registerSchema>;
export type RegisterFormValues = z.infer<typeof registerSchemaExtended>;