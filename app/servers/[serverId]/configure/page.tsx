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
import { fetchRoles } from "@/lib/actions/discord-actions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MySubscriptions from "./subscriptions";

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useStateRef } from "@/hooks/use-state-ref";

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

  const [formData, setFormData] = useState<ServerFormData>(() => ({ ...defaultSchema, id: serverId }));
  const [channels, setChannels] = useState<{ name: string; id: string }[]>([]);

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ServerFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [guildFound, setGuildFound] = useState(false);
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("discordToken");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchGuildData = async () => {
      if (!token || !serverIdStr) return;

      try {
        setIsLoading(true);
        const [guildResponse, channelsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}/channels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (guildResponse.ok) {
          const { guild } = await guildResponse.json();
          if (guild) {
            setFormData({ ...guild });
            setGuildName(guild.name);

            const allRoles = await fetchRoles(serverIdStr);
            const mergedRoles = allRoles.roles.map((role: DiscordRole) => {
              const selectedRole = guild.roles.find((r: DiscordRole) => r.id === role.id);
              return selectedRole ? { ...role, price: selectedRole.amount, enabled: true } : role;
            });

            setRoleData({ ...allRoles, roles: mergedRoles });
            setGuildFound(true);
            setCustomUrl(`${window.location.origin}/${guild.id}`);
          } else {
            setGuildFound(false);
          }
        } else {
          setGuildFound(false);
        }

        if (channelsResponse.ok) {
          const channels = await channelsResponse.json();
          setChannels(channels);
        } else {
          console.error("Failed to fetch channels");
        }
      } catch (error) {
        console.error("Error fetching guild data", error);
        setGuildFound(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuildData();
  }, [serverIdStr, token]);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0); // Track the selected tab index

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setErrorOccurred(false);

    try {
      await promptConnectWallet();

      const validatedFormData = serverFormSchema.parse(formData);
      const message = `Confirm updating Blink for ${guildName}`;
      const signature = await signMessage(message);

      if (!signature) throw new Error("Failed to sign message");

      const payload = {
        data: {
          ...validatedFormData,
          roles: roleData.roles
            .filter((role) => role.enabled)
            .map((role) => ({
              id: role.id,
              name: role.name,
              amount: role.price ? role.price.toString() : "0", // Fallback if price is undefined
            })),
        },
        address: wallet.publicKey?.toString(),
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
        const guild = await response.json();
        setFormData(guild);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating server");
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
        toast.error(`Please fix the form errors: ${Object.values(errors).join("\n")}`);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setErrorOccurred(true);
    } finally {
      setIsLoading(false);
      setOverlayVisible(false);
    }
  };

  const copyCustomUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast("URL Copied!");
  };

  const openCustomUrl = () => {
    window.open(customUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return <OverlaySpinner />;
  }

  if (!guildFound) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              No <span className="highlight-cyan">BlinkShare</span> Servers Set Up
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-6 flex justify-center">
              <img
                src="/bark.png"
                alt="No BlinkShare Guild Selected"
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
            <p className="text-gray-600 text-center max-w-md">
              You haven't created Discord paid roles for your server{" "}
              <span className="font-semibold">{guildName}</span>. Please use the <strong>Discord Roles</strong> tab to enable roles.
            </p>
          </CardContent>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-8 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8"
      >
        Configure Blink for {guildName}
      </motion.h1>
      {overlayVisible && (
        <OverlaySpinner
          text="Submitting your blink configuration"
          error={errorOccurred}
        />
      )}
      <Tabs selectedIndex={selectedTabIndex} onSelect={(index) => setSelectedTabIndex(index)}>
        <TabList className="flex justify-center space-x-4 mb-8">
          <Tab className={`px-4 py-2 rounded cursor-pointer ${selectedTabIndex === 0 ? "bg-primary text-primary-foreground" : "bg-background"}`}>
            🔧 Configure
          </Tab>
          <Tab className={`px-4 py-2 rounded cursor-pointer ${selectedTabIndex === 1 ? "bg-primary text-primary-foreground" : "bg-background"}`}>
            📜 My Subscriptions
          </Tab>
        </TabList>

        <TabPanel>
          <form onSubmit={handleSubmit} className="space-y-8">
            <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <MotionCardContent>
                <h2 className="text-2xl font-semibold mb-4">Guild Information</h2>
                <div className="space-y-4">
                  <MotionInput
                    type="text"
                    label="Server Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </MotionCardContent>
            </MotionCard>

            <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <MotionCardContent>
                <h2 className="text-2xl font-semibold mb-4">Discord Roles</h2>
                <div className="space-y-4">
                  <ServerFormEdit
                    roles={roleData.roles}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </MotionCardContent>
            </MotionCard>

            <div className="mt-6 flex justify-between">
              <Button type="button" onClick={copyCustomUrl} className="bg-blue-500 text-white">
                Copy URL
              </Button>
              <Button type="submit" className="bg-primary text-white">
                Save Configuration
              </Button>
            </div>
          </form>
        </TabPanel>
        <TabPanel>
          <MySubscriptions serverName={""} />
        </TabPanel>
      </Tabs>
    </div>
  );
}
