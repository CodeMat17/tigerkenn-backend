'use client'

import { useState, useEffect } from "react";
import PWAModal from "./PWAModal";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}


const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsModalOpen(true); // Show the modal when the prompt is ready
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    const checkIfPWAInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsModalOpen(false); // Close the modal if already installed
      }
    };

    window.addEventListener("appinstalled", checkIfPWAInstalled);
    checkIfPWAInstalled();

    return () => {
      window.removeEventListener("appinstalled", checkIfPWAInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("PWA installed");
      }
      setIsModalOpen(false); // Close modal after installation
    }
  };

  return (
    <PWAModal
      open={isModalOpen} // Pass the state here
      onOpenChange={setIsModalOpen} // Allow closing from within PWAModal
      onInstallClick={handleInstallClick}
    />
  );
};

export default PWAInstallPrompt;