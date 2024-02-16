import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import "./style.css";
import { useEffect, useState } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { Loader } from "../loader";

export function PaymentMethods(props) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvc, setCvc] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetch = useAuthenticatedFetch();


    // const carriers = useAppQuery({
    //     url: "/api/carrier-services",
    //     reactQueryOptions: {
    //         onSuccess: () => {
    //             setIsLoading(false);
    //         },
    //     },
    // });


    // console.log("carriers", carriers);

    const savePaymentMethod = async () => {
        props.setActiveNavItem("pickupLocations");

        // try {
        //     const response = await fetch('/api/carrier-service/update', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             package_name: "Fast Courier",
        //         }),
        //     });
        //     const data = await response.json();
        //     console.log("carrier", data);
        // } catch (err) {
        //     setIsLoading(false);
        //     console.log(err);
        // }

    }

    const addPaymentMethod = () => {
        const accessToken = localStorage.getItem("accessToken");
        setIsLoading(true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": process.env.REQUEST_TYPE,
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }

        const payload = {
            "numer": cardNumber,
            "exp_month": expiryMonth,
            "exp_year": expiryYear,
            "cvc": cvc,
            "email": email,
            "name": name,
            "company": companyName,
        }
        axios.post(`${process.env.API_ENDPOINT}/api/wp/payment_method`, payload, { "headers": headers }).then(response => {
            setPaymentMethods(response.data.data);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    const getPaymentMethods = () => {
        const accessToken = localStorage.getItem("accessToken");
        setIsLoading(true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": process.env.REQUEST_TYPE,
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get(`${process.env.API_ENDPOINT}/api/wp/payment_method`, { "headers": headers }).then(response => {
            setPaymentMethods(response.data.data);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }


    // const getShippingRates = () => {
    //     const payload = {
    //         "name": "Fast Courier"
    //     }
    //     const headers = {
    //         'Content-Type': 'application/json',
    //     }
    //     axios.get('https://generators-scene-afghanistan-ice.trycloudflare.com/api/shipping-rates').then(response => {
    //         console.log("shipping-rates", response)
    //     }).catch(error => {
    //         setIsLoading(false);
    //         console.log(error);
    //     })
    // }



    useEffect(() => {
        getPaymentMethods();
        // getShippingRates();
    }, []);
    return (
        <div className="payment-methods">
            {isLoading && <Loader />}
            <div className='add-payment-methods'>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Card Number&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" value={cardNumber} placeholder="Card Number" onChange={(e) => setCardNumber(e.target.value)} />
                        </div>
                    </div>
                    <div className='expiry-section'>
                        <div className="input-container1">
                            <div className="input-lebel1">
                                <span> Expiry Month&nbsp;</span><span style={{ color: "red" }}> *</span>
                            </div>
                            <div className="input-field">
                                <input className="input-field-text1" type="text" value={expiryMonth} placeholder="MM" onChange={(e) => setExpiryMonth(e.target.value)} />
                            </div>
                        </div>
                        <div className="input-container1">
                            <div className="input-lebel1">
                                <span> Expiry Year&nbsp;</span><span style={{ color: "red" }}> *</span>
                            </div>
                            <div className="input-field">
                                <input className="input-field-text1" type="text" value={name} placeholder="YY" onChange={(e) => setExpiryYear(e.target.value)} />
                            </div>
                        </div>
                        <div className="input-container1">
                            <div className="input-lebel1">
                                <span> CVC&nbsp;</span><span style={{ color: "red" }}> *</span>
                            </div>
                            <div className="input-field">
                                <input className="input-field-text1" type="text" value={cvc} placeholder="CVC" onChange={(e) => setCvc(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container1">
                        <div className="input-lebel1">
                            <span> Company Name&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text1" type="text" value={companyName} placeholder="Company Name" onChange={(e) => setCompanyName(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="submit">
                    <button className="submit-btn" onClick={() => addPaymentMethod()}>
                        Add New Card
                    </button>
                </div>
            </div>
            <div className="pickup-locations-table">
                <table>
                    <tr className="table-head">
                        <th>Payment Method</th>
                        <th>Card Number</th>
                        <th>Expiry</th>
                        <th>Actions</th>
                    </tr>
                    {paymentMethods.map((method, i) => {
                        return <tr className='products-row' style={{ background: i % 2 != 0 ? "#F5F8FA" : "#FFFFFF" }}>
                            <td width="25%">{method?.brand}</td>
                            <td width="25%">{"XXXX XXXX XXXX " + method?.last4}</td>
                            <td width="25%">{method?.exp_month + " / " + method?.exp_year}</td>
                            <td width="25%"></td>
                        </tr>
                    })}
                </table>
            </div>
            <div className="payment-heading">
                Payment Methods<span style={{ color: "red" }}> *</span>
            </div>
            <div className="payment-container">
                {paymentMethods.map((method, i) => {
                    return <div className="payment-card">
                        <div className="payment-item-left">
                            <div className="input-radio">
                                <input type="radio" name="paymentMethod" value={method.card_id} onChange={() => setSelectedMethod(e.target.value)} checked />
                            </div>
                            {method.brand == "visa" &&
                                <FontAwesomeIcon icon="fa-brands fa-cc-visa" />
                            }
                        </div>
                        <div className="payment-item-right">
                            <div className='card-number'>
                                XXXX XXXX XXXX {method.last4}
                            </div>
                            <div className='card-details'>
                                <div className='card-name'>
                                    {method.brand}
                                </div>
                                <div className='card-expiry'>
                                    Exp: {method.exp_month}/{method.exp_year}
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>

            <div className="submit">
                <button className="submit-btn" onClick={() => savePaymentMethod()}>
                    Save details
                </button>
            </div>
        </div>
    );
}