"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileInfo from "@/components/profile/ProfileInfo";
import AddressManager from "@/components/profile/AddressManager";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (
      activeTabParam &&
      ["info", "billing", "shipping"].includes(activeTabParam)
    ) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    {
      id: "info",
      label: "Mon compte",
      path: "/profile?tab=info",
      content: <ProfileInfo user={user} />,
    },
    {
      id: "billing",
      label: "Adresse de facturation",
      path: "/profile?tab=billing",
      content: <AddressManager type="billing" />,
    },
    {
      id: "shipping",
      label: "Adresse de livraison",
      path: "/profile?tab=shipping",
      content: <AddressManager type="shipping" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Mon compte</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <ProfileTabs tabs={tabs} activeTab={activeTab} />
      </div>
    </div>
  );
}
