import { RoleData, ServerFormProps } from "@/lib/types";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

// Utility type for generic form data
type SetFormData<T> = Dispatch<SetStateAction<T>>;

// Utility function to handle input changes in form fields
export const handleInputChange = (
  field: keyof ServerFormProps["formData"],
  value: any,
  setFormData: SetFormData<ServerFormProps["formData"]>
) => {
  setFormData((prev: any) => ({ ...prev, [field]: value }));
};

// Handle toggling the status of a Discord role
export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: SetFormData<ServerFormProps["formData"]>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>
) => {
  const role = roleData.roles.find((role) => role.id === roleId);

  if (!role) return;

  // Check for proper role hierarchy before enabling/disabling
  if (roleData.blinkShareRolePosition <= (role.position || 0)) {
    console.log(role.position, roleData.blinkShareRolePosition);
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    return;
  }

  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));

  const updatedRoles = roleData.roles.map((r) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  // Filter enabled roles and update form data
  const enabledRoles = updatedRoles
    .filter((r) => r.enabled)
    .map((r) => ({
      id: r.id,
      name: r.name,
      amount: r.price,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

// Handle price change for a specific Discord role
export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: SetFormData<ServerFormProps["formData"]>
) => {
  const updatedRoles = roleData.roles.map((role) =>
    role.id === roleId ? { ...role, price } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((role) => role.enabled)
    .map((role) => ({
      id: role.id,
      name: role.name,
      amount: price,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

// Refresh the roles list by fetching from an external API
export const refreshRoles = async (
  formDataId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setIsRefreshingRoles: Dispatch<SetStateAction<boolean>>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>
) => {
  setIsRefreshingRoles(true);
  try {
    const allRoles = await fetchRoles(formDataId);
    const mergedRoles = allRoles.roles.map((role) => {
      const selectedRole = roleData.roles.find((r) => r.id === role.id);
      return selectedRole
        ? { ...role, price: selectedRole.price, enabled: selectedRole.enabled }
        : role;
    });
    setRoleData({ ...allRoles, roles: mergedRoles });
    setRoleErrors({});
    toast.success("Roles refreshed successfully");
  } catch (error) {
    console.error("Error refreshing roles", error);
    toast.error("Failed to refresh roles");
  } finally {
    setIsRefreshingRoles(false);
  }
};
