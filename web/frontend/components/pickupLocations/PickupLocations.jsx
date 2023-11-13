import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import "./style.css";
import { Modal } from '../modal';
import { useState, useEffect } from 'react';
import { AddLocation } from '../addLocation';

export function PickupLocations() {
    const [showModal, setShowModal] = useState(false);
    const [pickupLocations, setPickupLocations] = useState([]);

    const getPickupLocations = () => {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        console.log("hell world")
        axios.get('https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/locations/215', { "headers": headers }).then(response => {
            console.log("pickupLocations==" + response.data.data)
            setPickupLocations(response.data.data);
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        getPickupLocations();
    }, []);

    return (
        <div className="pickup-locations">
            <div className='pickup-head'>
                <button className="submit-btn" variant="primary" onClick={() => setShowModal(true)}>
                    Add New Location
                </button>
            </div>
            <Modal showModal={showModal} width="60%" >
                <AddLocation setShowModal={setShowModal} />
            </Modal>
            <div className="pickup-locations-table">
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Suburb, Postcode, State</th>
                        <th>Tags</th>
                        <th>Free Shipping Postcodes</th>
                        <th>Default</th>
                        <th>Actions</th>
                    </tr>
                </table>
            </div>
        </div>
    );
}