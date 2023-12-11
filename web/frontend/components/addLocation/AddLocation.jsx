import axios from 'axios';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import "./style.css";
import { useState, useEffect } from "react";
import { Loader } from '../loader';

export function AddLocation(props) {
    const [isLoading, setIsLoading] = useState(false);
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
    const [tailLift, setTailLift] = useState("");
    const [suburbs, setSuburbs] = useState([]);
    const [tags, setTags] = useState([]);
    const [merchantTags, setMerchantTags] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [freeShippingPoscodes, setFreeShippingPoscodes] = useState([]);
    const [freeShippingPoscodeOptions, setFreeShippingPoscodeOptions] = useState([]);
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [suburbData, setSuburbData] = useState([]);

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

    const tailLiftList = [{
        "value": "0", "label": "No"
    },
    {
        "value": "1", "label": "Yes"
    }]

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
            setSuburbData(response.data.data)
            var suburbList = [];
            response.data.data.forEach(element => {
                var suburb = { "value": element.name + ', ' + element.postcode + " (" + element.state + ")", label: element.name + ', ' + element.postcode + "(" + element.state + ")" };
                suburbList.push(suburb);
            });

            setSuburbs(suburbList);
        }).catch(error => {
            console.log(error);
        })
    }

    const addLocation = () => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const merchantDomainId = localStorage.getItem("merchantDomainId");
        const payload = {
            "location_name": locationName,
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
            "tag": tags,
            "free_shipping_postcodes": null,
            "merchant_domain_id": merchantDomainId,
            "tail_lift": tailLift,
            "longitude": "144.956776",
            "latitude": "-37.817403",
        }
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }

        const url = props.editLocation ? `https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/location/edit/${props.editLocation.id}` : "https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/locations/add";
        axios.post(url, payload, { "headers": headers }).then(response => {
            props.getPickupLocations();
            props.setShowModal(false);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    const setEditLocationData = (location) => {
        setLocationName(location.location_name);
        setFirstName(location.first_name);
        setLastName(location.last_name);
        setEmail(location.email);
        setAddress1(location.address1);
        setAddress2(location.address2);
        setPhoneNumber(location.phone);
        setBuildingType(location.building_type);
        setTimeWindow(location.time_window);
        setSelectedState(location.state);
        setSelectedPostcode(location.postcode);
        setSelectedSuburb(location.suburb);
        setTailLift(location.tail_lift);
        // setTags(location.tags);
        // setFreeShippingPoscodes(location.free_shipping_postcodes);
        setLongitude(location.longitude);
        setLatitude(location.latitude);
        // setSelectedSuburbValue(location.suburb + ', ' + location.postcode + " (" + location.state + ")");
    }

    const getDefaultBuildingType = () => {
        var defaultValue = props.editLocation ? {
            "value": props.editLocation.building_type, "label": props.editLocation.building_type[0].toUpperCase() +
                props.editLocation.building_type.slice(1)
        } : {
            "value": "residential", "label": "Residential"
        }

        return defaultValue;
    }

    const getDefaultTimeWindow = () => {
        var defaultValue = props.editLocation ? {
            "value": props.editLocation.time_window, "label": props.editLocation.time_window
        } : {
            "value": "9am to 5pm", "label": "9am to 5pm"
        }

        return defaultValue;
    }

    const getDefaultTailLift = () => {
        var defaultValue = props.editLocation ? {
            "value": props.editLocation.tail_lift, "label": props.editLocation.tail_lift == 0 ? "No" : "Yes"
        } : {
            "value": "0", "label": "No"
        }

        return defaultValue;
    }

    const getDefaultSuburbValue = () => {
        var defaultValue = props.editLocation ?
            { "value": props.editLocation.suburb + ', ' + props.editLocation.postcode + " (" + props.editLocation.state + ")", label: props.editLocation.suburb + ', ' + props.editLocation.postcode + "(" + props.editLocation.state + ")" }
            : null;

        return defaultValue;
    }

    const getDefaultTags = () => {
        var tagsValue = merchantTags.find((element) => element.id = props.editLocation.tags);
    }

    const getMerchantTags = () => {
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
        axios.get(`https://fctest-api.fastcourier.com.au/api/wp/merchant_location_tags/${merchantDomainId}`, { "headers": headers }).then(response => {
            setIsLoading(false);
            // setPickupLocations(response.data.data);
            setMerchantTags(response.data.data);
            var tagsValue = [];
            response.data.data.map((element) => {
                var item = { "value": element.name, "label": element.name };
                tagsValue.push(item);
            })
            setTagOptions(tagsValue);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    const handleTagChange = (value) => {
        var tagsValue = tags.filter((element) => element != value);
        setTags(tagsValue);
        setTagOptions(value);
    }

    const handleTagCreate = (value) => {
        const newOption = { "value": value, "label": value };
        setTags([...tags, value]);
        setTagOptions([...tagOptions, newOption]);
    }

    const handleShippingCodesChange = (value) => {
        var shippingCodeValue = freeShippingPoscodes.filter((element) => element != value);
        setFreeShippingPoscodes(shippingCodeValue);
        setFreeShippingPoscodeOptions(value);
    }

    const handleShippingCodesCreate = (value) => {
        const newOption = { "value": value, "label": value };
        setFreeShippingPoscodes([...freeShippingPoscodes, value]);
        setFreeShippingPoscodeOptions([...freeShippingPoscodeOptions, newOption]);
    }

    useEffect(() => {
        getSuburbs();
        getMerchantTags();
        // getDefaultTags();
        if (props.editLocation) {
            setEditLocationData(props.editLocation);
        }
    }, []);
    return (
        <div className="add-location-modal">
            {isLoading && <Loader />}
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
                            <input className="input-field-text1" type="text" placeholder="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> First Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Last Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Phone Number&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Address 1&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Address 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Address 2&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" placeholder="Address 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Building Type&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <Select options={buildingTypes} onChange={(e) => setBuildingType(e.value)} defaultValue={getDefaultBuildingType()} />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Time Window&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <Select options={timeWindowList} onChange={(e) => setTimeWindow(e.value)} defaultValue={getDefaultTimeWindow()} />
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Suburb, Postcode, State</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <Select options={suburbs} onChange={(e) => {
                            const [, extractedCity, extractedPostcode, extractedState] = e.value.match(/^(.*), (\d+) \((.*)\)$/);
                            setSelectedSuburb(extractedCity);
                            setSelectedPostcode(extractedPostcode);
                            setSelectedState(extractedState);
                            var element = suburbData.map((element) => element.postcode == extractedPostcode)
                            setLongitude(element.longitude);
                            setLatitude(element.latitude);
                        }} defaultValue={getDefaultSuburbValue()} />
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
                        <CreatableSelect
                            isClearable
                            isMulti
                            options={tagOptions}
                            value={tagOptions}
                            // defaultValue={getDefaultTags()}
                            onCreateOption={(value) => handleTagCreate(value)}
                            onChange={(value) => handleTagChange(value)}
                        />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Free Shipping Area Postcodes&nbsp;</span>
                        </div>
                        <CreatableSelect closeMenuOnSelect={false}
                            isMulti
                            options={freeShippingPoscodeOptions}
                            value={freeShippingPoscodeOptions}
                            onCreateOption={(value) => handleShippingCodesCreate(value)}
                            onChange={(value) => handleShippingCodesChange(value)}
                        />
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Tail Lift&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <Select options={tailLiftList} onChange={(e) => setTailLift(e.value)} defaultValue={getDefaultTailLift()} />
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
                <button className="cancel-btn" onClick={() => props.setShowModal(false)}>
                    Close
                </button>
                <button className="submit-btn" onClick={() => addLocation()}>
                    Submit
                </button>
            </div>
        </div>
    );
}