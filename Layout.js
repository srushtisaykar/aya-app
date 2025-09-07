
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, MessageCircle, Activity, BookOpen, Shield, Phone } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Heart,
    color: "from-pink-400 to-rose-400",
    bgColor: "bg-pink-50"
  },
  {
    title: "Chat",
    url: createPageUrl("Chat"),
    icon: MessageCircle,
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-50"
  },
  {
    title: "Wellness",
    url: createPageUrl("Interventions"),
    icon: Activity,
    color: "from-green-400 to-emerald-400",
    bgColor: "bg-green-50"
  },
  {
    title: "Resources",
    url: createPageUrl("Resources"),
    icon: BookOpen,
    color: "from-purple-400 to-violet-400",
    bgColor: "bg-purple-50"
  },
  {
    title: "Crisis",
    url: createPageUrl("Crisis"),
    icon: Phone,
    color: "from-red-400 to-orange-400",
    bgColor: "bg-red-50"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isCrisisPage = currentPageName === "Crisis";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        
        <Sidebar className="border-none bg-white/80 backdrop-blur-xl shadow-xl">
          <SidebarHeader className="p-6 border-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Stylized 'A' logo */}
                  <div className="absolute w-[6px] h-4/5 bg-white/90 rounded-full transform -rotate-[20deg] -translate-x-[5px]" />
                  <div className="absolute w-[6px] h-4/5 bg-white/90 rounded-full transform rotate-[20deg] translate-x-[5px]" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Aya</h2>
                <p className="text-sm text-gray-500">wellness companion</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-3">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    const isCrisisItem = item.title === "Crisis";
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 border-none
                            ${isCrisisItem 
                              ? 'bg-gradient-to-r from-red-100 to-orange-100 hover:from-red-200 hover:to-orange-200 shadow-lg' 
                              : isActive 
                                ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105` 
                                : 'hover:bg-gray-50 hover:shadow-md hover:scale-102'
                            }
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-4 w-full">
                            <div className={`
                              p-2 rounded-xl transition-all duration-300
                              ${isCrisisItem 
                                ? 'bg-red-200 text-red-600'
                                : isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm'
                              }
                            `}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className={`font-medium ${
                              isCrisisItem 
                                ? 'text-red-700' 
                                : isActive 
                                  ? 'text-white' 
                                  : 'text-gray-700'
                            }`}>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-8 p-5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl border border-indigo-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-indigo-800">Private & Safe</span>
              </div>
              <p className="text-sm text-indigo-700">
                Your conversations are completely confidential.
              </p>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="bg-white/80 backdrop-blur-xl border-none shadow-sm px-4 py-3 md:hidden">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-xl transition-colors" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Stylized 'A' logo - smaller */}
                    <div className="absolute w-[4px] h-4/5 bg-white/90 rounded-full transform -rotate-[20deg] -translate-x-[3px]" />
                    <div className="absolute w-[4px] h-4/5 bg-white/90 rounded-full transform rotate-[20deg] translate-x-[3px]" />
                  </div>
                </div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {isCrisisPage ? "🚨 Crisis" : "Aya"}
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
