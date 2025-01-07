import { z } from "zod";
import { DiscordServer } from "./discord-server";

// Default form data schema
export const defaultSchema = {
  id: "",
  name: "",
  iconUrl: "",
  description: "",
  address: "",
  website: "",
  roles: [],
  useUsdc: false,
  limitedTimeRoles: false,
  limitedTimeQuantity: "1",
  limitedTimeUnit: "Months",
  notificationChannelId: "",
};

// Zod schema for server form validation
export const serverFormSchema = z
  .object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Blink title is required"),
    iconUrl: z
      .string()
      .min(3, "Image URL is required")
      .refine(
        (url) => {
          try {
            new URL(url); // Check if URL is valid
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Invalid URL. Please enter a valid URL.",
        }
      ),
    description: z.string().min(1, "Description is required"),
    address: z.string().min(1, "Address is required"),
    website: z
      .string()
      .optional() // Allow the field to be optional
      .refine(
        (url) => {
          if (!url) return true; // Allow null or empty string
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i.test(url); // URL regex validation
        },
        {
          message: "Invalid URL. Please enter a valid URL.",
        }
      ),
    roles: z
      .array(
        z.object({
          id: z.string().min(1, "Role ID is required"),
          name: z.string().min(1, "Role name is required"),
          amount: z
            .string()
            .refine((val) => /^\d*\.?\d+$/.test(val) && parseFloat(val) > 0, {
              message: "Amount must be a valid number or decimal greater than 0",
            })
            .transform((val) => parseFloat(val).toString()), // Transform amount to string
        })
      )
      .min(1, "At least one role is required"),
    useUsdc: z.boolean().default(false),
    limitedTimeRoles: z.boolean().default(false),
    limitedTimeQuantity: z
      .string()
      .default("1")
      .transform((val) => parseInt(val, 10).toString()),
    limitedTimeUnit: z
      .string()
      .refine((val) => ["Hours", "Days", "Weeks", "Months"].includes(val), {
        message: "Invalid time unit. Choose one of: Hours, Days, Weeks, Months.",
      })
      .default("Months"),
    notificationChannelId: z
      .string()
      .optional() // Allow the field to be optional
      .refine(
        (value) => value === undefined || value.length > 0,
        "Notification channel ID is required if specified"
      ),
  })
  .default(defaultSchema);
