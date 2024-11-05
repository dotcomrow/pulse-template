import { Control, defaults as defaultControls } from 'ol/control';
import "@styles/map/geolocation-control.css";
import { useAppSelector, useAppStore, useAppDispatch } from "@hook/redux";
import { setError } from "@lib/features/error/errorSlice";

export default class GeolocationControl extends Control {

    store = useAppStore();
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(centerMap: any) {
        const image = document.createElement('img');
        image.src = "/assets/images/icons/location.svg";
        image.alt = "Click this icon to geolocate your device position";
        image.title = "Click this icon to geolocate your device position";
        image.className = "geolocate-icon p-1 rounded-small bg-grey";

        const element = document.createElement('div');
        element.className = 'geolocate ol-unselectable ol-control';
        element.appendChild(image);
        
        super({
            element: element,
        });

        image.addEventListener('click', this.geolocatePosition.bind(this, centerMap), false);

    }

    geolocatePosition(centerMap: any) {
        const map = this.getMap();
        if (map) {
            if (map.getTargetElement().classList.contains('spinner')) {
                return;
            } else {
                map.getTargetElement().classList.add('spinner');
            }
        }

        navigator.geolocation.getCurrentPosition((position) => {
            centerMap(position);
            if (map) {
                map.getTargetElement().classList.remove('spinner');
            }
        }, (error) => {
            const errorMsg = "An error occured while trying to get your location. Please ensure you have location services enabled on your device and allow this site permission to read device location.  Error message: " + error.message;
            this.store.dispatch(setError({
                errorTitle: "Geolocation error",
                errorDetails: errorMsg,
                exception: error,
                errorSeverity: "error",
                errorIcon: "error",
                errorTextStyle: "text-danger"
            }));
            if (map) {
                map.getTargetElement().classList.remove('spinner');
            }
        },
            {
                enableHighAccuracy: false,
                timeout: 3000,
                maximumAge: 0,
            });
    }
}