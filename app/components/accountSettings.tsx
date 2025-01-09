import * as React from "react"
import { Cog, User, AudioWaveformIcon as Waveform, Database, UserSquare, AppWindowIcon as Apps, Shield, ChevronDown, X } from 'lucide-react'

import { cn } from "~/lib/utils"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"    
import { Switch } from "./ui/switch"
import { Separator } from "./ui/separator"

type NavItem = {
    icon: React.ComponentType<{ className?: string }>
    label: string
    isActive?: boolean
  }
  
  const navItems: NavItem[] = [
    { icon: Cog, label: "General", isActive: true },
    { icon: User, label: "Personalization" },
    { icon: Waveform, label: "Speech" },
    { icon: Database, label: "Data controls" },
    { icon: UserSquare, label: "Builder profile" },
    { icon: Apps, label: "Connected apps" },
    { icon: Shield, label: "Security" },
  ]
  
export function AccountSettingsDialog() {
    return (
        <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-medium">Settings</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-auto w-auto p-0"
            >
            </Button>
          </div>
        </DialogHeader>
        <div className="flex gap-6 p-6 pt-8">
          <div className="flex-1 text-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="">Theme</div>
              <Select defaultValue="light">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="">
                Always show code when using data analyst
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="">Language</div>
              <Select defaultValue="auto">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      Auto-detect
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="">Archived chats</div>
              <Button variant="outline">Manage</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="">Archive all chats</div>
              <Button variant="outline">Archive all</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="">Delete all chats</div>
              <Button variant="destructive">Delete all</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="">Log out on this device</div>
              <Button variant="outline">Log out</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    );
}