
import ProfileAvatar from "@component/profile/ProfileAvatar";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/navbar";
import Link from "next/link";
import { Button, ButtonGroup } from "@nextui-org/button";

export default function Header() {

    return (
        <header className="header h-10">
            <Navbar isBordered maxWidth="full">
                <NavbarBrand>
                    <h1 className="text-2xl font-bold">SnapSpot</h1>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Features
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link href="#" aria-current="page">
                            Customers
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Integrations
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <ProfileAvatar />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </header>
    );
};