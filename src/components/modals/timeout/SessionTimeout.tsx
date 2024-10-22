"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button, ButtonGroup } from "@nextui-org/button";
import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector } from "@hook/redux";
import { selectUser } from "@lib/features/user/userSlice";
import { useCookies } from 'react-cookie';
import { CookieSetOptions } from "universal-cookie";
import { default as Constants } from "@utils/constants";

export default function SessionTimeout() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [timer, setTimer] = useState('00:00');
    const [cookies, setCookie, removeCookie] = useCookies(["token", "expires"]);
    const Ref = useRef<NodeJS.Timeout | null>(null);
    const state: any = useAppSelector(selectUser);
    const expires_in = cookies.expires;

    useEffect(() => {
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            if (!state.user) {
                clearInterval(id);
                return;
            }
            startTimer();
        }, 1000)
        Ref.current = id;
        async function fetchData() {
            while (true) {
                if (!state.user) {
                    await new Promise(r => setTimeout(r, 1000));
                    break;
                }
                const session_expires_in = expires_in;
                const now = new Date();
                if (now.getTime() > new Date(session_expires_in).getTime() - (1000 * 60 * 2)) {
                    //show 2 minute modal
                    if (!open) {
                        onOpen();
                    }
                }
                // compare the expiry time of the item with the current time
                if (now.getTime() > new Date(session_expires_in).getTime()) {
                    var options = {
                        path: "/",
                        expires: new Date(Date.now()),
                        secure: (window.location.protocol === "https:"),
                        // httpOnly: true,
                        sameSite: "lax"
                    } as CookieSetOptions;
                    if (!window.location.hostname.includes("localhost")) {
                        options.domain = window.location.hostname;
                        // options.httpOnly = true;
                        options.sameSite = "lax";
                    }
                    removeCookie("token", options);
                    removeCookie("expires", options);
                    localStorage.clear();
                    if (Constants.navLinks.find((item) => item.link === window.location.pathname)) {
                        window.location.reload();
                    } else {
                        window.location.href = "/";
                    }
                }
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        fetchData();
    }, [state]);

    function getTimeRemaining() {
        const session_expires_in = expires_in;
        const total = new Date(session_expires_in).getTime() - new Date().getTime();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    function startTimer() {
        let { total, minutes, seconds }
            = getTimeRemaining();
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }

    return (
        <>
            {/* <Button onClick={onOpen} >Open</Button> */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton={true}>
                <ModalContent>
                    <ModalBody className="px-10 py-10 flex h-20 justify-center">
                        <h1 className="text-danger">Session Expires In: </h1>{timer}
                    </ModalBody>
                </ModalContent>
            </Modal >
        </>
    );
}