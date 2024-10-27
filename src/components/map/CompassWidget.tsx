import React from 'react';
import "@styles/map/compass.css"

export default function CompassWidget({ direction, setDirection}: { direction: number, setDirection: (direction: number) => void }) {

    const [directionDisplay, setDirectionDisplay] = React.useState('N');

    return (
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
                const needle = document.getElementById('needle');
                
                setDirection(Math.floor(adjustedAngle));
                setDirectionDisplay(direction);
                if (needle) {
                    needle.style.transform = `rotate(${direction}deg)`;
                }
            }}>
                    <div className="needle" id="needle"></div>
                </div>
            </div>
            <div className="direction-display w-full flex pt-2" id="directionDisplay">
                <h2 className="w-full flex">Direction: {directionDisplay}</h2>
                <h2 className="w-full flex">Angle: {direction}</h2>
            </div>
        </div>
    );
}
