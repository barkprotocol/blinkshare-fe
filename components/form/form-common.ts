import { ServerFormProps } from "@/lib/types";
import { RoleData, Role } from "@/lib/types/discord-role";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

export const handleInputChange = (
  field: keyof ServerFormProps["formData"],
  value: any,
  setFormData: React.Dispatch<React.SetStateAction<ServerFormProps["formData"]>>
) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>,
  setFormData: React.Dispatch<React.SetStateAction<ServerFormProps["formData"]>>,
  setRoleErrors: React.Dispatch<SetStateAction<{ [key: string]: boolean }>>
) => {
  const role = roleData.roles.find((role: Role) => role.id === roleId);

  if (!role) return;

  if (roleData.blinkShareRolePosition <= (role.position || 0)) {
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    return;
  }

  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));

  const updatedRoles = roleData.roles.map((r: Role) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((r: Role) => r.enabled)
    .map((r: Role) => ({
      id: r.id,
      name: r.name,
      amount: r.price,
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
};

export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>,
  setFormData: React.Dispatch<React.SetStateAction<ServerFormProps["formData"]>>
) => {
  const updatedRoles = roleData.roles.map((role: Role) =>
    role.id === roleId ? { ...role, price } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((role: Role) => role.enabled)
    .map((role: Role) => ({
      id: role.id,
      name: role.name,
      amount: price,
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
};

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
    const mergedRoles = allRoles.roles.map((role: Role) => {
      const selectedRole = roleData.roles.find((r: Role) => r.id === role.id);
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
