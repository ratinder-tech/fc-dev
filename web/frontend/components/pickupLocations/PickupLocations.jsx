import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./style.css";

export function PickupLocations() {
    return (
        <div className="pickup-locations">
            <div className='pickup-head'>
                <div className="payment-heading">
                    Pickup Locations
                </div>
                <div className="submit">
                    <button className="submit-btn" variant="primary">
                        Add New Location
                    </button>
                </div>
            </div>
        </div>
    );
}