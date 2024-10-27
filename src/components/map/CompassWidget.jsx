import React from 'react';
import "@styles/map/compass.css"

export default function CompassWidget() {

    return (
        <div class="w-full flex-col flex p-3">
            <div class="w-full flex justify-center">
                <div class="compass w-1/3 h-24" onClick={(e) => {
                const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

                const rect = e.target.getBoundingClientRect();
                console.log(rect);
                const x = e.clientX - (rect.left + rect.width / 2);
                console.log(x);
                const y = -(e.clientY - (rect.top + rect.height / 2));
                console.log(y);
                const angle = Math.atan2(y, x) * (180 / Math.PI);
                console.log(angle);
                const adjustedAngle = (angle + 360) % 360;
                console.log(adjustedAngle);
                const directionIndex = Math.round(adjustedAngle / 45) % 8;
                console.log(directionIndex);
                const direction = directions[directionIndex];
                const needle = document.getElementById('needle');
                const directionDisplay = document.getElementById('directionDisplay');
                
                needle.style.transform = `rotate(${adjustedAngle}deg)`;
                console.log(`rotate(${adjustedAngle}deg)`);
                directionDisplay.textContent = `Direction: ${direction}`;
            }}>
                    <div class="needle" id="needle"></div>
                </div>
            </div>
            <div class="direction-display w-full flex" id="directionDisplay">Direction: N</div>
        </div>
    );
}
