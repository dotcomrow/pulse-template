import { NextUIProvider } from "@nextui-org/system";
import { StoreProvider } from "./StoreProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LocationProvider } from "./LocationProvider";

export function Providers({ children, headersList, token }: { children: React.ReactNode, token: string, headersList: any }) {
    return (
        <StoreProvider token={token}>
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={true} >
                    <LocationProvider
                        headersList={headersList}
                    >
                        {children}
                    </LocationProvider>
                </NextThemesProvider>
            </NextUIProvider>
        </StoreProvider>
    )
}