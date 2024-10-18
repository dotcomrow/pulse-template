"use client";

import { NextUIProvider } from "@nextui-org/system";
import { StoreProvider } from "./StoreProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <StoreProvider>
                <NextUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="light">
                        {children}
                    </NextThemesProvider>
                </NextUIProvider>
            </StoreProvider>
        </>
    )
}