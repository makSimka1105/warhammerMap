"use client";

import { authClient } from "@/lib/auth-client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Logout } from "./logout";
import OnlyNavMenu from "../ui/onlyNavMenu";

export default function Dashboard() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <div>Loading session…</div>;
    }

    if (!session) {
        return <div>Not authenticated</div>;
    }

    const { user } = session;
    return (
        <div className="flex flex-col gap-4 items-center justify-center w-full">
            <OnlyNavMenu/>
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle className="text-xl">Session</CardTitle>
                    <CardDescription>Current session details</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                    <div>
                        <span className="font-medium">User:</span>{" "}
                        {user.name ?? user.email}
                    </div>
                    {"role" in user && (
                        <div>
                            <span className="font-medium">Role:</span>{" "}
                            {(user as any).role}
                        </div>
                    )}
                </CardContent>
            </Card>
            <Logout />
        </div>
    );
}
