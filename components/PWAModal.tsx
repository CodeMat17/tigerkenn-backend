"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "./ui/button";

interface PWAModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onInstallClick: () => void;
}

interface PWAModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onInstallClick: () => void;
}

const PWAModal: React.FC<PWAModalProps> = ({
  open,
  onOpenChange,
  onInstallClick,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Tigerkenn Homes Dashboard</DialogTitle>
          <DialogDescription>
            Get quick access by installing the app on your device.
          </DialogDescription>
        </DialogHeader>

        <div className='flex items-center justify-end gap-4'>
          <Button onClick={() => onOpenChange(false)} className='bg-gray-500'>
            Close
          </Button>
          <Button onClick={onInstallClick}>Install App</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAModal;