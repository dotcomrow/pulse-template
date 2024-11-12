import { Control, defaults as defaultControls } from 'ol/control';
import "@styles/map/geolocation-control.css";
import { createRoot } from 'react-dom/client';
import React from 'react';
import LocationSearchWidget from '@component/map/widgets/LocationSearchWidget';

export default class LocationSearchControl extends Control {


    constructor(centerMap: any) {
        const element = document.createElement('div');
        element.className = 'location-search ol-unselectable w-9/12';
        const root = createRoot(element);
        root.render(React.createElement(LocationSearchWidget, { centerMap }));
        
        super({
            element: element,
        });
    }

};