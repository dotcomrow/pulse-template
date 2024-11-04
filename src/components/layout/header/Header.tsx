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
import { setInitialLocation } from "@lib/features/location/locationSlice";
import { clearNotification, setNotification } from "@lib/features/notification/notificationSlice";


export default async function Header({ headersList, token }: { headersList: any, token: string }) {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const store = useAppStore();

    useEffect(() => {
        if (localStorage.getItem('locationPermissionGranted') === 'true') {

        } else {
            navigator.permissions.query({ name: 'geolocation' }).then((e) => {
                if (e.state === 'granted') {
                    localStorage.setItem('locationPermissionGranted', 'true');
                    // we are allowed to get device location
                    navigator.geolocation.getCurrentPosition((position) => {
                        store.dispatch(setInitialLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            deviceLocation: true,
                            locationPermissionsAllowed: true,
                            locationLoaded: true
                        }));
                    }, (error) => {
                        store.dispatch(setInitialLocation({
                            latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                            longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                            deviceLocation: false,
                            locationPermissionsAllowed: false,
                            locationLoaded: true
                        }));
                    },
                        {
                            enableHighAccuracy: false,
                            timeout: 3000,
                            maximumAge: 0,
                        });
                } else if (e.state === 'prompt') {
                    // We can tell the user what cloudflare detected but we can ask to use device location
                    const detectedLocation = <><br />
                        <p>Detected location:</p>
                        <p>{decodeURI((headersList.filter((item: any) => item.name == 'x-vercel-ip-city'))[0].value)},
                            {decodeURI((headersList.filter((item: any) => item.name == 'x-vercel-ip-country-region'))[0].value)} {decodeURI((headersList.filter((item: any) => item.name == 'x-vercel-ip-country'))[0].value)}</p>
                        <br /></>;
                    store.dispatch(setNotification({
                        title: "Location Permissions",
                        message:
                            <div>
                                <p>SnapSpot would like to use your device location to provide a better experience.</p>
                                <p>{detectedLocation}</p>
                                <p>Would you like to allow SnapSpot to use your device location?</p>
                            </div>,
                        severity: "info",
                        icon: "info",
                        show: true,
                        denyAction: {
                            label: "Deny",
                            onClick: () => {
                                store.dispatch(setInitialLocation({
                                    latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                                    longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                                    deviceLocation: false,
                                    locationPermissionsAllowed: false,
                                    locationLoaded: true
                                }));
                                store.dispatch(clearNotification());
                            }
                        },
                        confirmAction: {
                            label: "Allow",
                            onClick: () => {
                                navigator.geolocation.getCurrentPosition((position) => {
                                    localStorage.setItem('locationPermissionGranted', 'true');
                                    store.dispatch(setInitialLocation({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        deviceLocation: true,
                                        locationPermissionsAllowed: true,
                                        locationLoaded: true
                                    }));
                                    store.dispatch(clearNotification());
                                }, (error) => {
                                    store.dispatch(setNotification({
                                        title: "Geolocation error",
                                        message: "An error occurred while trying to get your location. Please ensure you have location services enabled on your device and allow this site permission to read device location.  Error message: " + error.message,
                                        severity: "error",
                                        icon: "error",
                                        show: true,
                                        denyAction: {
                                            label: "Dismiss",
                                            onClick: () => {
                                                store.dispatch(clearNotification());
                                            }
                                        },
                                        confirmAction: {
                                            label: "Dismiss",
                                            onClick: () => {
                                                store.dispatch(clearNotification());
                                            }
                                        }
                                    }));
                                    store.dispatch(setInitialLocation({
                                        latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                                        longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                                        deviceLocation: false,
                                        locationPermissionsAllowed: false,
                                        locationLoaded: true
                                    }));
                                    store.dispatch(clearNotification());
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
                    localStorage.setItem('locationPermissionGranted', 'false');
                    // user said no so we can ONLY use what cloudflare detects
                    store.dispatch(setInitialLocation({
                        latitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-latitude')[0].value),
                        longitude: parseFloat(headersList.filter((item: any) => item.name == 'x-vercel-ip-longitude')[0].value),
                        deviceLocation: false,
                        locationPermissionsAllowed: false,
                        locationLoaded: true
                    }));
                }
            });
        }
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