import "./style.css";
import { Modal } from '../modal';
import { useState } from 'react';
import { AddLocation } from '../addLocation';

export function ProductMapping() {
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="product-mapping">
            <div className='product-header'>
                <div className="product-map-filters">
                    <div className="input-container">
                        <div className="input-lebel">
                            <span> Keywords&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text" type="text" />
                        </div>
                    </div>
                    <div className="input-container">
                        <div className="input-lebel">
                            <span> Category&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <select className="input-field-text" type="text">
                                <option value="">All</option>
                                <option value="Albums">Albums</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Hoodies">Hoodies</option>
                                <option value="Music">Music</option>
                                <option value="Posters">Posters</option>
                                <option value="Singles">Singles</option>
                                <option value="T-shirts">T-shirts</option>
                                <option value="Uncategorized">Uncategorized</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-container">
                        <div className="input-lebel">
                            <span> Tags&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <select className="input-field-text" type="text">
                                <option>All</option>
                                <option>No Tags</option>
                                <option>Ninja</option>
                                <option>Testing</option>
                            </select>
                        </div>
                    </div>
                    <div className="filter-buttons">
                        <button> Filter </button>
                        <button> Reset </button>
                    </div>
                </div>
                <div className="product-actions">
                    <button className="submit-btn" variant="primary" onClick={() => setShowModal(true)}>
                        Shipping Boxes
                    </button>
                    <button className="submit-btn" variant="primary" onClick={() => setShowModal(true)}>
                        Map with Woo Dimensions
                    </button>
                    <button className="submit-btn" variant="primary" onClick={() => setShowModal(true)}>
                        Manually Assign Dimensions
                    </button>
                    <button className="submit-btn" variant="primary" onClick={() => setShowModal(true)}>
                        Assign Location
                    </button>
                    <button className="submit-btn" variant="primary" onClick={() => setShowModal(true)}>
                        Import Dimensions
                    </button>
                </div>
            </div>
            <Modal showModal={showShippingModal} >
                <AddLocation setShowModal={setShowShippingModal} />
            </Modal>
            <Modal showModal={showModal} >
                <AddLocation setShowModal={setShowModal} />
            </Modal>
            <div className="pickup-locations-table">
                <table>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Package Type</th>
                        <th>L x W x H</th>
                        <th>Weight</th>
                        <th>Is Individual</th>
                        <th>Location/Tag</th>
                    </tr>
                </table>
            </div>
        </div>
    );
}