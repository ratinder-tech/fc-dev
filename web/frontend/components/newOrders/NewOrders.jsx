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

export function NewOrders(props) {
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
    const [errorMsg, setErrorMsg] = useState("");
    const [orders, setOrders] = useState(null);
    const [orderMeta, setOrderMeta] = useState(null);

    const navigate = useNavigate();

    const getFormattedDate = (originalDateString) => {
        const originalDate = new Date(originalDateString);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(originalDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    const disabledDates = [
        '2024-01-01',
        '2024-01-26',
        '2024-03-29',
        '2024-03-30',
        '2024-03-31',
        '2024-04-01',
        '2024-04-25',
        '2024-06-10',
        '2024-10-07',
        '2024-12-25',
        '2024-12-26',
    ];

    const getAllOrders = async () => {
        setIsLoading(true);
        const response = await fetch(
            `/api/orders`,
            {
                method: "GET",
                headers: { "Accept": "application/json", },
            },
        );

        const data = await response.json();

        console.log("orders", data);

        setOrders(data.data);
        setIsLoading(false);
    }

    const getOrderMeta = async () => {
        setIsLoading(true);
        const response = await fetch(
            `/api/order-metafields`,
            {
                method: "GET",
                credentials: "include",
                headers: { "Accept": "application/json", },
            },
        );

        const data = await response.json();

        console.log("ordermeta", data);

        setOrderMeta(data);
        setIsLoading(false);
    }

    useEffect(() => {
        getAllOrders();
        getOrderMeta();
    }, []);

    const getMetaValue = (metafields, keyValue) => {
        var location = metafields?.find((element) => element.node.key == keyValue);
        console.log("location", location?.node?.value);
        return location != undefined ? location.node.value : null;
    }


    const getOrders = orders?.map(item1 => {
        const matchingItem2 = orderMeta?.body?.data?.orders?.edges.find(item2 => item2.node.id.includes(item1.id));
        return { ...item1, ...matchingItem2 };
    });

    useEffect(async () => {
        var filteredData = [];
        filteredData = await orders?.filter((item) => {
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
        var selectedIds = e.target.checked ? orders.map((element) => element.id.toString()) : [];
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
            getAllOrders();
            getOrderMeta();
            setShowHoldOrderModal(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }



    const bookOrder = async () => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        console.log("accessToken", accessToken);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        const payload = {
            "orders": [
                {
                    "quoteId": "WVQXMGNYEO",
                    "orderHashId": "GROREYQJYM",
                    "collectionDate": "2024-01-17",
                    "destinationEmail": "test@gmail.com",
                    "destinationPhone": "8523697410",
                    "wpOrderId": 989,
                    "destinationFirstName": "Test",
                    "destinationLastName": "LastName",
                    "destinationCompanyName": "Techie",
                    "destinationAddress1": "123",
                    "destinationAddress2": "8",
                    "pickupFirstName": "sia",
                    "pickupLastName": "roy",
                    "pickupCompanyName": null,
                    "pickupAddress1": "Sydney address 1",
                    "pickupAddress2": null,
                    "pickupPhone": "9632587410",
                    "pickupEmail": "sialocation@gmail.com",
                    "atl": false
                }
            ],
            "isReprocessOrders": false,
            "request_type": "wp"
        }
        axios.post('https://fctest-api.fastcourier.com.au/api/wp/bulk_order_booking', payload, {"headers": headers }).then(response => {
            console.log("merchantDetials", response.data.data);
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        })
    }



    useEffect(() => {
        //    getOrdersData() 
        bookOrder();
    }, [])

    const handleDateChange = (e) => {
        const selected = e.target.value;

        // Check if the selected date is in the disabledDates array
        const selectedDay = new Date(selected).getDay();

        // Get the current date
        const currentDate = new Date();

        // Disable Saturdays (day 6) and Sundays (day 0)
        if (selectedDay === 0 || selectedDay === 6) {
            setErrorMsg('Weekends not allowed');
            setShowError(true);
            setCollectionDate('');
        }
        // Disable dates before the current date
        else if (new Date(selected) < currentDate) {
            setErrorMsg('Dates before today are disabled. Please choose another date.');
            setShowError(true);
            setCollectionDate('');
        }
        else if (disabledDates.includes(selected)) {
            setErrorMsg('This date is disabled. Please choose another date.');
            setShowError(true);
            setCollectionDate(''); // Clear the selected date if it's disabled
        } else {
            setCollectionDate(selected);
        }
    };

    return (
        <div className="new-orders">
            {isLoading && <Loader />}
            <ErrorModal
                showModal={showError}
                onConfirm={setShowError}
                message={errorMsg}
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
                                <input className="input-field-text" type="date" value={collectionDate} onChange={(e) => handleDateChange(e)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="cancel-btn" onClick={() => setShowBookOrderModal(false)}>
                            Close
                        </div>
                        <div className="submit-btn" onClick={() => console.log("process-order")}>
                            Submit
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
                <button className="submit-btn" onClick={() => selectedOrders.length > 0 ? setShowBookOrderModal(true) : (setShowError(true), setErrorMsg("Please select at least 1 order"))}>
                    Book Selected Orders
                </button>
                <button className="submit-btn" onClick={() => selectedOrders.length > 0 ? setShowHoldOrderModal(true) : (setShowError(true), setErrorMsg("Please select at least 1 order"))}>
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
                    {console.log("getOrders", getOrders)}
                    {getOrders?.length > 0 && getOrders?.map((element, i) => {
                        if (getMetaValue(element.node?.metafields?.edges, "fc_order_status") != "Hold") {
                            return <tr key={i} className='products-row' style={{ background: i % 2 != 0 ? "#F5F8FA" : "#FFFFFF" }}>
                                <td><input type="checkbox" value={element.id} onChange={(e) => selectOrder(e)} checked={selectedOrders.includes(element.id.toString())} /></td>
                                <td width="7%" onClick={() => navigate('/orderDetails')} style={{ cursor: "pointer" }}>{element.order_number}</td>
                                <td width="10%">{getFormattedDate(element.created_at)}</td>
                                <td width="15%">{element?.shipping_address?.first_name + " " + element?.shipping_address?.last_name}</td>
                                <td width="15%">{element?.shipping_address?.address1 + ", " + element?.shipping_address?.address2 + " " + element?.shipping_address?.city}</td>
                                <td width="8%">{element.financial_status}</td>
                                <td width={"8%"}>{element.subtotal_price}</td>
                                <td width="7%">{element.line_items[0].fulfillable_quantity}</td>
                                <td width="15%">{"Courier Please"}</td>
                                <td width="10%">{"NA"}</td>
                                <td width="8%">{"NA"}</td>
                            </tr>
                        }
                    })}
                </table>
            </div>
        </div>
    );
}