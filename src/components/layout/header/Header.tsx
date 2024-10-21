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
import React, { useEffect } from "react";

export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const navLinks = [
        { title: "Home", link: "/" },
        { title: "How It Works", link: "/how-it-works" },
        { title: "My Dashboard", link: "/dashboard" }
    ];

    return (
        <header className="header h-10">
            <Navbar isBordered maxWidth="full" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <h1 className="text-2xl font-bold">SnapSpot</h1>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {navLinks.map((item, index) => {
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
                <NavbarMenu>
                    {navLinks.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className="w-full"
                                href={item.link}
                                color={
                                    pathname === item.link ? "blue" : "text"
                                }
                                onClick={(e) => {
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.title}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </header >
    );
};