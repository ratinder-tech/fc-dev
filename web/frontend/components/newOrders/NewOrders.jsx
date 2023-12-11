import "./style.css";
import { Modal } from '../modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AddLocation } from '../addLocation';
import { ErrorModal } from '../errorModal';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from "../loader";
import { ConfirmModal } from "../confirmModal";
import { Link, useNavigate } from "react-router-dom";

export function NewOrders() {
    // const fetch = useAuthenticatedFetch();
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const orders = useAppQuery({
        url: "/api/orders",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
        },
    });

    console.log("orders", orders);

    useEffect(() => {

    }, []);

    return (
        <div className="new-orders">
            {isLoading && <Loader />}
            <div className="orders-filters">
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Start Date&nbsp;</span>
                    </div>
                    <div className="input-field1">
                        <input className="input-field-text" type="date" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> End Date&nbsp;</span>
                    </div>
                    <div className="input-field1">
                        <input className="input-field-text" type="date" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Order Number&nbsp;</span>
                    </div>
                    <div className="input-field1">
                        <input className="input-field-text" type="text" placeholder="Order Number" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Order Shipping Type&nbsp;</span>
                    </div>
                    <div className="input-field1">
                        <select className="input-field-text" type="text">
                            <option value="all">All</option>
                        </select>
                    </div>
                </div>
                <div className="filter-buttons">
                    {/* <button> Filter </button> */}
                    <button> Reset </button>
                </div>
            </div>
            <div className="order-action-buttons">
                <button className="submit-btn">
                    Book Selected Orders
                </button>
                <button className="submit-btn">
                    Hide Selected Orders
                </button>
            </div>
            <div className="pickup-locations-table">
                <table>
                    <tr className="table-head">
                        {/* <th className="select-all"><input type="checkbox" /></th> */}
                        <th>Order Id</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Ship To</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>packages</th>
                        <th>Carrier Details</th>
                        <th>Shipping type</th>
                        <th>Actions</th>
                    </tr>
                    {orders?.data?.data.length > 0 && orders.data.data.map((element, i) => {
                        return <tr key={i} className='products-row' style={{ background: i % 2 != 0 ? "#F5F8FA" : "#FFFFFF" }}>
                            <td width="7%">

                                {element.order_number}
                            </td>
                            <td width="7%">{new Date(element.created_at).toLocaleDateString('en-GB')}</td>
                            <td width="15%">{ }</td>
                            <td width="15%">{ }</td>
                            <td width="8%">{element.financial_status}</td>
                            <td width={"8%"}>{element.subtotal_price}</td>
                            <td width="7%">{element.line_items[0].fulfillable_quantity}</td>
                            <td width="15%"></td>
                            <td width="10%"></td>
                            <td width="8%"></td>
                        </tr>
                    })}
                </table>
            </div>
        </div>
    );
}