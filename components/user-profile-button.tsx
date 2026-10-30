"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export const UserProfileButton = () => {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-neutral-500 hover:text-red-500 hover:bg-red-50 font-bold"
      onClick={() => logout()}
    >
      <LogOut className="h-5 w-5 mr-3" />
      Déconnexion
    </Button>
  );
};

