"use client";
import React, { useEffect } from "react";
import LoginForm from "../Components/auth/LoginForm/LoginForm";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

function Page() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (user && user._id) {
      router.push("/");
    }
  }, [user, router]);

  //// Check if user is null or undefined
  if (user && user._id) {
    return null; // or loading spinner
  }

  return (
    <div className="auth-page w-full h-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default Page;
