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
import { default as Constants } from "@utils/constants";

export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

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
                    {Constants.navLinks.map((item, index) => {
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
                    {Constants.navLinks.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`} isActive={pathname === item.link}>
                            <Link
                                className="w-full"
                                href={item.link}
                                // color={
                                //     pathname === item.link ? "blue" : "text"
                                // }
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