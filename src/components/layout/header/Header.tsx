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
import { usePathname } from 'next/navigation'
import React, { useEffect } from "react";
import { default as Constants } from "@utils/constants";
import { Button, ButtonGroup } from "@nextui-org/button";

export default function Header({ token }: { token: string }) {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* <!-- Desktop Navbar --> */}
            <Navbar isBordered
                maxWidth="full"
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                className="min-md:flex max-md:hidden"
            >
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
                <NavbarBrand>
                    <h1 className="text-2xl font-bold">SnapSpot</h1>
                </NavbarBrand>
                <NavbarContent className="gap-4" justify="center">
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

            {/* <!-- Mobile Navbar --> */}
            <Navbar
                classNames={{
                    item: [
                        "md:hidden",
                        "max-sm:flex",
                        "items-center",
                        "data-[active=true]:after:content-['']",
                        "data-[active=true]:after:absolute",
                        "data-[active=true]:after:bottom-0",
                        "data-[active=true]:after:left-0",
                        "data-[active=true]:after:right-0",
                        "data-[active=true]:after:h-[2px]",
                        "data-[active=true]:after:rounded-[2px]",
                        "data-[active=true]:after:bg-primary",
                    ],
                }}
                isBordered={true}
                maxWidth="full"
                style={{
                    top: "calc(100% - 4rem)",
                    position: "fixed"
                }}
            >
                <NavbarContent
                    className="w-full gap-1"
                    justify="center"
                >
                    {token.length > 0 ? (
                        <>
                            {Constants.mobileLoggedInLinks.map((item, index) => {
                                return (
                                    <NavbarItem isActive={pathname === item.link}>
                                        <Button
                                            href={pathname === item.link ? "#" : item.link}
                                            as={Link}
                                            color="primary"
                                            className={pathname === item.link ? "text-primary" : "text"}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {item.title}
                                        </Button>
                                    </NavbarItem>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {Constants.mobileLoggedOutLinks.map((item, index) => {
                                return (
                                    <NavbarItem isActive={pathname === item.link}>
                                        <Button
                                            href={pathname === item.link ? "#" : item.link}
                                            as={Link}
                                            color="primary"
                                            className={pathname === item.link ? "text-primary" : "text"}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {item.title}
                                        </Button>
                                    </NavbarItem>
                                );
                            })}
                        </>
                    )}
                    <NavbarItem>
                        <ProfileAvatar />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
};