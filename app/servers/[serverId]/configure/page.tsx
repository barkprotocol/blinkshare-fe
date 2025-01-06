"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyIcon, SquareArrowOutUpRight } from "lucide-react";
import { useWalletActions } from "@/hooks/use-wallet-actions";
import { DiscordRole, RoleData } from "@/lib/types/index";
import {
  MotionCard,
  MotionCardContent,
  MotionInput,
  MotionButton,
} from "@/components/motion";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { toast } from "sonner";
import { defaultSchema, ServerFormData, serverFormSchema } from "@/lib/zod-validation/server-form-data";
import OverlaySpinner from "@/components/ui/overlay-spinner";
import { ServerFormEdit } from "@/components/form/edit-guild";
import { useWallet } from "@solana/wallet-adapter-react";
import { z } from "zod";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Subscriptions from "./subscriptions";

export default function ConfigureServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const serverIdStr = Array.isArray(serverId) ? serverId[0] : serverId;
  const { signMessage, promptConnectWallet } = useWalletActions();
  const [guildName, setGuildName] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [roleData, setRoleData] = useState<RoleData>({ blinkShareRolePosition: -1, roles: [] });
  const [customUrl, setCustomUrl] = useState("");
  const wallet = useWallet();

  const [formData, setFormData] = useState<ServerFormData>({ ...defaultSchema, id: serverId });
  const [channels, setChannels] = useState<{ name: string; id: string }[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ServerFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [guildFound, setGuildFound] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const token = useUserStore((state) => state.token) || localStorage.getItem("discordToken");

  useEffect(() => {
    const fetchGuildData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const { guild } = await response.json();
          setFormData({ ...guild });
          setGuildName(guild.name);

          const allRoles = await fetchRoles(serverIdStr);
          const mergedRoles = allRoles.roles.map((role) => {
            const selectedRole = guild.roles.find((r: { id: string; }) => r.id === role.id);
            return selectedRole ? { ...role, price: selectedRole.amount, enabled: true } : role;
          });
          setRoleData({ ...allRoles, roles: mergedRoles });

          setGuildFound(true);
          setCustomUrl(`${window.location.origin}/${guild.id}`);
        } else {
          setGuildFound(false);
        }

        const channelsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}/channels`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (channelsResponse.ok) {
          const channels = await channelsResponse.json();
          setChannels(channels);
        }
      } catch (error) {
        console.error("Error fetching guild data", error);
        setGuildFound(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (serverIdStr) fetchGuildData();
  }, [serverIdStr, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setErrorOccurred(false);

    try {
      await promptConnectWallet();

      const validatedFormData = serverFormSchema.parse(formData);
      const message = `Confirm updating Blink for ${guildName}`;
      const signature = await signMessage(message);

      if (signature) {
        const payload = {
          data: {
            ...validatedFormData,
            roles: roleData.roles.filter((role) => role.enabled).map((role) => ({
              id: role.id,
              name: role.name,
              amount: role.price.toString(),
            })),
          },
          address: wallet.publicKey,
          message,
          signature,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success("Blink data updated successfully");
          setFormData(await response.json());
        } else {
          toast.error("Error updating server");
          setErrorOccurred(true);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ServerFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length) {
            const field = err.path[0];
            if (typeof field === "string" && field in formData) {
              errors[field as keyof ServerFormData] = err.message;
            }
          }
        });
        setFormErrors(errors);
        toast.error(`Form errors: ${Object.values(errors).join("\n")}`);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setOverlayVisible(false);
    }
  };

  const copyCustomUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast("URL Copied!");
  };

  const openCustomUrl = () => {
    window.open(customUrl, "_blank");
  };

  if (isLoading) return <OverlaySpinner />;

  if (!guildFound) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">No BlinkShare Server Found</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-gray-600 text-center max-w-md">No servers found. Please configure one.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/servers")}>Back to Servers</Button>
          </CardFooter>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.h1 className="text-3xl font-bold ml-3">Configure Blink for {guildName}</motion.h1>
      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList className="flex justify-center space-x-4 pb-4">
          <Tab className={`px-4 py-2 rounded border ${activeTab === 0 ? "bg-gray-400" : "bg-gray-200"}`}>
            Configure
          </Tab>
          <Tab className={`px-4 py-2 rounded border ${activeTab === 1 ? "bg-gray-400" : "bg-gray-200"}`}>
            My Subscriptions
          </Tab>
        </TabList>
        <TabPanel>
          <form onSubmit={handleSubmit}>
            {/* Configuration Form */}
          </form>
        </TabPanel>
        <TabPanel>
          <Subscriptions serverName={""} />
        </TabPanel>
      </Tabs>
    </motion.div>
  );
}
