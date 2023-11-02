import { Link } from "react-router-dom";
import "./style.css";

export function MerchantBillingDetails() {
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
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Last Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Company Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Contact Phone Number&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> ABN&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Address 1&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Address 2</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
                </div>
            </div>
            <div className="input-row">
                <div className="input-container1">
                    <div className="input-lebel1">
                        <span> Suburb&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text1" type="text" />
                    </div>
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
                        <input type="radio" name="bookingPreference" id="freeForAllOrders" />
                        <label for="freeForAllOrders">&nbsp;Free For All orders</label>
                    </div>
                    <div className="input-radio">
                        <input type="radio" name="bookingPreference" id="freeForBasketValue" />
                        <label for="freeForBasketValue">&nbsp;Free for Orders with Prices {"> "}</label>
                        <span className="conditional-price">
                            <input type="type" name="conditionalPrice" id="freeForBasketValue" className="input-field-text1" />
                        </span>
                    </div>
                    <div className="input-radio">
                        <input type="radio" name="bookingPreference" id="notFree" />
                        <label for="notFree">&nbsp;All Shipping Costs Passed on to Customer</label>
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
                        <input className="input-field-text1" type="text" />
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
                    <div className="input-checkbox">
                        <input type="checkbox" name="courierPlease" id="courierPlease" />
                        <label for="courierPlease">&nbsp;Couriers Please</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="starTrack" id="starTrack" />
                        <label for="starTrack">&nbsp;Star Track</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="tnt" id="tnt" />
                        <label for="tnt">&nbsp;TNT</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="alliedExpress" id="alliedExpress" />
                        <label for="alliedExpress">&nbsp;AlliedExpress</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="Aramex" id="Aramex" />
                        <label for="Aramex">&nbsp;Aramex</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="hunterExpress" id="hunterExpress" />
                        <label for="hunterExpress">&nbsp;Hunter Express</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="directCouriers" id="directCouriers" />
                        <label for="directCouriers">&nbsp;Direct Couriers</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="alphaFreight" id="alphaFreight" />
                        <label for="alphaFreight">&nbsp;Alpha Freight</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="Northline" id="Northline" />
                        <label for="Northline">&nbsp;Northline</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="ctiLogistics" id="ctiLogistics" />
                        <label for="ctiLogistics">&nbsp;CTI Logistics Regional Freight</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="felixTranspot" id="felixTranspot" />
                        <label for="felixTranspot">&nbsp;Felix Transport</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="capitalTransport" id="capitalTransport" />
                        <label for="capitalTransport">&nbsp;Capital Transport</label>
                    </div>
                    <div className="input-checkbox">
                        <input type="checkbox" name="NorthlineExpress" id="NorthlineExpress" />
                        <label for="NorthlineExpress">&nbsp;Northline Express</label>
                    </div>
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
                    <input type="radio" name="insuranceType" id="notRequired" />
                    <label for="notRequired">&nbsp;Complimentary Coverage - No Additional Charge</label>
                </div>
                <div className="input-radio">
                    <input type="radio" name="insuranceType" id="requiredUpto" />
                    <label for="requiredUpto">&nbsp;Transit Insurance Coverage up to $</label>
                </div>
                <div className="input-radio">
                    <input type="radio" name="insuranceType" id="requiredUpto" />
                    <label for="requiredUpto">&nbsp;Full Insurance Coverage of Shipment Value (Max. $10,000 AUD)</label>
                </div>
                <div className="input-checkbox">
                    <input type="checkbox" name="isInsurancePaidByCustomer" id="isInsurancePaidByCustomer" />
                    <label for="isInsurancePaidByCustomer">&nbsp;Insurance cost passed onto customer</label>
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
                    <input type="radio" name="automaticOrderProcess" id="auto" />
                    <label for="auto">&nbsp;Auto</label>
                </div>
                <div className="input-radio">
                    <input type="radio" name="automaticOrderProcess" id="manual" />
                    <label for="manual">&nbsp;Manual</label>
                </div>
            </div>
            <div className="submit">
                <button className="submit-btn" variant="primary">
                    Save details
                </button>
            </div>
        </div>
    );
}