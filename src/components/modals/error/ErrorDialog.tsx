"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button, ButtonGroup } from "@nextui-org/button";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { selectError } from "@lib/features/error/errorSlice";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { clearError } from "@lib/features/error/errorSlice";

export default function ErrorDialog() {

    const store = useAppStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [message, setMessage] = useState<string>(); // string | undefined
    const [error, setError] = useState<string>(); // any | undefined
    const errorRequestsState: any = useAppSelector(selectError);

    useEffect(() => {
        if (errorRequestsState.exception) {
            setMessage(errorRequestsState.details);
            setError(errorRequestsState.error);
            onOpen();
        }
    }, [errorRequestsState]);

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            isDismissable={true} 
            hideCloseButton={false}
            onClose={() => {
                onOpenChange();
                store.dispatch(clearError());
            }}
        >
            <ModalContent>
                <ModalHeader>Oops! An error occurred</ModalHeader>
                <ModalBody className="px-10 py-10 flex h-20 justify-center">
                    <h1 className="text-danger">{error}</h1>
                    <div className="flex justify-center">
                        {message}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal >
    );
}