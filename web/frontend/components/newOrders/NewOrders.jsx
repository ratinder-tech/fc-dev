import "./style.css";
import { Modal } from '../modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AddLocation } from '../addLocation';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from "../loader";
import { ErrorModal } from '../errorModal';
import { ConfirmModal } from "../confirmModal";
import { Link, useNavigate } from "react-router-dom";

export function NewOrders() {
    const fetch = useAuthenticatedFetch();
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [collectionDate, setCollectionDate] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderId, setOrderId] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showError, setShowError] = useState(false);
    const [showBookOrderModal, setShowBookOrderModal] = useState(false);
    const [showHoldOrderModal, setShowHoldOrderModal] = useState(false);

    const getFormattedDate = (originalDateString) => {
        const originalDate = new Date(originalDateString);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(originalDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    const orders = useAppQuery({
        url: "/api/orders",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
        },
    });

    console.log("orders", orders);

    // useEffect(() => {
    //     if (orders.data.data != null) {
    //         setFilteredOrders(orders);
    //     }
    // }, [orders])

    useEffect(async () => {
        var filteredData = [];
        filteredData = await orders?.data?.data.filter((item) => {
            let orderMatch = true
            if (startDate != "") {
                orderMatch = getFormattedDate(item.created_at) >= startDate;
            }
            if (endDate != "") {
                orderMatch = getFormattedDate(item.created_at) <= endDate;
            }
            return orderMatch;
        });
        if (filteredData != undefined) {
            setFilteredOrders(filteredData);
        }
    }, [startDate, endDate]);

    const selectOrder = (e) => {
        const orderIds = selectedOrders.includes(e.target.value)
            ? selectedOrders.filter(item => item !== e.target.value)
            : [...selectedOrders, e.target.value];
        setSelectedOrders(orderIds);
    }

    const handleSelectAll = (e) => {
        var selectedIds = e.target.checked ? orders.data.data.map((element) => element.id.toString()) : [];
        setSelectedOrders(selectedIds);
    }

    const holdSelectedOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/hold-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderIds: selectedOrders
                }),
            });
            console.log(response);
            setIsLoading(false);
            setShowHoldOrderModal(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    return (
        <div className="new-orders">
            {isLoading && <Loader />}
            <ErrorModal
                showModal={showError}
                onConfirm={setShowError}
                message="Please select at least 1 order"
            />
            <Modal showModal={showBookOrderModal} width="30%">
                <div className="booking-modal">
                    <div className="modal-header">
                        <div className="shipping-heading">
                            Process
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="input-container">
                            <div className="input-lebel">
                                <span> Collection Date&nbsp;</span>
                            </div>
                            <div className="input-field1">
                                <input className="input-field-text" type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="cancel-btn" onClick={() => setShowBookOrderModal(false)}>
                            Close
                        </div>
                        <div className="submit-btn" onClick={() => console.log("process-order")}>
                            Import
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal showModal={showHoldOrderModal} width="30%">
                <div className="booking-modal">
                    <div className="modal-header">
                        <div className="shipping-heading">
                            Hold Order
                        </div>
                    </div>
                    <div className="modal-body">
                        Do you want to hold selected orders?
                    </div>
                    <div className="modal-footer">
                        <div className="cancel-btn" onClick={() => setShowHoldOrderModal(false)}>
                            Close
                        </div>
                        <div className="submit-btn" onClick={() => holdSelectedOrders()}>
                            Submit
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="orders-filters">
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Start Date&nbsp;</span>
                    </div>
                    <div className="input-field1">
                        <input className="input-field-text" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> End Date&nbsp;</span>
                    </div>
                    <div className="input-field1">
                        <input className="input-field-text" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
                <button className="submit-btn" onClick={() => selectedOrders.length > 0 ? setShowBookOrderModal(true) : setShowError(true)}>
                    Book Selected Orders
                </button>
                <button className="submit-btn" onClick={() => selectedOrders.length > 0 ? setShowHoldOrderModal(true) : setShowError(true)}>
                    Hold Selected Orders
                </button>
            </div>
            <div className="pickup-locations-table">
                <table>
                    <tr className="table-head">
                        <th className="select-all"><input type="checkbox" onChange={(e) => handleSelectAll(e)} /></th>
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
                    {console.log(selectedOrders)}
                    {filteredOrders.length > 0 && filteredOrders.map((element, i) => {
                        return <tr key={i} className='products-row' style={{ background: i % 2 != 0 ? "#F5F8FA" : "#FFFFFF" }}>
                            <td><input type="checkbox" value={element.id} onChange={(e) => selectOrder(e)} checked={selectedOrders.includes(element.id.toString())} /></td>
                            <td width="7%">{element.order_number}</td>
                            <td width="10%">{getFormattedDate(element.created_at)}</td>
                            <td width="15%">{"NA"}</td>
                            <td width="15%">{"NA"}</td>
                            <td width="8%">{element.financial_status}</td>
                            <td width={"8%"}>{element.subtotal_price}</td>
                            <td width="7%">{element.line_items[0].fulfillable_quantity}</td>
                            <td width="15%">{"NA"}</td>
                            <td width="10%">{"NA"}</td>
                            <td width="8%">{"NA"}</td>
                        </tr>
                    })}
                </table>
            </div>
        </div>
    );
}