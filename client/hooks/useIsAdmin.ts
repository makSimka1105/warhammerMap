import { authClient } from "@/lib/auth-client";

export function useIsAdmin() {
    const { data: session } = authClient.useSession();
    return session?.user.role === "ADMIN";
}
