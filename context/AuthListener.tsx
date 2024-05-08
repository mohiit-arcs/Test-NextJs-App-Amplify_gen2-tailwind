"use client";

import React from "react";
import { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const AuthListener = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthEvent = async ({ payload }: any) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          console.log("An error has occurred during the OAuth flow.");
          break;
        case "customOAuthState":
          break;
        default:
          break;
      }
    };

    const unsubscribe = Hub.listen("auth", handleAuthEvent);

    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        router.push("/dashboard");
        console.log(currentUser);
      } catch (error) {
        console.error(error);
        console.log("Not signed in");
        signInWithRedirect();
      }
    };

    getUser();

    return () => {
      unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
};

export default AuthListener;