import { Control, defaults as defaultControls } from 'ol/control';
import "@styles/map/geolocation-control.css";

export default class GeolocationControl extends Control {
    
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor() {
        const image = document.createElement('img');
        image.src = "/assets/images/icons/location.svg";
        image.alt = "Click this icon to geolocate your device position";
        image.title = "Click this icon to geolocate your device position";
        image.className = "geolocate-icon p-1 rounded-small bg-grey";

        const element = document.createElement('div');
        element.className = 'geolocate ol-unselectable';
        element.appendChild(image);

        super({
            element: element,
        });
        image.addEventListener('click', this.geolocatePosition.bind(this), false);

    }

    geolocatePosition() {
        window.postMessage({ type: 'geolocate' }, '*');
    }
}