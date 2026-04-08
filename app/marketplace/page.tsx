'use client';

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Filter,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import OverlaySpinner from "@/components/ui/overlay-spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface Blink {
  id: string;
  name: string;
  description: string;
  category?: string;
  price?: number;
  trending?: boolean;
  new?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const categories = [
  { id: "all", label: "All Categories" },
  { id: "defi", label: "DeFi" },
  { id: "nft", label: "NFT" },
  { id: "gaming", label: "Gaming" },
  { id: "social", label: "Social" },
  { id: "utility", label: "Utility" },
];

const sortOptions = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "newest", label: "Newest", icon: Clock },
  { id: "popular", label: "Most Popular", icon: Sparkles },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  const filteredBlinks = useMemo(() => {
    let result = [...blinks];
    
    // Filter by search
    if (searchQuery) {
      result = result.filter(
        blink => 
          blink.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blink.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(blink => blink.category === selectedCategory);
    }
    
    return result;
  }, [blinks, searchQuery, selectedCategory]);

  const featuredBlinks = useMemo(() => {
    return blinks.slice(0, 3);
  }, [blinks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              {blinks.length} Blinks Available
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              <span className="text-gradient">Blink</span>Share Marketplace
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover and collect unique blinks from creators around the world
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search blinks by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-xl border-border/50 bg-card/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort by
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={sortBy === option.id ? "bg-muted" : ""}
                    >
                      <option.icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none h-9 w-9"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none h-9 w-9"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discord Connection Alert */}
      {!code && !error && (
        <section className="container mx-auto px-4 mb-12">
          <Card className="glass-card border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaDiscord className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-2">Connect Discord to Purchase</h3>
                  <p className="text-muted-foreground">
                    BlinkShare requires Discord connection to assign purchased roles to your account.
                  </p>
                </div>
                <Button
                  onClick={() => onConnect(false)}
                  size="lg"
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                >
                  <Image
                    src="https://ucarecdn.com/0da96123-0acb-43a5-b3d8-571629377d1b/discord.png"
                    alt="Discord"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Connect Discord
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="container mx-auto px-4 mb-12">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button onClick={fetchBlinks} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </section>
      )}

      {/* Featured Blinks */}
      {featuredBlinks.length > 0 && (
        <section className="container mx-auto px-4 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold">Featured Blinks</h2>
              <p className="text-muted-foreground">Handpicked by our team</p>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending Now
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlinks.map((blink) => (
              <Card key={blink.id} className="glass-card overflow-hidden group hover:border-primary/50 transition-all duration-300 glow">
                <CardContent className="p-6">
                  <BlinkDisplay serverId={blink.id} code={code} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Blinks */}
      <section className="container mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold">All Blinks</h2>
            <p className="text-muted-foreground">{filteredBlinks.length} results</p>
          </div>
        </div>
        
        {filteredBlinks.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredBlinks.map((blink) => (
              <Card 
                key={blink.id} 
                className={`glass-card overflow-hidden group hover:border-primary/50 transition-all duration-300 ${
                  viewMode === "list" ? "flex items-center" : ""
                }`}
              >
                <CardContent className={viewMode === "list" ? "p-4 flex-1" : "p-6"}>
                  <BlinkDisplay serverId={blink.id} code={code} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="py-16 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Blinks Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try adjusting your search or filters"
                  : "Be the first to create a blink!"
                }
              </p>
              <Button onClick={() => onConnect(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create a Blink
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Floating Add Button */}
      <Button
        onClick={() => onConnect(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg glow z-40"
        size="icon"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add a new Blink</span>
      </Button>
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
