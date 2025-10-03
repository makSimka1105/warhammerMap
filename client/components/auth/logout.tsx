"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

export function Logout() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogOut = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await authClient.signOut();
            router.push("/login");
        } catch (e) {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[4vw] flex justify-center align-center w-10">
            <button onClick={handleLogOut} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                {isLoading ? "Logging out..." : <LogOut/>}
            </button>
        </div>
    );
}
