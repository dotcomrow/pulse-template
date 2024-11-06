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
import { Image } from "@nextui-org/image";

export default async function Header({ token }: { token: string }) {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* <!-- Desktop Navbar --> */}
            <Navbar isBordered
                maxWidth="full"
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                className="lg:flex max-lg:hidden"
            >
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
            </Navbar>

            {/* <!-- Mobile Navbar --> */}
            <Navbar
                className="lg:hidden max-md:flex"
                classNames={{
                    item: [
                        "items-center",
                        // "data-[active=true]:after:content-['']",
                        // "data-[active=true]:after:absolute",
                        // "data-[active=true]:after:bottom-0",
                        // "data-[active=true]:after:left-0",
                        // "data-[active=true]:after:right-0",
                        // "data-[active=true]:after:h-[2px]",
                        // "data-[active=true]:after:rounded-[2px]",
                        // "data-[active=true]:after:bg-primary",
                    ],
                }}
                isBordered={true}
                maxWidth="full"
            >
                <NavbarContent
                    className="w-full gap-8"
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
                                            variant="light"
                                            size="lg"
                                            isIconOnly
                                            isDisabled={pathname === item.link ? true : false}
                                        >
                                            <Image
                                                src={item.icon}
                                                alt={item.title}
                                                width={50}
                                                height={50}
                                            />
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
                                            variant="light"
                                            size="lg"
                                            isIconOnly
                                            isDisabled={pathname === item.link ? true : false}
                                        >
                                            <Image
                                                src={item.icon}
                                                alt={item.title}
                                                width={50}
                                                height={50}
                                            />
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