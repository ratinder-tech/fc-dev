import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./style.css";

export function PaymentMethods() {
    return (
        <div className="payment-methods">
            <div className="payment-heading">
                Payment Methods<span style={{ color: "red" }}> *</span>
            </div>

            <div className="payment-container">
                <div className="payment-card">
                    <div className="payment-item-left">
                        <div className="input-radio">
                            <input type="radio" name="paymentMethod" id="notFree" />
                        </div>
                        <FontAwesomeIcon icon="fa-brands fa-cc-visa" />
                    </div>
                    <div className="payment-item-right">
                        <div className='card-number'>
                            XXXX XXXX XXXX 4242
                        </div>
                        <div className='card-details'>
                            <div className='card-name'>
                                Visa
                            </div>
                            <div className='card-expiry'>
                                Exp: 12/25
                            </div>
                        </div>
                    </div>
                </div>
                <div className="payment-card">
                    <div className="payment-item-left">
                        <div className="input-radio">
                            <input type="radio" name="paymentMethod" id="notFree" />
                        </div>
                        <FontAwesomeIcon icon="fa-brands fa-cc-visa" />
                    </div>
                    <div className="payment-item-right">
                        <div className='card-number'>
                            XXXX XXXX XXXX 4242
                        </div>
                        <div className='card-details'>
                            <div className='card-name'>
                                Visa
                            </div>
                            <div className='card-expiry'>
                                Exp: 12/25
                            </div>
                        </div>
                    </div>
                </div>
                <div className="payment-card">
                    <div className="payment-item-left">
                        <div className="input-radio">
                            <input type="radio" name="paymentMethod" id="notFree" />
                        </div>
                        <FontAwesomeIcon icon="fa-brands fa-cc-visa" />
                    </div>
                    <div className="payment-item-right">
                        <div className='card-number'>
                            XXXX XXXX XXXX 4242
                        </div>
                        <div className='card-details'>
                            <div className='card-name'>
                                Visa
                            </div>
                            <div className='card-expiry'>
                                Exp: 12/25
                            </div>
                        </div>
                    </div>
                </div>
                <div className="payment-card">
                    <div className="payment-item-left">
                        <div className="input-radio">
                            <input type="radio" name="paymentMethod" id="notFree" />
                        </div>
                        <FontAwesomeIcon icon="fa-brands fa-cc-visa" />
                    </div>
                    <div className="payment-item-right">
                        <div className='card-number'>
                            XXXX XXXX XXXX 4242
                        </div>
                        <div className='card-details'>
                            <div className='card-name'>
                                Visa
                            </div>
                            <div className='card-expiry'>
                                Exp: 12/25
                            </div>
                        </div>
                    </div>
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