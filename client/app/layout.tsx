import React from "react";
import type { Metadata } from "next";
import "./styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Warhammer Map",
    description: "Интерактивная карта галактики Warhammer 40k: планеты, легионы и события",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
