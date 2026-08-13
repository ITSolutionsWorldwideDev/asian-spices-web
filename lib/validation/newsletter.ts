import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  privacyConsent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Please accept the Privacy Policy to subscribe",
    }),
  wantsAppLaunchNotice: z.boolean().optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
