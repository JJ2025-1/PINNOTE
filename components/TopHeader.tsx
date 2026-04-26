"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function TopHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Browse", href: "/" },
    { name: "My Music", href: "/my-music" },
    { name: "Radio", href: "/radio" },
  ];

  return (
    <header className="sticky top-0 z-50 h-14 w-full bg-[#00121d] text-white flex items-center px-4 md:px-0 border-b border-black/20">
      {/* Logo Section */}
      <div className="flex h-full w-full md:w-52 items-center justify-between md:justify-center border-r border-black/20 bg-black/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center p-1">
            <span className="font-black italic text-xs tracking-tighter">N</span>
          </div>
          <span className="text-xl font-black italic tracking-tight">PLAYBOI</span>
        </Link>
        <button 
          className="md:hidden p-1 hover:bg-white/10 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation Tabs - Desktop */}
      <nav className="hidden md:flex h-full items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "h-full px-8 flex items-center text-sm font-bold border-r border-black/10 transition-colors relative",
              pathname === item.href || (item.name === "Browse" && pathname === "/")
                ? "bg-[#002233] text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[#e67e22]" 
                : "text-gray-400 hover:text-white hover:bg-black/5"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Right Icons */}
      <div className="hidden md:flex h-full items-center ml-auto px-6 gap-6">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#00121d] border-b border-black/20 p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className="text-lg font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex gap-6 mt-2 pt-4 border-t border-white/10">
            <Search size={24} />
            <Settings size={24} />
          </div>
        </div>
      )}
    </header>
  );
}
