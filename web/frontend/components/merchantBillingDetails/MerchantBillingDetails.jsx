import { useEffect, useState } from "react";
import axios from 'axios';
import Select from 'react-select';
import "./style.css";

export function MerchantBillingDetails(props) {
    const [billingFirstName, setBillingFirstName] = useState(props.userDetails?.billing_first_name ?? "");
    const [billingLastName, setBillingLastName] = useState(props.userDetails?.billing_last_name ?? "");
    const [billingCompanyName, setBillingCompanyName] = useState(props.userDetails?.billing_company_name ?? "");
    const [billingPhone, setBillingPhone] = useState(props.userDetails?.billing_phone ?? "");
    const [billingEmail, setBillingEmail] = useState(props.userDetails?.billing_email ?? "");
    const [billingAbn, setBillingAbn] = useState(props.userDetails?.abn ?? "");
    const [billingAddress1, setBillingAddress1] = useState(props.userDetails?.billing_address_1 ?? "");
    const [billingAddress2, setBillingAddress2] = useState(props.userDetails?.billing_address_2 ?? "");
    const [billingState, setBillingState] = useState(props.userDetails?.billing_state ?? "");
    const [billingPostcode, setBillingPostcode] = useState(props.userDetails?.billing_postcode ?? "");
    const [billingSuburb, setBillingSuburb] = useState(props.userDetails?.billing_suburb ?? "");
    const [bookingPreference, setBookingPreference] = useState(props.userDetails?.booking_preference ?? "");
    const [fallbackAmount, setFallbackAmount] = useState(props.userDetails?.fallback_amount ?? "");
    const [insuranceType, setInsuranceType] = useState(props.userDetails?.insurance_type ?? "");
    const [isInsurancePaidByCustomer, setIsInsurancePaidByCustomer] = useState(props.userDetails?.is_insurance_paid_by_customer ?? 0);
    const [automaticOrderProcess, setAutomaticOrderProcess] = useState(0);
    const [conditionalValue, setConditionalValue] = useState(props.userDetails?.conditional_price ?? "");
    const [insuranceAmount, setInsuranceAmount] = useState(props.userDetails?.insurance_amount ?? "");
    const [processAfterMinutes, setProcessAfterMinutes] = useState(60);
    const [processAfterDays, setProcessAfterDays] = useState(0);
    const [suburbs, setSuburbs] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [activeCouriers, setActiveCouriers] = useState([]);

    const getMerchantDetails = () => {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get('https://fctest-api.fastcourier.com.au/api/wp/get_merchant', { "headers": headers }).then(response => {
            console.log("getmerchant==" + response.data.merchant);
            // props.setUserDetails(response.data.merchant);
            // localStorage.setItem("isLoggedIn", true);
            // localStorage.setItem("accessToken", response.data.merchant.access_token);
            // navigate('/homepage');
        }).catch(error => {
            console.log(error);
        })
    }

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

    const getCouriers = () => {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        console.log("hell world")
        axios.get('https://fctest-api.fastcourier.com.au/api/wp/couriers', { "headers": headers }).then(response => {
            setCouriers(response.data.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const activateMerchant = () => {
        // const accessToken = localStorage.getItem("accessToken");
        // const payload = {
        //     "billingFirstName": billingFirstName,
        //     "billingLastName": billingLastName,
        //     "billingCompanyName": billingCompanyName,
        //     "billingPhone": billingPhone,
        //     "billingEmail": billingEmail,
        //     "abn": billingAbn,
        //     "packageType": "box",
        //     "billingAddress1": billingAddress1,
        //     "billingAddress2": billingAddress2,
        //     "billingSuburb": billingSuburb,
        //     "billingState": billingState,
        //     "billingPostcode": billingPostcode,
        //     "conditionalPrice": conditionalValue,
        //     "courierPreferences": activeCouriers,
        //     "bookingPreference": bookingPreference,
        //     "isInsurancePaidByCustomer": isInsurancePaidByCustomer ? 1 : 0,
        //     "fallbackAmount": fallbackAmount,
        //     "insuranceType": insuranceType,
        //     "insuranceAmount": insuranceAmount,
        //     "processAfterMinutes": processAfterMinutes,
        //     "processAfterDays": processAfterDays,
        //     "automaticOrderProcess": automaticOrderProcess,
        //     "action": "post_activate_mechant",
        //     "paymentMethod": "pm_1O9jNICodfiDzZhka9lcNse4",
        // }
        // const headers = {
        //     "Accept": "application/json",
        //     "Content-Type": "application/json",
        //     "request-type": "shopify_development",
        //     "version": "3.1.1",
        //     "Authorization": "Bearer " + accessToken
        // }
        // axios.post('https://fctest-api.fastcourier.com.au/api/wp/activate', payload, { "headers": headers }).then(response => {
        //     console.log(response.data.merchant);
        //     props.setActiveNavItem("paymentMethods");
        // }).catch(error => {
        //     console.log(error);
        // })
        props.setActiveNavItem("paymentMethods");
    }

    const handleCourierChange = (e) => {
        const isChecked = e.target.checked;
        var courierIds = couriers.map((element) => element.id);
        if (isChecked) {
            if (!courierIds.includes(e.target.value)) {
                courierIds.push(e.target.value);
            }
        } else {
            courierIds.filter(item => item !== e.target.value);
        }

        setActiveCouriers(courierIds);
        console.log("courierIds ==" + courierIds);
    }


    useEffect(() => {
        // getMerchantDetails();
        getCouriers();
        getSuburbs();
    }, []);

    return (
        <div className="merchant-main">
            <div className="merchant-heading1">
                Merchant Billing Details
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> First Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingFirstName} placeholder="First Name" onChange={(e) => setBillingFirstName(e.target.value)} />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Last Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingLastName} placeholder="Last Name" onChange={(e) => setBillingLastName(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Company Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingCompanyName} placeholder="Company Name" onChange={(e) => setBillingCompanyName(e.target.value)} />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Contact Phone Number&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingPhone} placeholder="Contact Phone Number" onChange={(e) => setBillingPhone(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingEmail} placeholder="Email" onChange={(e) => setBillingEmail(e.target.value)} />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> ABN&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingAbn} placeholder="ABN" onChange={(e) => setBillingAbn(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Address 1&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingAddress1} placeholder="Address 1" onChange={(e) => setBillingAddress1(e.target.value)} />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Address 2</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={billingAddress2} placeholder="Address 2" onChange={(e) => setBillingAddress2(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Suburb&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    {/* <div className="input-field"> */}
                    {/* <input className="input-field-text1" type="text" value={billingAddress2} placeholder="Suburb" /> */}
                    <Select options={suburbs} onChange={(e) => {
                        const [, extractedCity, extractedPostcode, extractedState] = e.value.match(/^(.*), (\d+) \((.*)\)$/);
                        console.log("suburb==" + e.value);
                        // Set the values to the state variables
                        setBillingSuburb(extractedCity);
                        setBillingPostcode(extractedPostcode);
                        setBillingState(extractedState);
                    }} />
                    {/* </div> */}
                </div>
            </div>
            <div className="shipping-config">
                <div className="shipping-left">
                    <div className="merchant-heading1">
                        Shipping Configuration
                    </div>
                    <div className="shipping-label">
                        <span> Set your shipping costs preferences&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-radio">
                        <input type="radio" name="bookingPreference" id="freeForAllOrders" value="free_for_all_orders" checked={bookingPreference == "free_for_all_orders"} onChange={(e) => setBookingPreference(e.target.value)} />
                        <label htmlFor="freeForAllOrders">&nbsp;Free For All orders</label>
                    </div>
                    <div className="input-radio">
                        <input type="radio" name="bookingPreference" id="freeForBasketValue" value="free_for_basket_value_total" checked={bookingPreference == "free_for_basket_value_total"} onChange={(e) => setBookingPreference(e.target.value)} />
                        <label htmlFor="freeForBasketValue">&nbsp;Free for Orders with Prices </label>
                        {
                            bookingPreference == "free_for_basket_value_total" &&
                            <span className="conditional-price">
                                {"> "}<input type="type" name="conditionalPrice" className="input-field-text1" value={conditionalValue} onChange={(e) => setConditionalValue(e.target.value)} />
                            </span>
                        }
                    </div>
                    <div className="input-radio">
                        <input type="radio" name="bookingPreference" id="notFree" value="shipping_cost_passed_on_to_customer" checked={bookingPreference == "shipping_cost_passed_on_to_customer"} onChange={(e) => setBookingPreference(e.target.value)} />
                        <label htmlFor="notFree">&nbsp;All Shipping Costs Passed on to Customer</label>
                    </div>
                </div>
                <div className="shipping-right">
                    <div className="shipping-label">
                        <span> Fallback Shipping Amount&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="shipping-label1">
                        <span> On occasions where no carrier can be found set a default shipping price&nbsp;</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" value={fallbackAmount} onChange={(e) => setFallbackAmount(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="courier-preference">
                <div className="merchant-heading1">
                    Courier Preferences
                </div>
                <div className="shipping-label">
                    <span> Active Couriers&nbsp;</span><span style={{ color: "red" }}> *</span>
                </div>
                <div className="courier-preference-items">
                    {couriers.map((courier, i) => {
                        return <div className="input-checkbox">
                            <input type="checkbox" name="courierPlease" id="courierPlease" value={courier.id} onChange={(e) => handleCourierChange(e)} />
                            <label htmlFor="courierPlease">&nbsp;{courier.name}</label>
                        </div>
                    })}
                    {/* <div className="input-checkbox">
                        <input type="checkbox" name="starTrack" id="starTrack" />
                        <label htmlFor="starTrack">&nbsp;Star Track</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="tnt" id="tnt" />
                        <label htmlFor="tnt">&nbsp;TNT</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="alliedExpress" id="alliedExpress" />
                        <label htmlFor="alliedExpress">&nbsp;AlliedExpress</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="Aramex" id="Aramex" />
                        <label htmlFor="Aramex">&nbsp;Aramex</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="hunterExpress" id="hunterExpress" />
                        <label htmlFor="hunterExpress">&nbsp;Hunter Express</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="directCouriers" id="directCouriers" />
                        <label htmlFor="directCouriers">&nbsp;Direct Couriers</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="alphaFreight" id="alphaFreight" />
                        <label htmlFor="alphaFreight">&nbsp;Alpha Freight</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="Northline" id="Northline" />
                        <label htmlFor="Northline">&nbsp;Northline</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="ctiLogistics" id="ctiLogistics" />
                        <label htmlFor="ctiLogistics">&nbsp;CTI Logistics Regional Freight</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="felixTranspot" id="felixTranspot" />
                        <label htmlFor="felixTranspot">&nbsp;Felix Transport</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="capitalTransport" id="capitalTransport" />
                        <label htmlFor="capitalTransport">&nbsp;Capital Transport</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="NorthlineExpress" id="NorthlineExpress" />
                        <label htmlFor="NorthlineExpress">&nbsp;Northline Express</label>
                    </div> */}
                </div>
            </div>
            <div className="insurance-preferences">
                <div className="merchant-heading1">
                    Insurance Preferences
                </div>
                <div className="shipping-label">
                    <span> Insurance Types&nbsp;</span><span style={{ color: "red" }}> *</span>
                </div>
                <div className="input-radio">
                    <input type="radio" name="insuranceType" id="notRequired" value="1" onChange={(e) => setInsuranceType(e.target.value)} checked={insuranceType == "1"} />
                    <label htmlFor="notRequired">&nbsp;Complimentary Coverage - No Additional Charge</label>
                </div>
                <div className="input-radio">
                    <input type="radio" name="insuranceType" id="requiredUpto" value="2" onChange={(e) => setInsuranceType(e.target.value)} checked={insuranceType == "2"} />
                    <label htmlFor="requiredUpto">&nbsp;Transit Insurance Coverage up to $</label>
                    {
                        insuranceType == 2 &&
                        <span className="conditional-price">
                            {"> "}<input type="type" name="insuranceAmount" className="input-field-text1" value={insuranceAmount} onChange={(e) => setInsuranceAmount(e.target.value)} />
                        </span>
                    }
                </div>
                <div className="input-radio">
                    <input type="radio" name="insuranceType" id="fullCartValue" value="3" onChange={(e) => setInsuranceType(e.target.value)} checked={insuranceType == "3"} />
                    <label htmlFor="fullCartValue">&nbsp;Full Insurance Coverage of Shipment Value (Max. $10,000 AUD)</label>
                </div>
                <div className="input-checkbox">
                    <input type="checkbox" name="isInsurancePaidByCustomer" id="isInsurancePaidByCustomer" onChange={(e) => setIsInsurancePaidByCustomer(e.target.checked)} />
                    <label htmlFor="isInsurancePaidByCustomer">&nbsp;Insurance cost passed onto customer</label>
                </div>
            </div>
            <div className="settings">
                <div className="merchant-heading1">
                    Settings
                </div>
                <div className="shipping-label">
                    <span> Order processing&nbsp;</span><span style={{ color: "red" }}> *</span>
                </div>
                <div className="input-radio">
                    <input type="radio" name="automaticOrderProcess" id="auto" value="1" checked={automaticOrderProcess == 1} onChange={(e) => setAutomaticOrderProcess(e.target.value)} />
                    <label htmlFor="auto">&nbsp;Auto</label>
                    {
                        automaticOrderProcess == "1" &&
                        <span className="conditional-price">
                            {" > "}<input type="type" name="processAfterMinutes" className="input-field-text1" value={processAfterMinutes} onChange={(e) => setProcessAfterMinutes(e.target.value)} /> <span>minutes</span>
                        </span>
                    }
                </div>
                <div className="input-radio">
                    <input type="radio" name="automaticOrderProcess" id="manual" value="0" checked={automaticOrderProcess == 0} onChange={(e) => setAutomaticOrderProcess(e.target.value)} />
                    <label htmlFor="manual">&nbsp;Manual</label>
                </div>
            </div>
            <div className="submit">
                <button className="submit-btn" variant="primary" onClick={() => activateMerchant()}>
                    Save details
                </button>
            </div>
        </div>
    );
}