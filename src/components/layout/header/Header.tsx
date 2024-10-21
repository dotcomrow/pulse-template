"use client";

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
import { usePathname } from 'next/navigation'

export default function Header() {

    const pathname = usePathname();
    const navigation = [
        { title: "Home", link: "/" },
        { title: "How It Works", link: "/how-it-works" },
        { title: "My Dashboard", link: "/dashboard" }
    ];

    return (
        <header className="header h-10">
            <Navbar isBordered maxWidth="full">
                <NavbarBrand>
                    <h1 className="text-2xl font-bold">SnapSpot</h1>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {navigation.map((item, index) => {
                        if (pathname === item.link)
                            return (
                                <NavbarItem isActive>
                                    <Link href="#" >{item.title}</Link>
                                </NavbarItem>
                            );
                        else
                            return (
                                <NavbarItem>
                                    <Link href={item.link} >{item.title}</Link>
                                </NavbarItem>
                            );
                    })}
                </NavbarContent>
                <NavbarContent as="div" justify="end" className="w-2/5 flex">
                    <ProfileAvatar />
                </NavbarContent>
            </Navbar>
        </header >
    );
};