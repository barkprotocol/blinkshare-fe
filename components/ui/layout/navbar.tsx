'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/ui/wallet-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Store, Sparkles, Settings, Menu, X, Moon, Sun, User, LogOut } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/marketplace", icon: Store, label: "Marketplace" },
  { href: "/my-blinks", icon: Sparkles, label: "My Blinks" },
  { href: "/services", icon: Settings, label: "Services" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Get user session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className={`w-full py-4 px-6 fixed top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-lg border-b border-border/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
              alt="BlinkShare Logo"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">
            Blink<span className="text-primary">Share</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          <Link 
            href="https://discord.gg/invite/CjUeKEB7b6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <FaDiscord className="h-4 w-4" />
            <span className="text-sm font-medium">Discord</span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* Wallet Button */}
          <WalletButton />

          {/* User Menu or Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-blinks" className="cursor-pointer">
                    <Sparkles className="mr-2 h-4 w-4" />
                    My Blinks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-lg hover:bg-muted/50 text-foreground transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border"
          >
            <nav className="container mx-auto py-4 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted/50 transition-colors"
                  onClick={closeMenu}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <Link 
                href="https://discord.gg/invite/CjUeKEB7b6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted/50 transition-colors"
                onClick={closeMenu}
              >
                <FaDiscord className="h-5 w-5 text-primary" />
                <span className="font-medium">Discord</span>
              </Link>
              
              <div className="pt-4 px-4 space-y-3 border-t border-border mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  {mounted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                      {theme === 'dark' ? (
                        <><Sun className="h-4 w-4 mr-2" /> Light</>
                      ) : (
                        <><Moon className="h-4 w-4 mr-2" /> Dark</>
                      )}
                    </Button>
                  )}
                </div>
                <WalletButton />
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href="/sign-in" onClick={closeMenu}>Sign In</Link>
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
