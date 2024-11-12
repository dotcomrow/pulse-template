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
    const errorState: any = useAppSelector(selectError);

    useEffect(() => {
        if (errorState.exception) {
            onOpen();
        }
    }, [errorState]);

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
                <ModalHeader>{errorState.errorTitle}</ModalHeader>
                <ModalBody className="px-10 py-10 flex h-20 justify-center">
                    <h1 className={
                        "flex justify-center " + errorState.errorTextStyle
                    }>{errorState.errorDetails}</h1>
                </ModalBody>
            </ModalContent>
        </Modal >
    );
}