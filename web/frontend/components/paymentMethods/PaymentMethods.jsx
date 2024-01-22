import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import "./style.css";
import { useEffect, useState } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { Loader } from "../loader";

export function PaymentMethods(props) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState("");
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
        // props.setActiveNavItem("pickupLocations");

        try {
            const response = await fetch('/api/carrier-service/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package_name: "Fast Courier",
                }),
            });
            const data = await response.json();
            console.log("carrier", data);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }

    }

    const getPaymentMethods = () => {
        const accessToken = localStorage.getItem("accessToken");
        setIsLoading(true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get('https://fctest-api.fastcourier.com.au/api/wp/payment_method', { "headers": headers }).then(response => {
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