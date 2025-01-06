import { RoleData, ServerFormProps, Role } from "@/lib/types";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

// Handle toggling of Discord roles
export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>,
  setRoleErrors: Dispatch<SetStateAction<Record<string, boolean>>>
) => {
  const role = roleData.roles.find((role: { id: string; }) => role.id === roleId);

  if (!role) return;

  // Ensure the role can only be toggled if it has a lower position than the "blinkShare" role
  const rolePosition = role.position ?? -1; // Use -1 or a fallback value if position is undefined
  if (roleData.blinkShareRolePosition <= rolePosition) {
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    toast.error("This role cannot be toggled as it has a higher position than the 'blinkShare' role.");
    return;
  }

  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));

  // Update role enabled state
  const updatedRoles = roleData.roles.map((r: { id: string; enabled: any; }) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((r: { enabled: any; }) => r.enabled)
    .map((r: { id: any; name: any; price: any; }) => ({
      id: r.id,
      name: r.name,
      amount: r.price ?? "0",
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
};

// Handle price changes for Discord roles
export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>,
  setRoleErrors: Dispatch<SetStateAction<Record<string, boolean>>>
) => {
  const updatedRoles = roleData.roles.map((role: { id: string; }) =>
    role.id === roleId ? { ...role, price: price ?? "0" } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((role: { enabled: any; }) => role.enabled)
    .map((role: { id: any; name: any; }) => ({
      id: role.id,
      name: role.name,
      amount: price ?? "0", // Default to "0" if price is undefined
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
};

// Fetch and refresh Discord roles
export const refreshRoles = async (
  formDataId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setIsRefreshingRoles: Dispatch<SetStateAction<boolean>>,
  setRoleErrors: Dispatch<SetStateAction<Record<string, boolean>>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>> // Optional loading state to indicate fetch progress
) => {
  setIsRefreshingRoles(true);
  setErrorMessage(""); // Clear any previous error message
  setLoading(true); // Set loading state to true before fetching

  try {
    const allRoles = await fetchRoles(formDataId);
    
    if (!allRoles || !allRoles.roles) {
      throw new Error("Invalid response from server. Missing 'roles' data.");
    }

    // Merge roles to keep custom values like price and enabled state
    const mergedRoles: Role[] = allRoles.roles.map((role) => {
      const selectedRole = roleData.roles.find((r: { id: any; }) => r.id === role.id);
      return selectedRole
        ? { ...role, price: selectedRole.price, enabled: selectedRole.enabled }
        : role;
    });

    // Ensure the updated role data contains the correct `blinkShareRolePosition`
    setRoleData((prev: any) => ({
      ...prev,
      roles: mergedRoles, // Ensure we use `Role[]` type for roles
      blinkShareRolePosition: roleData.blinkShareRolePosition ?? -1, // Provide a fallback for undefined position
    }));

    setRoleErrors({}); // Reset any role-specific errors
    toast.success("Roles refreshed successfully");
  } catch (error) {
    console.error("Error refreshing roles", error);

    const errorMessage = (error as Error).message ?? "Failed to refresh roles.";
    setErrorMessage(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsRefreshingRoles(false);
    setLoading(false); // Reset loading state after fetching
  }
};
