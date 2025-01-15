import { RoleData, ServerFormProps, Role } from "@/lib/types";
import { toast } from "sonner";

// Utility function to format a role price to a string with 2 decimal places
export const formatRolePrice = (price: string): string => {
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Error("Invalid price format");
  }
  return `$${parsedPrice.toFixed(2)}`;
};

// Utility function to check if a role is enabled by roleId in the role data
export const isRoleEnabled = (roleId: string, roleData: RoleData): boolean => {
  const role = roleData.roles.find((role) => role.id === roleId);
  return !!role?.enabled;
};

// Utility function to get the index of a role by its ID
export const getRoleIndex = (roleId: string, roleData: RoleData): number => {
  return roleData.roles.findIndex((role) => role.id === roleId);
};

// Utility function to merge server form data with role information, ensuring that role data is updated
export const mergeFormDataWithRoles = (
  formData: ServerFormProps["formData"],
  roleData: RoleData
): ServerFormProps["formData"] => {
  const mergedRoles = formData.roles.map((role) => {
    const roleInData = roleData.roles.find((r) => r.id === role.id);
    if (roleInData) {
      return { ...role, price: roleInData.price, enabled: roleInData.enabled };
    }
    return role;
  });

  return { ...formData, roles: mergedRoles };
};

// Utility function to show a toast notification (success or error)
export const showToastNotification = (message: string, type: "success" | "error" = "success"): void => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

// Utility function to reset form errors by clearing the errors state
export const resetFormErrors = (setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>): void => {
  setErrors({});
};

// Utility function to validate price format using a regular expression (allows up to 2 decimal places)
export const validatePriceFormat = (price: string): boolean => {
  const pricePattern = /^\d+(\.\d{1,2})?$/;
  return pricePattern.test(price);
};

// New utility function to update a specific role in the role data
export const updateRole = (roleData: RoleData, updatedRole: Role): RoleData => {
  const updatedRoles = roleData.roles.map((role) =>
    role.id === updatedRole.id ? { ...role, ...updatedRole } : role
  );
  return { ...roleData, roles: updatedRoles };
};

// New utility function to calculate total price of enabled roles
export const calculateTotalPrice = (roleData: RoleData): number => {
  return roleData.roles
    .filter((role) => role.enabled)
    .reduce((total, role) => total + parseFloat(role.price), 0);
};

// New utility function to sort roles by price
export const sortRolesByPrice = (roles: Role[], ascending: boolean = true): Role[] => {
  return [...roles].sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);
    return ascending ? priceA - priceB : priceB - priceA;
  });
};

