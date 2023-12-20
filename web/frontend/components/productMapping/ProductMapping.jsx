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
import Papa from 'papaparse';
import { csv } from 'csvtojson';

export function ProductMapping() {
    const [showShippingBoxesModal, setShowShippingBoxesModal] = useState(false);
    const [showAddShippingBoxModal, setShowAddShippingBoxModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAssignLocationModal, setShowAssignLocationModal] = useState(false);
    const [showDimensionsModal, setshowDimensionsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [merchantTags, setMerchantTags] = useState([]);
    const [packageTypes, setPackageTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [locationBy, setLocationBy] = useState("name");
    const [locationName, setLocationName] = useState("");
    const [packageType, setPackageType] = useState("");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [isIndividual, setIsIndividual] = useState("Yes");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showError, setShowError] = useState(false);
    const [addLocationSubmit, setAddLocationSubmit] = useState(false);
    const [dimensionCount, setDimensionCount] = useState(1);
    const [selectedTag, setSelectedTag] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [productData, setProductData] = useState([]);
    const [shippingPackageName, setShippingPackageName] = useState("");
    const [shippingPackageType, setShippingPackageType] = useState("");
    const [shippingPackageHeight, setShippingPackageHeight] = useState("");
    const [shippingPackageLength, setShippingPackageLength] = useState("");
    const [shippingPackageWidth, setShippingPackageWidth] = useState("");
    const [isDefaultShippingPackage, setIsDefaultShippingPackage] = useState("No");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showImportDimensionsModal, setShowImportDimensionsModal] = useState(false);
    const [csvData, setCsvData] = useState(null);
    const [dataArray, setDataArray] = useState([]);
    // const [shippingBoxes, setShippingBoxes] = useState()

    const fetch = useAuthenticatedFetch();

    const { data } = useAppQuery({
        url: "/api/products-metafields",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
        },
    });


    const products = useAppQuery({
        url: "/api/products",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
        },
    });


    const shippingBoxes = useAppQuery({
        url: "/api/shipping-boxes",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
        },
    });


    const uniqueTags = new Set();
    const uniqueCategories = new Set();

    // Iterate over the products and add tags to the Set
    products?.data?.data.forEach(product => {
        if (product.tags) {
            product.tags.split(',').forEach(tag => {
                uniqueTags.add(tag.trim());
            });
        }
        if (product.product_type) {
            product.product_type.split(',').forEach(tag => {
                uniqueCategories.add(tag.trim());
            });
        }
    });

    // Convert Set to an array for rendering
    const uniqueTagsArray = Array.from(uniqueTags);
    const uniqueCategoriesArray = Array.from(uniqueCategories);


    const getProducts = products?.data?.data.map(item1 => {
        const matchingItem2 = data?.body?.data?.products?.edges.find(item2 => item2.node.id.includes(item1.id));
        return { ...item1, ...matchingItem2 };
    });


    useEffect(() => {
        var productItems = products?.data?.data;
        var data = productItems?.filter(element => selectedTag == "all" ? true : element.tags.includes(selectedTag));
        setProductData(data);
    }, [selectedTag]);

    useEffect(() => {
        var productItems = products?.data?.data;
        var data = productItems?.filter(element => selectedCategory == "all" ? true : element.product_type.includes(selectedCategory));
        setProductData(data);
    }, [selectedCategory]);

    useEffect(() => {
        getMerchantTags();
        getPackageTypes();
        getPickupLocations();
    }, []);

    const handleCsvInputChange = (e) => {
        setCsvData(e.target.files[0]);
    };

    const importDimensions = async () => {
        setIsLoading(true);
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: false,
            complete: async (result) => {
                setDataArray(result.data);
                console.log("csvData", result.data);
                const importData = result.data;
                const productIds = importData.map(element => {
                    const product = products?.data?.data.find(element1 => {
                        return element.SKU == element1.variants[0].sku
                    })
                    return product.id;
                })
                console.log("productIds", productIds);
                console.log("importData", importData);
                const element = importData[0];
                // importData.map(async (element) => {
                    const response = await fetch('/api/product/add-dimensions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            package_type: element["Package Type"],
                            height: element.Height,
                            width: element.Width,
                            length: element.Length,
                            weight: element.Weight,
                            isIndividual: element.Individual,
                            product_ids: productIds,
                        }),
                    });

                    console.log("response=", response);
                // })
                setIsLoading(false);
                setShowImportDimensionsModal(false);
            },
        });
    };


    const getPickupLocations = () => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const merchantDomainId = localStorage.getItem("merchantDomainId");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get(`https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/locations/${merchantDomainId}`, { "headers": headers }).then(response => {
            setIsLoading(false);
            setLocations(response.data.data);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    const getMerchantTags = () => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const merchantDomainId = localStorage.getItem("merchantDomainId");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get(`https://fctest-api.fastcourier.com.au/api/wp/merchant_location_tags/${merchantDomainId}`, { "headers": headers }).then(response => {
            setIsLoading(false);
            setMerchantTags(response.data.data);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    const getPackageTypes = () => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const merchantDomainId = localStorage.getItem("merchantDomainId");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.get(`https://fctest-api.fastcourier.com.au/api/wp/package_types`, { "headers": headers }).then(response => {
            setIsLoading(false);
            setPackageTypes(response.data.data);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    const selectProduct = (e) => {
        const productIds = selectedProducts.includes(e.target.value)
            ? selectedProducts.filter(item => item !== e.target.value)
            : [...selectedProducts, e.target.value];
        setSelectedProducts(productIds);
    }

    const handleSelectAll = (e) => {
        var selectedIds = e.target.checked ? products.data.data.map((element) => element.id.toString()) : [];
        setSelectedProducts(selectedIds);
    }

    const assignLocation = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/product/add-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location_name: locationName,
                    product_ids: selectedProducts,
                }),
            });
            console.log("response", response);
            setIsLoading(false);
            setShowAssignLocationModal(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    };

    const assignDimensions = async () => {
        try {
            setIsLoading(true);
            await fetch('/api/product/add-dimensions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package_type: packageType,
                    height: height,
                    width: width,
                    length: length,
                    weight: weight,
                    isIndividual: isIndividual,
                    product_ids: selectedProducts,
                }),
            });
            setIsLoading(false);
            setshowDimensionsModal(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }


    const dimensionDivsArray = Array.from({ length: dimensionCount }, (_, index) => index);

    const extractNumericId = (gid) => {
        const numericId = gid.split('/').pop();
        return numericId;
    };

    const handleLocationChange = (e) => {
        setLocationName(e.target.value)
    }

    const createShippingBox = async () => {
        try {
            setIsLoading(true);
            await fetch('/api/shipping-box/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package_name: shippingPackageName,
                    package_type: shippingPackageType,
                    height: shippingPackageHeight,
                    width: shippingPackageWidth,
                    length: shippingPackageLength,
                    is_default: isDefaultShippingPackage,
                }),
            });
            setIsLoading(false);
            setShowAddShippingBoxModal(false);
            setShowShippingBoxesModal(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }


    const deleteShippingBox = async (shippingBox) => {
        try {
            setIsLoading(true);
            await fetch('/api/shipping-box/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shippingBox),
            });
            setIsLoading(false);
            setShowConfirmModal(false);
            setShowShippingBoxesModal(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const resetFilters = () => {
        setSelectedCategory("all");
        setSelectedTag("all");
    }

    const getProductMetaField = (metafields, keyValue) => {
        var location = metafields?.find((element) => element.node.key == keyValue);
        return location != undefined ? location.node.value : null;
    }

    return (
        <div className="product-mapping">
            {isLoading && <Loader />}
            <div className='product-header'>
                <div className="product-map-filters">
                    {/* <div className="input-container">
                        <div className="input-lebel">
                            <span> Keywords&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <input className="input-field-text" type="text" />
                        </div>
                    </div> */}
                    <div className="input-container">
                        <div className="input-lebel">
                            <span> Category&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <select className="input-field-text" type="text" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="all">All</option>
                                {uniqueCategoriesArray.map((element, i) => {
                                    return <option value={element}>{element}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="input-container">
                        <div className="input-lebel">
                            <span> Tags&nbsp;</span>
                        </div>
                        <div className="input-field">
                            <select className="input-field-text" type="text" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                                <option value="all">All</option>
                                {uniqueTagsArray.map((element, i) => {
                                    return <option value={element}>{element}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="filter-buttons">
                        {/* <button> Filter </button> */}
                        <button onClick={() => resetFilters()}> Reset </button>
                    </div>
                </div>
                <div className="product-actions">
                    <button className="submit-btn" onClick={() => setShowShippingBoxesModal(true)}>
                        Shipping Boxes
                    </button>
                    <button className="submit-btn" onClick={() => selectedProducts.length > 0 ? setshowDimensionsModal(true) : setShowError(true)}>
                        Manually Assign Dimensions
                    </button>
                    <button className="submit-btn" onClick={() => selectedProducts.length > 0 ? setShowAssignLocationModal(true) : setShowError(true)}>
                        Assign Location
                    </button>
                    <button className="submit-btn" onClick={() => setShowImportDimensionsModal(true)}>
                        Import Dimensions
                    </button>
                </div>
            </div>
            <Modal showModal={showImportDimensionsModal} width="40%">
                <div className="import-dimesions">
                    <div className="modal-header">
                        <div className="shipping-heading">
                            Import dimensions & weight for product(s)
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="choose-file-row">
                            <div className="input-field">
                                <input type="file" className="choose-file" accept=".csv" onChange={(e) => handleCsvInputChange(e)} />
                            </div>
                            <div className="sample-download">
                                <a href="http://fc-new.vuwork.com/wp-content/plugins/fast-courier-shipping-freight/views/sample/dimensions-sample.csv" download={true} > Sample CSV </a>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="cancel-btn" onClick={() => setShowImportDimensionsModal(false)}>
                            Close
                        </div>
                        <div className="submit-btn" onClick={() => importDimensions()}>
                            Import
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal showModal={showShippingBoxesModal} width="60%" >
                {isLoading && <Loader />}
                <div className="shipping-boxes">
                    <div className='modal-header'>
                        <div className="shipping-heading">
                            Shipping Boxes
                        </div>
                        <div className="submit-btn" onClick={() => setShowAddShippingBoxModal(true)}>
                            Add Shipping Box
                        </div>
                        <Modal showModal={showAddShippingBoxModal} width="40%">
                            {isLoading && <Loader />}
                            <div className="add-shipping-box">
                                <div className="modal-header">
                                    <div className="shipping-heading">
                                        Add Shipping Box
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="input-container">
                                        <div className="input-lebel">
                                            <span> Package Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <input className="input-field-text1" placeholder="Package Name" type="text" value={shippingPackageName} onChange={(e) => setShippingPackageName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input-lebel">
                                            <span> Package Types&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <select className="input-field-text1" type="text" onChange={(e) => setShippingPackageType(e.target.value)}>
                                                <option>Select package type</option>
                                                {packageTypes.length > 0 && packageTypes.map((element, i) => {
                                                    return <option value={element.name}>{element.name}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-lebel">
                                        <span> Dimensions&nbsp;</span>
                                    </div>
                                    <div className="input-row">
                                        <div className="input-container1">
                                            <div className="input-lebel1">
                                                <span> Height&nbsp;</span><span style={{ color: "red" }}> *</span>
                                            </div>
                                            <div className="input-field">
                                                <input className="input-field-text1" type="text" placeholder="Height" value={shippingPackageHeight} onChange={(e) => setShippingPackageHeight(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="input-container1">
                                            <div className="input-lebel1">
                                                <span> Length&nbsp;</span><span style={{ color: "red" }}> *</span>
                                            </div>
                                            <div className="input-field">
                                                <input className="input-field-text1" type="text" placeholder="Length" value={shippingPackageLength} onChange={(e) => setShippingPackageLength(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="input-container1">
                                            <div className="input-lebel1">
                                                <span> Width&nbsp;</span><span style={{ color: "red" }}> *</span>
                                            </div>
                                            <div className="input-field">
                                                <input className="input-field-text1" type="text" placeholder="Width" value={shippingPackageWidth} onChange={(e) => setShippingPackageWidth(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="input-container1">
                                            <div className="input-lebel1">
                                                <span> Default&nbsp;</span><span style={{ color: "red" }}> *</span>
                                            </div>
                                            <div className="input-field">
                                                <input type="radio" name={"isDefault"} id={"yes"} value="Yes" onChange={(e) => setIsDefaultShippingPackage(e.target.value)} checked={isDefaultShippingPackage == "Yes"} />
                                                <label htmlFor={"yes"}>&nbsp;Yes</label>
                                                <input type="radio" name={"isDefault"} id={"no"} value="No" onChange={(e) => setIsDefaultShippingPackage(e.target.value)} checked={isDefaultShippingPackage == "No"} />
                                                <label htmlFor={"no"}>&nbsp;No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <div className="submit-btn" onClick={() => createShippingBox()}>
                                        Submit
                                    </div>
                                    <div className="cancel-btn" onClick={() => setShowAddShippingBoxModal(false)}>
                                        Close
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                    <div className="modal-body">
                        <table>
                            <tr className="table-head">
                                <th>Name</th>
                                <th>Type</th>
                                <th>Length</th>
                                <th>Width</th>
                                <th>Height</th>
                                <th>Default</th>
                                <th>Actions</th>
                            </tr>
                            {shippingBoxes?.data?.length > 0 && shippingBoxes.data.map((element, i) => {
                                return <tr className="products-row" style={{ background: i % 2 != 0 ? "#F5F8FA" : "#FFFFFF" }}>
                                    <td>{element.package_name}</td>
                                    <td>{element.package_type}</td>
                                    <td>{element.length}</td>
                                    <td>{element.width}</td>
                                    <td>{element.height}</td>
                                    <td>{element.is_default}</td>
                                    <td className='location-actions'>
                                        <FontAwesomeIcon icon="fa-solid fa-trash-can" onClick={() => setShowConfirmModal(true)} />
                                        <ConfirmModal showModal={showConfirmModal} onConfirm={() => deleteShippingBox(element)} onCancel={() => setShowConfirmModal(false)} message="you want to delete shipping box." />
                                    </td>
                                </tr>
                            })}
                        </table>
                    </div>
                    <div className="modal-footer">
                        <div className="cancel-btn" onClick={() => setShowShippingBoxesModal(false)}>
                            Close
                        </div>
                    </div>
                </div>
            </Modal>
            <ErrorModal
                showModal={showError}
                onConfirm={setShowError}
                message="Please select at least 1 product for mapping."
            />
            <Modal showModal={showAssignLocationModal} width="30%">
                {isLoading && <Loader />}
                <div className="assign-location">
                    <div className="modal-header">
                        Assign Location to selected product(s)
                    </div>
                    <div className="modal-body">
                        <div className="input-container">
                            <div className="input-lebel">
                                <span> Location By&nbsp;</span>
                            </div>
                            <div className="input-field">
                                <select className="input-field-text" type="text" onChange={(e) => setLocationBy(e.target.value)}>
                                    <option value={"name"}>Name</option>
                                    <option value={"tags"}>Tags</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-container">
                            <div className="input-lebel">
                                <span> Location List&nbsp;</span>
                            </div>
                            <div className="input-field">
                                <select className="input-field-text" type="text" onChange={(e) => handleLocationChange(e)}>
                                    <option>Select option</option>
                                    {(locationBy == "name" && locations.length > 0) && locations.map((element, i) => {
                                        return <option value={element.location_name}>{element.location_name}</option>
                                    })}
                                    {(locationBy == "tags" && merchantTags.length > 0) && merchantTags.map((element, i) => {
                                        return <option value={element.name}>{element.name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="cancel-btn" onClick={() => setShowAssignLocationModal(false)}>
                            Close
                        </button>
                        <button className="submit-btn" onClick={() => assignLocation()}>
                            Submit
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal showModal={showDimensionsModal} width="60%">
                {isLoading && <Loader />}
                <div className="assign-location">
                    <div className="modal-header">
                        Assign dimensions to selected product(s)
                    </div>
                    <div className="modal-body">
                        {dimensionDivsArray.map((item) => (
                            <div className="dimension-container">
                                <div className="input-row">
                                    <div className="input-container1">
                                        <div className="input-lebel1">
                                            <span> Package Types&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <select className="input-field-text1" type="text" onChange={(e) => setPackageType(e.target.value)}>
                                                <option>Select package type</option>
                                                {packageTypes.length > 0 && packageTypes.map((element, i) => {
                                                    return <option value={element.name}>{element.name}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-container1">
                                        <div className="input-lebel1">
                                            <span> Length&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <input className="input-field-text1" type="text" placeholder="Length" value={length} onChange={(e) => setLength(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="input-container1">
                                        <div className="input-lebel1">
                                            <span> Width&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <input className="input-field-text1" type="text" placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-row">
                                    <div className="input-container1">
                                        <div className="input-lebel1">
                                            <span> Height&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <input className="input-field-text1" type="text" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="input-container1">
                                        <div className="input-lebel1">
                                            <span> Weight(kgs)&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <input className="input-field-text1" type="text" placeholder="Weight(kgs)" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="input-container1">
                                        <div className="input-lebel1">
                                            <span> Individuals&nbsp;</span><span style={{ color: "red" }}> *</span>
                                        </div>
                                        <div className="input-field">
                                            <input type="radio" name={item + "isIndividual"} id={item + "yes"} value="Yes" onChange={(e) => setIsIndividual(e.target.value)} />
                                            <label htmlFor={item + "yes"}>&nbsp;Yes</label>
                                            <input type="radio" name={item + "isIndividual"} id={item + "no"} value="No" onChange={(e) => setIsIndividual(e.target.value)} />
                                            <label htmlFor={item + "no"}>&nbsp;No</label>
                                            {item != 0 &&
                                                <FontAwesomeIcon icon="fa-solid fa-trash" style={{ height: "1.2rem", color: "red", marginLeft: "30px", cursor: "pointer" }} onClick={() => dimensionCount > 1 && setDimensionCount(dimensionCount - 1)} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="add-more-dimension" onClick={() => setDimensionCount(dimensionCount + 1)}>
                        Add More Dimensions
                    </div>
                    <div className="modal-footer">
                        <button className="cancel-btn" onClick={() => setshowDimensionsModal(false)}>
                            Close
                        </button>
                        <button className="submit-btn" onClick={() => assignDimensions()}>
                            Submit
                        </button>
                    </div>
                </div>
            </Modal>
            <div className="pickup-locations-table">
                <table>
                    <tr className="table-head">
                        <th className="select-all"><input type="checkbox" onChange={(e) => handleSelectAll(e)} /></th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Tags</th>
                        <th>Package Type</th>
                        <th>L x W x H</th>
                        <th>Weight</th>
                        <th>Is Individual</th>
                        <th>Location/Tag</th>
                    </tr>
                    {getProducts?.length > 0 && getProducts.map((element, i) => {
                        return <tr key={i} className='products-row' style={{ background: i % 2 != 0 ? "#F5F8FA" : "#FFFFFF" }}>
                            <td><input type="checkbox" style={{ width: "40px" }} value={element.id} onChange={(e) => selectProduct(e)} checked={selectedProducts.includes(element.id.toString())} /></td>
                            <td width="10%">{element.title}</td>
                            <td width="10%">{element.variants[0].sku}</td>
                            <td width="10%">{"$" + element.variants[0].price}</td>
                            <td width="10%">{element.product_type}</td>
                            <td width="20%">{element.tags}</td>
                            <td width="10%">{getProductMetaField(element.node?.metafields?.edges, "package_type")}</td>
                            <td width="20%">{
                                getProductMetaField(element.node?.metafields?.edges, "width") != null ?
                                    getProductMetaField(element.node?.metafields?.edges, "length") + " x " + getProductMetaField(element.node?.metafields?.edges, "width") + " x " + getProductMetaField(element.node?.metafields?.edges, "height")
                                    : "0 x 0 x 0"
                            }</td>
                            <td width="10%">{getProductMetaField(element.node?.metafields?.edges, "weight") ?? "0kg"}</td>
                            <td width="10%">{getProductMetaField(element.node?.metafields?.edges, "is_individaul") ?? "Yes"}</td>
                            <td width="10%">{getProductMetaField(element.node?.metafields?.edges, "location")}</td>
                        </tr>
                    })}
                </table>
            </div>
        </div>
    );
}