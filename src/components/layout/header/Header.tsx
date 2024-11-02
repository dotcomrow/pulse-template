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
        <>
            <div className="w-full min-md:flex max-md:hidden">
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
                            return (
                                <NavbarItem isActive={pathname === item.link}>
                                    <Link
                                        href={pathname === item.link ? "#" : item.link}
                                        className={pathname === item.link ? "text-primary" : "text"}
                                    >
                                        {item.title}
                                    </Link>
                                </NavbarItem>
                            );
                        })}
                    </NavbarContent>
                    <NavbarContent as="div" justify="end" className="w-2/5 flex">
                        <ProfileAvatar />
                    </NavbarContent>
                    <NavbarMenu>
                        {Constants.navLinks.map((item, index) => (
                            <NavbarMenuItem isActive={pathname === item.link}>
                                <Link
                                    href={item.link}
                                    className={
                                        (pathname === item.link ? "text-primary" : "text") + " w-full"
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
            </div>
            <div className="w-full md:hidden max-sm:flex">
                <Navbar>
                    <NavbarContent className="w-full gap-4" justify="center">
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
                        <NavbarItem className="hidden lg:flex">
                            <Link href="#">Login</Link>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>
            </div>
        </>
    );
};