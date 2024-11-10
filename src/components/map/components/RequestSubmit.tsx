"use client";

import { Tabs, Tab } from "@nextui-org/tabs";
import { Checkbox } from "@nextui-org/checkbox";
import { useEffect, useState } from "react";
import CompassWidget from "@component/map/widgets/CompassWidget";
import { DateInput } from "@nextui-org/date-input";
import { parseAbsolute } from "@internationalized/date";
import { Input } from "@nextui-org/input";
import { RadioGroup, Radio, useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import savePictureRequests from "@services/map/SavePictureRequest";
import { Spinner } from "@nextui-org/spinner";

export default function RequestSubmit({ vectorLayer, token, popupClose, mapTarget }: { vectorLayer: any, token: string, popupClose: any, mapTarget: string }) {

    const [compassDirectionEnabled, setCompassDirectionEnabled] = useState(true);
    const [direction, setDirection] = useState(0);
    const [requestDate, setRequestDate] = useState(parseAbsolute(new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone));
    const [requestTitle, setRequestTitle] = useState("");
    const [requestDescription, setRequestDescription] = useState("");
    const [bidType, setBidType] = useState("free");
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        var isSubmitEnabled = true;
        if (requestTitle.length == 0) {
            isSubmitEnabled = false;
        }

        if (compassDirectionEnabled) {
            if (direction < 0 || direction > 360) {
                isSubmitEnabled = false;
            }
        }
        setIsSubmitEnabled(isSubmitEnabled);
    }, [requestTitle, requestDescription, compassDirectionEnabled, direction]);

    const CustomRadio = (props: any) => {
        const {
            Component,
            children,
            isSelected,
            description,
            getBaseProps,
            getWrapperProps,
            getInputProps,
            getLabelProps,
            getLabelWrapperProps,
            getControlProps,
        } = useRadio(props);

        return (
            <Component
                {...getBaseProps()}
                className={cn(
                    "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
                    "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
                    "data-[selected=true]:border-primary",
                )}
            >
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <span {...getWrapperProps()}>
                    <span {...getControlProps()} />
                </span>
                <div {...getLabelWrapperProps()}>
                    {children && <span {...getLabelProps()}>{children}</span>}
                    {description && (
                        <span className="text-small text-foreground opacity-70">{description}</span>
                    )}
                </div>
            </Component>
        );
    };

    const submitRequest = (e: any) => {
        e.preventDefault();
        setShowLoading(true);

        const parseDate = new Date(
            requestDate.year,
            requestDate.month - 1,
            requestDate.day,
            requestDate.hour,
            requestDate.minute,
            requestDate.second);

        const request = {
            title: requestTitle,
            description: requestDescription,
            date: parseDate.getTime(),
            bidType: bidType,
            geom: JSON.stringify(vectorLayer?.getSource()?.getFeatureById("request")?.getGeometry()?.getCoordinates()),
            direction: direction
        };

        savePictureRequests(request, token).then((res) => {
            e.savedRequest = true;
            setRequestDescription("");
            setRequestTitle("");
            setDirection(0);
            setCompassDirectionEnabled(true);
            popupClose(e);
            setShowLoading(false);
        });
    }

    return (
        <div className="flex w-full flex-col">
            {showLoading ?
                <div>
                    <Spinner
                        size="lg"
                        color="primary"
                        label="Submitting request..."
                    />
                </div>
                :
                <>
                    <Tabs aria-label="Options">
                        <Tab key="details" title="Details">
                            <Checkbox
                                name="compassDirection"
                                isSelected={compassDirectionEnabled}
                                onValueChange={(e) => {
                                    setCompassDirectionEnabled(e);
                                    if (!e) {
                                        setDirection(-1);
                                    } else {
                                        setDirection(0);
                                    }
                                }}>Verify Compass Direction</Checkbox>
                            <div className="flex flex-col" id="compass">
                                <CompassWidget enabled={compassDirectionEnabled} direction={direction} setDirection={setDirection} mapTarget={mapTarget} />
                                <DateInput
                                    label={"Picture date/time"}
                                    value={requestDate}
                                    className="max-w-sm pt-3"
                                    minValue={parseAbsolute(new Date().toISOString(), Intl.DateTimeFormat().resolvedOptions().timeZone)}
                                    onChange={(e) => {
                                        setRequestDate(e);
                                    }}
                                />
                            </div>
                        </Tab>
                        <Tab key="description" title="Description">
                            <Input
                                label="Request Title"
                                placeholder="Enter a title for the request"
                                className="w-full p-3"
                                value={requestTitle}
                                onChange={(e) => {
                                    setRequestTitle(e.currentTarget.value);
                                }}
                            />
                            <Input
                                label="Request Description"
                                placeholder="Add details about the request"
                                className="w-full p-3"
                                maxLength={500}
                                value={requestDescription}
                                onChange={(e) => {
                                    setRequestDescription(e.currentTarget.value);
                                }}
                            />
                        </Tab>
                        <Tab key="payment" title="Payment">
                            <RadioGroup
                                label="Request Bid"
                                description="Choose what you are willing to pay for this request"
                                value={bidType}
                                onChange={(e) => {
                                    setBidType(e.currentTarget.value);
                                }}
                                onValueChange={(e) => {
                                    setBidType(e);
                                }}
                            >
                                <CustomRadio
                                    description="Request will be fulfilled through kindness of community"
                                    value="free"
                                >
                                    Free
                                </CustomRadio>
                                {/* <CustomRadio
                            description="Choose a price to pay for request fulfillment"
                            value="pay"
                            isDisabled={true}
                            className="hidden"
                        >
                            Paid
                        </CustomRadio>
                        <CustomRadio
                            description="Bill your organization for request fulfillment"
                            value="enterprise"
                            isDisabled={true}
                            className="hidden"
                        >
                            Enterprise
                        </CustomRadio> */}
                            </RadioGroup>
                            <div>
                                More payment options coming soon!
                            </div>
                        </Tab>
                    </Tabs>
                    <div className="w-full flex justify-end">
                        <Button
                            size="sm"
                            isDisabled={!isSubmitEnabled}
                            onClick={submitRequest}
                        >
                            Submit Request
                        </Button>
                    </div>
                </>
            }
        </div>
    );
}