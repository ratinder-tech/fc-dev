import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import "./style.css";
import { Modal } from '../modal';
import { useState, useEffect } from 'react';
import { AddLocation } from '../addLocation';
import { Loader } from '../loader';
import { ConfirmModal } from '../confirmModal';

export function PickupLocations(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [pickupLocations, setPickupLocations] = useState([]);


    const getPickupLocations = () => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const merchantDomainId = localStorage.getItem("merchantDomainId");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get(`https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/locations/${merchantDomainId}`, { "headers": headers }).then(response => {
            setIsLoading(false);
            setPickupLocations(response.data.data);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    const deleteLocation = (id) => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        const payload = {};
        axios.post(`https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/location/delete/${id}`, payload, { "headers": headers }).then(response => {
            setShowDeleteModal(false);
            getPickupLocations();
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    useEffect(() => {
        getPickupLocations();
    }, []);

    return (
        <div className="pickup-locations">
            {isLoading && <Loader />}
            <div className='pickup-head'>
                <button className="submit-btn" onClick={() => setShowModal(true)}>
                    Add New Location
                </button>
            </div>
            <Modal showModal={showModal} width="60%" >
                <AddLocation setShowModal={setShowModal} getPickupLocations={getPickupLocations} {...props} />
            </Modal>

            <div className="pickup-locations-table">
                <table>
                    <tr className='table-head'>
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
                    {pickupLocations.length > 0 && pickupLocations.map((element, i) => {
                        return <tr className='locations' key={i} style={{ background: i % 2 != 0 ? "#F5F8FA" : "#FFFFFF" }}>
                            <td>{element.id}</td>
                            <td>{element.location_name}</td>
                            <td>{element.phone}</td>
                            <td>{element.email}</td>
                            <td>{element.suburb}, {element.postcode}, {element.state}</td>
                            <td>{element.tag}</td>
                            <td>{element.free_shipping_postcodes}</td>
                            <td>{element.is_default == 1 ? "Yes" : "No"}</td>
                            <td className='location-actions'>
                                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" size='2xs' onClick={() => setShowEditModal(true)} />
                                <FontAwesomeIcon icon="fa-solid fa-trash-can" size='2xs' onClick={() => setShowDeleteModal(true)} />
                                <Modal showModal={showEditModal} width="60%" >
                                    <AddLocation setShowModal={setShowEditModal} getPickupLocations={getPickupLocations} editLocation={element} {...props} />
                                </Modal>
                                <ConfirmModal showModal={showDeleteModal} message="You want to delete location." onConfirm={() => deleteLocation(element.id)} onCancel={() => setShowDeleteModal(false)} />
                            </td>
                        </tr>
                    })}
                </table>
            </div>
        </div>
    );
}