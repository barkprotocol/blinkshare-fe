'use client';

import React, { useEffect, useState, useCallback } from "react";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { Button } from "@/components/ui/button";
import { InfoIcon, Plus, RefreshCw, ImageIcon } from 'lucide-react';
import OverlaySpinner from "@/components/ui/overlay-spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Blink {
  id: string;
  name: string;
  description: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const onConnect = async (owner: boolean) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/login${owner ? "?owner=true" : ""}`,
      { 
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      }
    );
    if (!response.ok) {
      throw new Error("Failed to initiate Discord connection");
    }
    const data = await response.json();
    if (data.url) {
      const url = new URL(data.url);
      if (!owner) url.searchParams.append("state", "marketplace");
      window.location.href = url.toString();
    } else {
      throw new Error("No URL returned from login endpoint");
    }
  } catch (error) {
    console.error("Failed to connect Discord", error);
    toast.error("Discord connection failed. Please try again.");
  }
};

const BlinkMarketplaceComponent = () => {
  const [blinks, setBlinks] = useState<Blink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>("https://ucarecdn.com/92d4d7ea-f9d8-429c-bf68-6f3bc69c1c02/goldenshoppingcart.jpg");
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";

  const fetchBlinks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/discord/guilds`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBlinks(data);
    } catch (error) {
      setError("Failed to fetch blinks. Please try again.");
      console.error("Failed to fetch blinks", error);
      setBlinks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlinks();
  }, [fetchBlinks]);

  useEffect(() => {
    if (!code) return;

    const state = localStorage.getItem("state");
    if (state === "marketplace") return;

    const params = new URLSearchParams(window.location.search);
    params.delete("code");
    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [code, router]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundImage(e.target.value);
  };

  if (isLoading) return <OverlaySpinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <div className="flex-grow relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
          aria-hidden="true"
        ></div>
        <section className="py-16 relative">
          <div className="container mx-auto px-6 sm:px-12 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 mt-16">
              <span className="font-bold">Blink</span><span className="font-light">Share</span> Marketplace
            </h1>
            <p className="text-xl mb-8">Discover {blinks.length} unique blinks</p>

            <div className="mb-8">
              <Label htmlFor="backgroundImage" className="flex items-center justify-center mb-2">
                <ImageIcon className="mr-2" />
                Change Background Image
              </Label>
              <Input
                id="backgroundImage"
                type="url"
                placeholder="Enter image URL"
                value={backgroundImage}
                onChange={handleBackgroundChange}
                className="max-w-md mx-auto"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mb-8">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button onClick={fetchBlinks} variant="outline" className="mt-4">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </Alert>
            )}

            {!code && !error && (
              <div className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-6">
                <Alert className="w-full sm:w-2/3 lg:w-1/2 mx-auto text-center bg-white text-gray-900 p-6 rounded-lg shadow-lg">
                  <div className="flex flex-col items-center">
                    <AlertTitle className="text-xl font-semibold flex items-center mb-4">
                      <InfoIcon className="h-8 w-8 mr-3 text-gray-900" />
                      Discord Connection Required
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-base text-gray-600">
                      BlinkShare requires you to connect your Discord in order to assign you the purchased roles.
                    </AlertDescription>
                    <Button
                      onClick={() => onConnect(false)}
                      className="mt-6 w-64 py-3 px-6 rounded-md bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
                    >
                      <Image
                        className="mr-3 h-6 w-6"
                        src="https://ucarecdn.com/0da96123-0acb-43a5-b3d8-571629377d1b/discord.png"
                        alt="Discord Logo"
                        width={24}
                        height={24}
                      />
                      Connect Discord
                    </Button>
                  </div>
                </Alert>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blinks.length > 0 ? (
                blinks.map((blink) => (
                  <div key={blink.id} className="mb-8 break-inside-avoid bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
                    <BlinkDisplay serverId={blink.id} code={code} />
                  </div>
                ))
              ) : (
                <p className="text-2xl text-gray-600 col-span-full">No blinks available at the moment.</p>
              )}
            </div>
          </div>

          <Button
            onClick={() => onConnect(true)}
            className="fixed h-16 w-16 sm:h-auto sm:w-auto bottom-16 right-8 sm:bottom-16 sm:right-12 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-md flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 z-20"
          >
            <Plus className="h-7 w-7 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:block text-lg">Add a Blink</span>
            <span className="sr-only">Add a new Blink</span>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default function BlinkMarketplace() {
  return (
    <React.Suspense fallback={<OverlaySpinner />}>
      <BlinkMarketplaceComponent />
    </React.Suspense>
  );
}

