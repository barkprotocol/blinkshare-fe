import { useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { MotionInput, MotionCardContent } from "@/components/ui/motion-components";
import { Label, Button, SpinnerSvg, SaveIcon } from "@/components/ui";
import { useFormContext, FormProvider } from "./form-context";
import { motion } from "framer-motion";

// Lazy load components that are not critical for initial render
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then(mod => mod.WalletMultiButton),
  { ssr: false }
);

interface ServerFormProps {
  formData: any;
  setFormData: (data: any) => void;
  roleData: any;
  setRoleData: (data: any) => void;
  formErrors: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  channels: any[];
}

export function ServerForm({
  formData,
  setFormData,
  roleData,
  setRoleData,
  formErrors,
  onSubmit,
  isLoading,
  channels,
}: ServerFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { roleErrors, isRefreshingRoles, setIsRefreshingRoles } = useFormContext();

  // Handle form submission
  const onSubmitHandler = (data: any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 flex-col">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="name">Blink Title</Label>
            <MotionInput
              id="name"
              placeholder="Enter a title for your blink"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              {...register("name", { required: "Title is required" })}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
                aria-live="assertive"
                aria-invalid="true"
              >
                {errors.name.message}
              </motion.p>
            )}
          </MotionCardContent>

          {/* Additional form fields (example for email) */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="email">Email</Label>
            <MotionInput
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              {...register("email", { required: "Email is required" })}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
                aria-live="assertive"
                aria-invalid="true"
              >
                {errors.email.message}
              </motion.p>
            )}
          </MotionCardContent>
        </div>

        {/* Wallet Button Section */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <WalletMultiButton />
          </motion.div>
        </div>
      </div>

      {/* Refresh roles section */}
      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={async () => {
            setIsRefreshingRoles(true);
            await refreshRoles();
            setIsRefreshingRoles(false);
          }}
          disabled={isRefreshingRoles}
          className="bg-white text-black p-2 rounded-md"
        >
          {isRefreshingRoles ? (
            <SpinnerSvg />
          ) : (
            "Refresh Roles"
          )}
        </Button>

        {/* Additional functionality for roles */}
        {roleErrors && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 mt-2"
            aria-live="assertive"
          >
            {roleErrors}
          </motion.p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        type="submit"
        disabled={isLoading}
        className="bg-gray-950 text-white px-6 py-3 rounded-md font-medium w-full flex items-center justify-center disabled:bg-gray-400"
      >
        {isLoading ? (
          <SpinnerSvg />
        ) : (
          <>
            <SaveIcon size={16} />
            <span className="ml-2">Save Changes</span>
          </>
        )}
      </motion.button>
    </form>
  );
}

// Wrapper to provide global form context
export function ServerFormWrapper(props: ServerFormProps) {
  return (
    <FormProvider>
      <ServerForm {...props} />
    </FormProvider>
  );
}
