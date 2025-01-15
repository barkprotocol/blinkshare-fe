import { z } from "zod";

// Default values for the server form
export const defaultSchema = {
  id: "",
  name: "",
  iconUrl: "",
  description: "",
  address: "",
  website: null,
  roles: [],
  useUsdc: true,
  limitedTimeRoles: false,
  limitedTimeQuantity: "1",
  limitedTimeUnit: "Months",
  notificationChannelId: "",
};

// Zod schema for validating the server form data
export const serverFormSchema = z
  .object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Blink title is required").max(100, "Blink title must be 100 characters or less"),
    iconUrl: z
      .string()
      .min(3, "Image URL is required")
      .url("Invalid URL. Please enter a valid URL."),
    description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
    address: z.string().min(1, "Address is required"),
    website: z
      .string()
      .url("Invalid URL. Please enter a valid URL.")
      .nullable()
      .optional(),
    roles: z
      .array(
        z.object({
          id: z.string().min(1, "Role ID is required"),
          name: z.string().min(1, "Role name is required").max(100, "Role name must be 100 characters or less"),
          amount: z
            .string()
            .refine((val) => /^\d*\.?\d+$/.test(val) && parseFloat(val) > 0, {
              message: "Amount must be a valid number or decimal greater than 0",
            })
            .transform((val) => parseFloat(val)), // Transform amount to a number
        })
      )
      .min(1, "At least one role is required"),
    useUsdc: z.boolean().default(false),
    limitedTimeRoles: z.boolean().default(false),
    limitedTimeQuantity: z
      .string()
      .default("1")
      .refine(
        (val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0,
        { message: "Quantity must be a positive number" }
      )
      .transform((val) => parseInt(val, 10).toString()),
    limitedTimeUnit: z
      .enum(["Hours", "Days", "Weeks", "Months"], {
        errorMap: () => ({ message: "Invalid time unit. Must be Hours, Days, Weeks, or Months" }),
      })
      .default("Months"),
    notificationChannelId: z.string().optional(),
  })
  .default(defaultSchema);

// Type inference based on the schema
export type ServerFormData = z.infer<typeof serverFormSchema>;

// Helper function to format validation errors
export function formatErrors(error: z.ZodError): Record<string, string[]> {
  return error.errors.reduce((acc, curr) => {
    const path = curr.path.join(".");
    acc[path] = acc[path] || [];
    acc[path].push(curr.message);
    return acc;
  }, {} as Record<string, string[]>);
}

// Function to validate form data
export function validateServerForm(formData: unknown): { success: boolean; data?: ServerFormData; errors?: Record<string, string[]> } {
  const validationResult = serverFormSchema.safeParse(formData);

  if (validationResult.success) {
    return { success: true, data: validationResult.data };
  } else {
    return { success: false, errors: formatErrors(validationResult.error) };
  }
}

// Example usage of validation and type checking
const exampleFormData = {
  id: "server123",
  name: "My Discord Server",
  iconUrl: "https://example.com/icon.png",
  description: "A description of the server",
  address: "1234 Server St.",
  website: "https://mywebsite.com",
  roles: [
    {
      id: "admin",
      name: "Administrator",
      amount: "100",
    },
  ],
  useUsdc: true,
  limitedTimeRoles: true,
  limitedTimeQuantity: "12",
  limitedTimeUnit: "Months",
  notificationChannelId: "notification-channel-id",
};

const validationResult = validateServerForm(exampleFormData);

if (validationResult.success) {
  console.log("Form data is valid", validationResult.data);
} else {
  console.error("Validation failed", validationResult.errors);
}

