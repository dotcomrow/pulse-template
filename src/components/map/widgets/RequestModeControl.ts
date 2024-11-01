import { Control, defaults as defaultControls } from 'ol/control';
import "@styles/map/request-mode-control.css";

export default class GeolocationControl extends Control {

    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(pictureRequestMode: any, token: string) {

        const image = document.createElement('img');
        image.src = "/assets/images/icons/camera.svg";
        image.width = 25;
        image.height = 25;
        image.alt = token.length > 0 ? "Select a location on the map and complete the request submit dialog form" : "Please login to submit a request";
        image.title = token.length > 0 ? "Select a location on the map and complete the request submit dialog form" : "Please login to submit a request";
        image.className = "capture-request-icon p-1 rounded-small bg-grey requestModeDisabled";
        image.id = "pictureRequestBtn";

        const element = document.createElement('div');
        element.className = 'capture-request ol-unselectable ol-control';
        element.appendChild(image);

        super({
            element: element,
        });

        if (token.length > 0) {
            image.style.cursor = "pointer";
            image.addEventListener('click', pictureRequestMode, false);
        } else {
            image.style.cursor = "not-allowed";
        }

    }
}