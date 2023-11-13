import axios from 'axios';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import "./style.css";
import { useState, useEffect } from "react";

export function AddLocation(props) {
    const [locationName, setLocationName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [buildingType, setBuildingType] = useState("");
    const [timeWindow, setTimeWindow] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedPostcode, setSelectedPostcode] = useState("");
    const [selectedSuburb, setSelectedSuburb] = useState("");
    const [suburbs, setSuburbs] = useState([]);
    const animatedComponents = makeAnimated();

    const buildingTypes = [{
        "value": "residential", "label": "Residential"
    }, {
        "value": "commercial", "label": "Commercial"
    }]

    const timeWindowList = [{
        "value": "9am to 5pm", "label": "9am to 5pm"
    }, {
        "value": "12pm to 5pm", "label": "12pm to 5pm"
    }]

    const tags = [];
    const freeShippingPoscodes = [];

    const getSuburbs = () => {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get('https://fctest-api.fastcourier.com.au/api/wp/suburbs', { "headers": headers }).then(response => {
            var suburbData = [];
            response.data.data.forEach(element => {
                var suburb = { "value": element.name + ', ' + element.postcode + " (" + element.state + ")", label: element.name + ', ' + element.postcode + "(" + element.state + ")" };
                suburbData.push(suburb);
            });

            setSuburbs(suburbData);
        }).catch(error => {
            console.log(error);
        })
    }

    const addLocation = () => {
        const accessToken = localStorage.getItem("accessToken");
        const payload = {
            "name": locationName,
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phoneNumber,
            "address1": address1,
            "address2": address2,
            "building_type": buildingType,
            "time_window": timeWindow,
            "suburb": selectedSuburb,
            "state": selectedState,
            "postcode": selectedPostcode,
            "is_default": "1",
            "tags": tags,
            "free_shipping_postcodes": freeShippingPoscodes,
            "action": "add_location",
        }
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.post('https://fctest-api.fastcourier.com.au/api/wp//merchant_domain/locations/add', payload, { "headers": headers }).then(response => {
            console.log(response.data.merchant);
            props.setActiveNavItem("paymentMethods");
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        // getMerchantDetails();
        getSuburbs();
    }, []);
    return (
        <div className="add-location-modal">
            <div className="modal-header">
                <div className="header-text">
                    New Location
                </div>
            </div>
            <div className="modal-body">
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Location Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Location Name"  value={locationName} onChange={(e)=> setLocationName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> First Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="First Name" value={firstName} onChange={(e)=> setFirstName(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Last Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Last Name" value={lastName} onChange={(e)=> setLastName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Phone Number&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e)=> setPhoneNumber(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Address 1&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Address 1" value={address1} onChange={(e)=> setAddress1(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Address 2&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Address 2" value={address2} onChange={(e)=> setAddress2(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Building Type&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        {/* <div className="input-field">
                            <input className="input-field-text1" type="text" />
                        </div> */}
                        <Select options={buildingTypes} onChange={(e) => setBuildingType(e.value)} />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Time Window&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        {/* <div className="input-field">
                            <input className="input-field-text1" type="text" />
                        </div> */}
                        <Select options={timeWindowList} onChange={(e) => setTimeWindow(e.value)}/>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Suburb, Postcode, State</span><span style={{ color: "red" }}> *</span>
                        </div>
                        {/* <div className="input-field">
                            <input className="input-field-text1" type="text" />
                        </div> */}
                        <Select options={suburbs} onChange={(e) => {
                            const [, extractedCity, extractedPostcode, extractedState] = e.value.match(/^(.*), (\d+) \((.*)\)$/);
                            console.log("suburb==" + e.value);
                            // Set the values to the state variables
                            setSelectedSuburb(extractedCity);
                            setSelectedPostcode(extractedPostcode);
                            setSelectedState(extractedState);
                        }} />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Default&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" disabled value={"Yes"} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Tag&nbsp;</span>
                        </div>
                        {/* <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Select or add tags" />
                        </div> */}
                        <CreatableSelect closeMenuOnSelect={false}
                            isMulti
                            options={tags} />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Free Shipping Area Postcodes&nbsp;</span>
                        </div>
                        {/* <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Select or add postcode" />
                        </div> */}
                        <CreatableSelect closeMenuOnSelect={false}
                            isMulti
                            options={freeShippingPoscodes} />
                    </div>
                </div>
                <div className="choose-file-row">
                    <div className="input-field">
                        <input type="file" className="choose-file" />
                    </div>
                    <div className="sample-download">
                        <a href="http://fc-new.vuwork.com/wp-content/plugins/fast-courier-shipping-freight/views/sample/sample.csv" download={true} > Sample CSV </a>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button className="cancel-btn" variant="primary" onClick={() => props.setShowModal(false)}>
                    Close
                </button>
                <button className="submit-btn" variant="primary" onClick={() => addLocation()}>
                    Submit
                </button>
            </div>
        </div>
    );
}