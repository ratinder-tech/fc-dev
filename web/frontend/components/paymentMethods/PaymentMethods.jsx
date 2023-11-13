import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import "./style.css";
import { useEffect, useState } from 'react';

export function PaymentMethods(props) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState("");

    const savePaymentMethod=()=> {
        props.setActiveNavItem("pickupLocations");
    }

    const getPaymentMethods = () => {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        console.log("hell world")
        axios.get('https://fctest-api.fastcourier.com.au/api/wp/payment_method', { "headers": headers }).then(response => {
            console.log("paymentMethods==" + response.data.data)
            setPaymentMethods(response.data.data);
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        getPaymentMethods();
    }, []);
    return (
        <div className="payment-methods">
            <div className="payment-heading">
                Payment Methods<span style={{ color: "red" }}> *</span>
            </div>
            <div className="payment-container">
                {paymentMethods.map((method, i) => {
                    return <div className="payment-card">
                        <div className="payment-item-left">
                            <div className="input-radio">
                                <input type="radio" name="paymentMethod" value={method.card_id} onChange={() => setSelectedMethod(e.target.value)} />
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
                <button className="submit-btn" variant="primary" onClick={() => savePaymentMethod()}>
                    Save details
                </button>
            </div>
        </div>
    );
}