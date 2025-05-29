"use client";
import { useAppStore } from "@/store";

export default function Home() {
  const email = useAppStore((state) => state.email);
  const timer = useAppStore((state) => state.timer);

  return (
    <div className="">
      <h3 className="text-5xl">Email de toto : {email}</h3>
      <h3 className="text-5xl">Timer : {timer}</h3>
    </div>
  );
}
