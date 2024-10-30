import { NextUIProvider } from "@nextui-org/system";
import { StoreProvider } from "./StoreProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children, token }: { children: React.ReactNode, token: string }) {
    return (
        <StoreProvider token={token}>
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={true} >
                    {children}
                </NextThemesProvider>
            </NextUIProvider>
        </StoreProvider>
    )
}