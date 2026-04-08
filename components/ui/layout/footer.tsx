'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FaDiscord, FaGithub } from 'react-icons/fa';

const socialLinks = [
  {
    href: "https://x.com/bark_protocol",
    ariaLabel: "X (Twitter)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: "https://t.me/@bark_protocol",
    ariaLabel: "Telegram",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    href: "https://discord.gg/PaZQzMFMNW",
    ariaLabel: "Discord",
    icon: <FaDiscord className="h-[18px] w-[18px]" />,
  },
  {
    href: "https://github.com/barkprotocol",
    ariaLabel: "GitHub",
    icon: <FaGithub className="h-[18px] w-[18px]" />,
  },
];

const footerLinks = {
  product: [
    { label: "Marketplace", href: "/marketplace" },
    { label: "My Blinks", href: "/my-blinks" },
    { label: "Blink Generator", href: "/blink-generator" },
    { label: "Services", href: "/services" },
  ],
  resources: [
    { label: "Documentation", href: "https://docs.blinkshare.fun" },
    { label: "API Reference", href: "https://docs.blinkshare.fun/api" },
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you for subscribing!');
    setEmail('');
    setIsLoading(false);
  };

  return (
    <footer className="w-full bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="glass-card rounded-2xl p-8 md:p-12 mb-12 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Stay Updated</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-muted-foreground">
                Get the latest updates on new features and blinks.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 min-w-[240px] bg-background"
                required
              />
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="h-12"
              >
                {isLoading ? "..." : "Subscribe"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                alt="BlinkShare Logo"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-primary/20"
              />
              <span className="text-xl font-display font-bold">
                Blink<span className="text-primary">Share</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Seamlessly connecting communities with Solana blockchain. Create, share, and monetize your blinks.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={link.ariaLabel} 
                  className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} BARK Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
