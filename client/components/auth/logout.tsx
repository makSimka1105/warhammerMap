"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Logout() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogOut = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await authClient.signOut();
            router.push("/login");
        } catch {
            toast.error("Не удалось выйти из аккаунта");
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-[3.5vw] bg-[url('/assets/tablet/buttons/logout.png')] bg-contain bg-center bg-no-repeat flex justify-center align-center custom-width ">
            <button className="w-full" onClick={handleLogOut} disabled={isLoading}></button>
        </div>
    );
}
