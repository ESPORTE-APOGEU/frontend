import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null; // evita flicker enquanto o Clerk carrega
  return <Redirect href={isSignedIn ? "/auth" : "/Preview"} />;
}
