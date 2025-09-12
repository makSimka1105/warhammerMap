import React from "react";
import type { Metadata } from "next";
// import "./styles/globals.css";
import "./styles/globals.css"; // Импортируем глобальные стили
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Map Next App",
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

//  wrapper.withRedux(RootLayout)
