import React, { useEffect } from 'react';
import "@styles/map/compass.css"

export default function CompassWidget({ enabled, direction, setDirection, mapTarget }: { enabled: boolean, direction: number, setDirection: (direction: number) => void, mapTarget: string }) {

    const [directionDisplay, setDirectionDisplay] = React.useState('N');
    const needleId = 'needle' + mapTarget;

    useEffect(() => {
        const needle = document.getElementById(needleId);
        if (needle) {
            needle.style.transform = `rotate(${direction}deg)`;
        }
    }, [direction]);

    useEffect(() => {
        const needle = document.getElementById(needleId);
        if (needle) {
            needle.style.transform = `rotate(${direction}deg)`;
        }
    }, []);

    return (
        !enabled ? <></> :
        <div className="w-full flex-col flex p-3">
            <div className="w-full flex justify-center">
                <div className="compass w-2/5 h-24" onClick={(e: React.MouseEvent<HTMLElement>) => {
                const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                const angle = Math.atan2(y, x) * (180 / Math.PI);
                const adjustedAngle = (angle + 360 + 90) % 360;
                
                const directionIndex = Math.round(adjustedAngle / 45) % 8;
                const direction = directions[directionIndex];
                
                setDirection(Math.floor(adjustedAngle));
                setDirectionDisplay(direction);
            }}>
                    <div className="needle" id={needleId}></div>
                </div>
            </div>
            <div className="direction-display w-full flex pt-2" id="directionDisplay">
                <h2 className="w-full flex">Direction: {directionDisplay}</h2>
                <h2 className="w-full flex">Angle: {direction}</h2>
            </div>
        </div>
    );
}
