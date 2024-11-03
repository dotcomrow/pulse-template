"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button, ButtonGroup } from "@nextui-org/button";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { clearNotification, selectNotification } from "@lib/features/notification/notificationSlice";

export default function NotificationDialog() {

    const store = useAppStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const notificationState: any = useAppSelector(selectNotification);

    useEffect(() => {
        if (notificationState.show) {
            onOpen();
        }
    }, [notificationState]);

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            isDismissable={true} 
            hideCloseButton={false}
            onClose={() => {
                onOpenChange();
                store.dispatch(clearNotification());
            }}
        >
            <ModalContent>
                <ModalHeader>{notificationState.title}</ModalHeader>
                <ModalBody className="px-10 py-10 flex h-20 justify-center">
                    <h1 className={
                        "flex justify-center"
                    }>{notificationState.message}</h1>
                </ModalBody>
                <ModalFooter>
                    {notificationState.action ? (
                    <ButtonGroup>
                        <Button 
                            onClick={() => {
                                notificationState.action.onClick();
                            }}>
                            {notificationState.action.label}
                        </Button>
                    </ButtonGroup>
                    ) : <></>}
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
}