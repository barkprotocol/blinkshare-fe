"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useWindowSize } from "@/hooks/use-window-size";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

export default function BlinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { serverId } = useParams<{ serverId: string }>();
  const code = searchParams.get("code") || "";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!/^\d{17,49}$/.test(serverId)) {
      router.push("/not-found");
    }
  }, [serverId, router]);

  const authenticateUser = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate authentication");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = `${data.url}&state=${serverId}`;
      } else {
        throw new Error("No authentication URL returned");
      }
    } catch (error) {
      console.error("Failed to connect to Discord", error);
      setErrorMessage("An error occurred while trying to authenticate. Please try again later.");
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!code) return;

    const guildId = localStorage.getItem("state");

    if (guildId === serverId) {
      setIsAuthenticated(true);
      toast.success("Successfully authenticated with Discord!");
    } else {
      const params = new URLSearchParams(window.location.search);
      params.delete("code");
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  }, [code, serverId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container max-w-full space-y-12 mt-12 px-4"
      >
        <LeftSection
          isAuthenticated={isAuthenticated}
          code={code}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onConnect={authenticateUser}
        />
        <ServerDetails serverId={serverId} code={code} />
      </motion.div>
    </div>
  );
}

const LeftSection: React.FC<LeftSectionProps> = ({
  isAuthenticated,
  code,
  isLoading,
  errorMessage,
  onConnect,
}) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="w-full flex justify-center"
  >
    <Card className="bg-white text-black shadow-none rounded-lg p-4 max-w-xl w-full">
      <Image
        src="https://ucarecdn.com/da05dab1-4b12-4c26-bf53-3b1e326bb1df/Frame136.png"
        alt="Placeholder"
        width={800}
        height={400}
        className="w-full h-56 sm:h-80 object-cover rounded-t-lg"
      />
      <WelcomeText />
      <CardContent>
        <ul className="space-y-3 text-lg">
          <li className="flex items-center">
            <span className="mr-3 text-gray-500">🔒</span> Connect with Discord effortlessly
          </li>
          <li className="flex items-center">
            <span className="mr-3 text-gray-500">🌟</span> Unlock exclusive server features
          </li>
          <li className="flex items-center">
            <span className="mr-3 text-gray-500">🔧</span> Manage server roles seamlessly
          </li>
        </ul>
      </CardContent>
      <CardContent className="text-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <Button
            onClick={onConnect}
            className="w-full sm:w-75 h-10 bg-gray-950 hover:bg-black text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          >
            Connect Discord
          </Button>
        )}
      </CardContent>
      {errorMessage && (
        <p className="mt-4 text-center text-red-500 text-sm">{errorMessage}</p>
      )}
    </Card>
  </motion.div>
);

const ServerDetails: React.FC<RightSectionProps> = ({ serverId, code }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="w-full flex justify-center"
  >
    <Card className="bg-white text-black shadow-none rounded-lg p-4 max-w-xl w-full">
      <CardContent>
        <h3 className="text-xl font-semibold mb-6">Server Details</h3>
        <p><strong>Server ID:</strong> {serverId}</p>
        <p><strong>Code:</strong> {code || "N/A"}</p>
        <BlinkDisplay serverId={serverId} code={code} />
      </CardContent>
    </Card>
  </motion.div>
);

const WelcomeText = () => (
  <CardHeader>
    <CardTitle className="text-3xl font-extrabold text-black text-center mb-2">
      Welcome to BlinkShare
    </CardTitle>
    <CardDescription className="text-center text-gray-500">
      Unlock exclusive content and features on your favorite Discord servers!
    </CardDescription>
  </CardHeader>
);
