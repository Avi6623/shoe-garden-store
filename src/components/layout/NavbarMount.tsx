"use client";

import { useSyncExternalStore } from "react";
import Navbar from "@/components/layout/Navbar";

export default function NavbarMount() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="h-[72px] w-full" />;
  }

  return <Navbar />;
}
