"use client";

import { authClient } from "@/lib/auth-client";

import UpperMenu from "@/components/ui/upperMenu";
import InfoSidebar from "@/components/sidebar/infoSidebar";
import StoreProvider from "@/components/StoreProvider";
import { Role } from "@/prisma/generated/prisma";
import { MapProvider } from "@/app/context/mapContext";
import DatabaseTablet from "@/components/search/databaseTablet";
import Dashboard from "@/components/auth/dashboard";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboard() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <Card className="acpect-ratio=1/1">
            <LoadingSpinner/>
        </Card>;
    }

    if (session?.user?.role === Role.ADMIN) {
        return (
                <Dashboard/>
        );
    }
    return <Card>СКОРО</Card>;
}
