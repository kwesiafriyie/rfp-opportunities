"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/explore-rfp");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
      <h1 className="text-4xl font-bold mb-4 text-center drop-shadow-lg">
        Consulting Opportunities
      </h1>
      <p className="text-lg mb-6 opacity-80">
        Redirecting you to the latest notices...
      </p>
      <div className="animate-spin w-10 h-10 border-4 border-t-4 border-white rounded-full"></div>
    </div>
  );
}
