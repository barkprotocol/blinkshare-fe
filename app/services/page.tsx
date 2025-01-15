'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store, User, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  { href: "/marketplace", icon: Store, label: "Marketplace", description: "Browse and purchase Blinks" },
  { href: "/my-blinks", icon: User, label: "My Blinks", description: "Manage your Blinks" },
  { href: "/blink-generator", icon: Zap, label: "Blink Generator", description: "Create new Blinks" },
];

export default function ServicesPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-40">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Link key={service.href} href={service.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <service.icon size={24} />
                    <span>{service.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

