import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
