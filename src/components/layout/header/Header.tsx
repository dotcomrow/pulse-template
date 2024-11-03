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
import { useAppStore } from "@hook/redux";
import { setInitialLocation } from "@lib/features/initialLocation/initialLocationSlice";
import { clearNotification, setNotification } from "@lib/features/notification/notificationSlice";


export default async function Header({ headersList, token }: { headersList: any, token: string }) {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const store = useAppStore();

    useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' }).then((e) => {
            if (e.state === 'granted') {
                // we are allowed to get device location
                navigator.geolocation.getCurrentPosition((position) => {
                    store.dispatch(setInitialLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        deviceLocation: true,
                        locationPermissionsAllowed: true
                    }));
                }, (error) => {

                },
                    {
                        enableHighAccuracy: false,
                        timeout: 3000,
                        maximumAge: 0,
                    });
            } else if (e.state === 'prompt') {
                // We can tell the user what cloudflare detected but we can ask to use device location
                store.dispatch(setNotification({
                    title: "Location Permissions",
                    message: "SnapSpot would like to use your device location to provide a better experience.  Would you like to allow SnapSpot to use your device location?",
                    severity: "info",
                    icon: "info",
                    show: true,
                    action: {
                        label: "Allow",
                        onClick: () => {
                            navigator.geolocation.getCurrentPosition((position) => {
                                store.dispatch(setInitialLocation({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    deviceLocation: true,
                                    locationPermissionsAllowed: true
                                }));
                            }, (error) => {
                                store.dispatch(setNotification({
                                    title: "Geolocation error",
                                    message: "An error occured while trying to get your location. Please ensure you have location services enabled on your device and allow this site permission to read device location.  Error message: " + error.message,
                                    severity: "error",
                                    icon: "error",
                                    show: true,
                                    action: {
                                        label: "Dismiss",
                                        onClick: () => {
                                            store.dispatch(clearNotification());
                                        }
                                    }
                                }));
                            },
                                {
                                    enableHighAccuracy: false,
                                    timeout: 3000,
                                    maximumAge: 0,
                                });
                        }
                    }
                }));
            } else if (e.state === 'denied') {
                // user said no so we can ONLY use what cloudflare detects
                store.dispatch(setInitialLocation({
                    latitude: parseFloat(headersList.get('x-vercel-ip-latitude') ?? '0'),
                    longitude: parseFloat(headersList.get('x-vercel-ip-longitude') ?? '0'),
                    deviceLocation: false,
                    locationPermissionsAllowed: false
                }));
            }
        });
    }, []);

    return (
        <>
            {/* <!-- Desktop Navbar --> */}
            <Navbar isBordered
                maxWidth="full"
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                className="min-md:flex max-md:hidden"
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
                className="md:hidden max-sm:flex"
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
                style={{
                    top: "calc(100% - 4rem)",
                    position: "fixed"
                }}
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