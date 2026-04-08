'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { BlinkCard } from "@/components/blink/blink-card"
import { AddBlinkCard } from "@/components/blink/add-blink-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, 
  RefreshCw, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  MousePointerClick,
  Wallet,
  BarChart3,
  Grid3X3,
  List,
  Settings,
  ExternalLink
} from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"

interface Blink {
  id: string
  title: string
  description: string
  icon: string
  wallet: string
  mint: string
  created_at: string
  views?: number
  clicks?: number
  earnings?: number
}

interface Analytics {
  totalViews: number
  totalClicks: number
  totalEarnings: number
  conversionRate: number
}

export default function MyBlinksPage() {
  const { publicKey, connected } = useWallet()
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

  // Mock analytics data
  const [analytics, setAnalytics] = useState<Analytics>({
    totalViews: 0,
    totalClicks: 0,
    totalEarnings: 0,
    conversionRate: 0
  })

  const fetchBlinks = useCallback(async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/actions/get-blinks?wallet=${publicKey.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      const fetchedBlinks = data.blinks || []
      setBlinks(fetchedBlinks)
      
      // Calculate analytics
      const totalViews = fetchedBlinks.reduce((sum: number, b: Blink) => sum + (b.views || 0), 0)
      const totalClicks = fetchedBlinks.reduce((sum: number, b: Blink) => sum + (b.clicks || 0), 0)
      const totalEarnings = fetchedBlinks.reduce((sum: number, b: Blink) => sum + (b.earnings || 0), 0)
      setAnalytics({
        totalViews,
        totalClicks,
        totalEarnings,
        conversionRate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0
      })
    } catch (error) {
      console.error("Error fetching blinks:", error)
      setError("Failed to fetch blinks. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to fetch blinks. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [publicKey, toast])

  useEffect(() => {
    if (connected && publicKey) {
      fetchBlinks()
    } else {
      setBlinks([])
      setLoading(false)
    }
  }, [connected, publicKey, fetchBlinks])

  const handleCreateBlink = () => {
    router.push("/blink-generator")
  }

  const handleEditBlink = (blinkId: string) => {
    router.push(`/blink-generator?edit=${blinkId}`)
  }

  const StatCard = ({ title, value, icon: Icon, suffix = "" }: { title: string, value: number, icon: any, suffix?: string }) => (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {value.toLocaleString()}{suffix}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              My <span className="text-gradient">Blinks</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your blinks performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchBlinks}
              disabled={loading || !connected}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreateBlink}>
              <Plus className="h-4 w-4 mr-2" />
              Create Blink
            </Button>
          </div>
        </div>

        {/* Not Connected State */}
        {!connected ? (
          <Card className="glass-card">
            <CardContent className="py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your Solana wallet to view and manage your blinks. Your blinks are tied to your wallet address.
              </p>
              <WalletButton />
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="space-y-6">
            {/* Loading Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            {/* Loading Blinks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        ) : error ? (
          <Card className="glass-card">
            <CardContent className="py-16 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchBlinks}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Blinks" value={blinks.length} icon={Sparkles} />
              <StatCard title="Total Views" value={analytics.totalViews} icon={Eye} />
              <StatCard title="Total Clicks" value={analytics.totalClicks} icon={MousePointerClick} />
              <StatCard title="Conversion Rate" value={analytics.conversionRate} icon={TrendingUp} suffix="%" />
            </div>

            {/* Tabs and View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">
                    All Blinks
                    <Badge variant="secondary" className="ml-2">{blinks.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-2">
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

            {/* Blinks Grid */}
            {blinks.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {blinks.map((blink) => (
                  <Card 
                    key={blink.id} 
                    className={`glass-card group hover:border-primary/50 transition-all duration-300 ${
                      viewMode === "list" ? "flex items-center" : ""
                    }`}
                  >
                    <CardHeader className={viewMode === "list" ? "flex-1 py-4" : ""}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {blink.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {blink.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className={viewMode === "list" ? "py-4" : ""}>
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {(blink.views || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="h-4 w-4" />
                          {(blink.clicks || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditBlink(blink.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/blinks/${blink.id}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/analytics/${blink.id}`)}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add New Blink Card */}
                <Card 
                  className="glass-card border-dashed hover:border-primary/50 cursor-pointer transition-all duration-300 flex items-center justify-center min-h-[200px]"
                  onClick={handleCreateBlink}
                >
                  <CardContent className="text-center py-8">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-7 w-7 text-primary" />
                    </div>
                    <p className="font-medium">Create New Blink</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start building your next blink
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-16 text-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">No Blinks Yet</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven&apos;t created any blinks yet. Start by creating your first blink using our generator.
                  </p>
                  <Button onClick={handleCreateBlink} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Blink
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Floating Create Button */}
      {connected && (
        <Button
          onClick={handleCreateBlink}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg glow z-40"
          size="icon"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create New Blink</span>
        </Button>
      )}
    </div>
  )
}
