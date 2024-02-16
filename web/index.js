// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
// const bodyParser = require('body-parser');
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { MongoClient, ObjectId } from "mongodb";
import log4js from "log4js";
import * as fs from "fs";
import bodyParser from "body-parser";

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message, "eroroorro");
  }
  console.log('Connected to the database.');
});


function getSession() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM shopify_sessions', [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}



log4js.configure({
  appenders: {
    file: {
      type: "file",
      filename: "logs.log"
    }
  },
  categories: {
    default: {
      appenders:
        ["file"], level: "info"
    }
  },
});

//Create a logger object 
const logger = log4js.getLogger();

const url = "mongodb://localhost:27017";
const database = "local";
const client = new MongoClient(url);

async function getConnection() {
  let result = await client.connect();
  return result.db(database);
}

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(bodyParser.json());

const getValueByKey = (data, key) => {
  const item = data.find(obj => obj.key === key);
  return item ? item.value : null;
};
app.post("/api/shipping-rates", async (_req, res) => {
  const session = await getSession();
  var items = [];
  var totalPrice = 0;
  for (const element of _req.body.rate.items) {
    const productId = element.product_id;
    const productMetafields = await shopify.api.rest.Metafield.all({
      session: session[1],
      metafield: { "owner_id": productId, "owner_resource": "product" },
    });
    console.log("element==", element)
    const metaData = productMetafields.data;

    const isFreeShipping = getValueByKey(metaData, "is_free_shipping") == "1" ? true : false;

    var item = {
      "type": getValueByKey(metaData, "package_type"),
      "height": getValueByKey(metaData, "height"),
      "length": getValueByKey(metaData, "length"),
      "width": getValueByKey(metaData, "width"),
      "weight": getValueByKey(metaData, "weight"),
      "quantity": element.quantity,
    }

    console.log("item===", item);
    const itemPrice = parseInt(element.price) / 100;
    totalPrice += itemPrice;

    if (!isFreeShipping) {
      items.push(item);
    }

  }

  console.log("items===", items);

  const db = await getConnection();
  let collection = db.collection("merchant_details");
  const merchant = await collection.find({}).toArray();

  console.log("total===", totalPrice);
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "request-type": "shopify_development",
    "version": "3.1.1",
    "Authorization": "Bearer " + merchant[0]?.access_token
  }
  console.log("destination===", _req?.body?.rate?.destination);
  const destination = _req?.body?.rate?.destination;

  // const pickupLocations = await fetch(
  //   `https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/locations/${merchant[0]?.id}`,
  //   {
  //     method: "GET",
  //     credentials: "include",
  //     headers: headers
  //   },
  // );

  // const locations = await pickupLocations.json();

  // const pickupLocation = locations?.data?.find(element => element.is_default == 1);

  // const payload = {
  //   "request_type": "wp",
  //   "pickupFirstName": pickupLocation?.first_name,
  //   "pickupLastName": pickupLocation?.last_name,
  //   "pickupCompanyName": "",
  //   "pickupEmail": pickupLocation?.email,
  //   "pickupAddress1": pickupLocation?.address1,
  //   "pickupAddress2": pickupLocation?.address2,
  //   "pickupPhone": pickupLocation?.phone,
  //   "pickupSuburb": pickupLocation?.suburb,
  //   "pickupState": pickupLocation?.state,
  //   "pickupPostcode": pickupLocation?.postcode,
  //   "pickupBuildingType": pickupLocation?.building_type,
  //   "pickupTimeWindow": `${pickupLocation?.time_window}`,
  //   "isPickupTailLift": `${pickupLocation?.tail_lift}`,
  //   "destinationSuburb": destination.city,
  //   "destinationState": destination.province,
  //   "destinationPostcode": destination.postal_code,
  //   "destinationBuildingType": destination.company ? "commercial" : "residential",
  //   "destinationFirstName": destination.name,
  //   "destinationLastName": "",
  //   "destinationCompanyName": "NA",
  //   "destinationEmail": destination.email,
  //   "destinationAddress1": destination.address1,
  //   "destinationAddress2": destination.address2 != null ? destination.address2 : "",
  //   "destinationPhone": destination.phone,
  //   "parcelContent": "Order from Main Hub",
  //   "valueOfContent": `${totalPrice}`,
  //   "items": JSON.stringify(items),
  //   "isDropOffTailLift": merchant[0]?.is_drop_off_tail_lift
  // }

  // console.log("payload===", payload);

  // const quote = await fetch(
  //   `https://fctest-api.fastcourier.com.au/api/wp/quote?${new URLSearchParams(payload)}`,
  //   {
  //     method: "GET",
  //     credentials: "include",
  //     headers: headers
  //   },
  // );

  // const data = await quote.json();

  // console.log("quote===", data);

  // var amount = "";
  // var description = "";
  // var eta = "";
  // var quoteId = "";
  // var orderHashId = "";

  // if (data?.message == "No quote found") {
  //   amount = `${merchant[0]?.fallback_amount}00`;
  //   description = "Default fallback amount";
  // } else {
  //   amount = `${data?.data?.priceIncludingGst}00`;
  //   description = `${data?.data?.courierName}`;
  //   eta = `${data?.data?.eta}`;
  //   quoteId = `${data?.data?.id}`
  //   orderHashId = `${data?.data?.orderHashId}`
  // }

  // const response = {
  //   "rates": [
  //     {
  //       "service_name": "Fast Courier",
  //       "service_code": `"${quoteId}","${orderHashId}"`,
  //       "total_price": amount,
  //       "description": description,
  //       "currency": "AUD",
  //       "max_delivery_date": eta
  //     },
  //   ]
  // };


  const response = {
    "rates": [
      {
        "service_name": "Fast Courier",
        "service_code": `"WVQXMGNYEO","GROREYQJYM"`,
        "total_price": "8500",
        "description": "aramax express",
        "currency": "AUD",
        "max_delivery_date": "3 working days"
      },
    ]
  };

  console.log("response===", response);

  // const response = { "rates": [{ "service_name": "canadapost-overnight", "service_code": "ON", "total_price": "1295", "description": "This is the fastest option by far", "currency": "CAD", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2013-04-12 14:48:45 -0400" }, { "service_name": "fedex-2dayground", "service_code": "2D", "total_price": "2934", "currency": "USD", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2013-04-12 14:48:45 -0400" }, { "service_name": "fedex-priorityovernight", "service_code": "1D", "total_price": "3587", "currency": "USD", "min_delivery_date": "2013-04-12 14:48:45 -0400", "max_delivery_date": "2013-04-12 14:48:45 -0400" }] }
  res.status(200).json(response);
});

app.get("/api/update-order-status", async (_req, res) => {
  _req.body.forEach(async (element) => {
    const order = new shopify.api.rest.Order({ session: res.locals.shopify.session });
    // order.id = parseInt(id);
    order.metafields = [
      {
        key: "fc_order_status",
        value: element?.status_for_merchant,
        type: "single_line_text_field",
        namespace: "Order",
      },
    ];
    await order.save({
      update: true,
    });

    // orders.push(order);
  });
  res.status(200).send("success");
});

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.post("/api/hold-orders", async (_req, res) => {
  const { orderIds } = _req.body;
  const session = res.locals.shopify.session;
  var orders = [];
  orderIds.forEach(async (id) => {
    // const fulfillment_order = new shopify.api.rest.FulfillmentOrder({ session: res.locals.shopify.session });
    // fulfillment_order.id = parseInt(id);
    // await fulfillment_order.hold({
    //   body: { "fulfillment_hold": { "reason": "inventory_out_of_stock", "reason_notes": "Not enough inventory to complete this work.", "fulfillment_order_line_items": [{ "id": "", "quantity": 1 }] } },
    // });
    const metafield = new shopify.api.rest.Metafield({
      session: res.locals.shopify.session,
    });
    metafield.order_id = id;
    metafield.namespace = "Order";
    metafield.key = "fc_order_status";
    metafield.type = "single_line_text_field";
    metafield.value = "Hold";
    await metafield.save({
      update: true,
    });

    orders.push(metafield);
  });
  res.status(200).send(orders);
});

app.post("/api/book-orders", async (_req, res) => {
  const { orderIds, collectionDate } = _req.body;
  const session = res.locals.shopify.session;
  console.log("ress===", res)
  console.log("locals===", res.locals)
  console.log("shopify===", res.locals.shopify)
  var orders = [];
  orderIds.forEach(async (id) => {
    // const fulfillment_order = new shopify.api.rest.FulfillmentOrder({ session: session });
    // fulfillment_order.id = parseInt(id);
    // await fulfillment_order.reschedule({
    //   body: { "fulfillment_order": { "new_fulfill_at": collectionDate } },
    // });
    const order = new shopify.api.rest.Order({ session: session });
    order.id = parseInt(id);
    order.metafields = [
      {
        key: "fc_order_status",
        value: "Booked for collection",
        type: "single_line_text_field",
        namespace: "Order",
      },
      {
        key: "collection_date",
        value: collectionDate,
        type: "single_line_text_field",
        namespace: "Order",
      }
    ];
    await order.save({
      update: true,
    });

    orders.push(order);
  });
  res.status(200).send(orders);
});



app.post("/api/free-shipping", async (_req, res) => {
  const { orderId, isFreeShipping } = _req.body;
  const session = res.locals.shopify.session;
  // const order = new shopify.api.rest.Order({ session: session });
  // order.id = orderId;
  const value = isFreeShipping == true ? "1" : "0";
  const metafield = new shopify.api.rest.Metafield({
    session: res.locals.shopify.session,
  });
  metafield.order_id = orderId;
  metafield.namespace = "Order";
  metafield.key = "is_free_shipping";
  metafield.type = "single_line_text_field";
  metafield.value = value;
  await metafield.save({
    update: true,
  });

  res.status(200).send(metafield);
});

app.get("/api/orders", async (_req, res) => {
  const orders = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: "any",
  });
  res.status(200).send(orders);
});

app.get("/api/carrier-services", async (_req, res) => {
  const carriers = await shopify.api.rest.CarrierService.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(carriers);
});

app.post("/api/carrier-service/create", async (_req, res) => {
  const carrier_service = new shopify.api.rest.CarrierService({ session: res.locals.shopify.session });
  carrier_service.name = "Fast Courier";
  carrier_service.callback_url = "https://fc-app.vuwork.com/api/shipping-rates";
  carrier_service.service_discovery = true;
  await carrier_service.save({
    update: true,
  });
  res.status(200).send(carrier_service);
});


// app.post("/api/carrier-service/update", async (_req, res) => {
//   const carrier_service = new shopify.api.rest.CarrierService({ session: res.locals.shopify.session });
//   carrier_service.id = 66713190619;
//   carrier_service.name = "Fast Courier";
//   carrier_service.callback_url = "https://boundaries-sitemap-dylan-cord.trycloudflare.com/api/shipping-rates";
//   await carrier_service.save({
//     update: true,
//   });
//   res.status(200).send(carrier_service);
// });

app.post("/api/carrier-service/delete", async (_req, res) => {
  await shopify.api.rest.CarrierService.delete({
    session: res.locals.shopify.session,
    id: 66098495707,
  });
});

app.get("/api/get-checkout/:checkoutToken", async (_req, res) => {
  const checkoutToken = _req.params.checkoutToken;
  const checkout = await shopify.api.rest.Checkout.find({
    session: res.locals.shopify.session,
    token: checkoutToken,
  });
  res.status(200).send(checkout);
});

app.get("/api/get-order/:orderId", async (_req, res) => {
  const orderId = _req.params.orderId;
  const order = await shopify.api.rest.Order.find({
    session: res.locals.shopify.session,
    id: parseInt(orderId)
  });
  res.status(200).send(order);
});

app.get("/api/process-order/:orderId", async (_req, res) => {
  const orderId = _req.params.orderId;
  const order = new shopify.api.rest.Order({ session: res.locals.shopify.session });
  order.id = parseInt(orderId);
  order.metafields = [
    {
      key: "fc_order_status",
      value: "Processed",
      type: "single_line_text_field",
      namespace: "Order",
    },
  ];
  await order.save({
    update: true,
  });
  res.status(200).send(order);
});


app.post("/api/set-order-metafields", async (_req, res) => {
  const { quoteId, orderHashId, orderId } = _req.body;
  const order = new shopify.api.rest.Order({ session: res.locals.shopify.session });
  order.id = parseInt(orderId);
  order.metafields = [
    {
      key: "quote_id",
      value: quoteId,
      type: "single_line_text_field",
      namespace: "Order",
    },
    {
      key: "order_hash_id",
      value: orderHashId,
      type: "single_line_text_field",
      namespace: "Order",
    },
  ];
  await order.save({
    update: true,
  });
  res.status(200).send(order);
});

app.post("/api/save-merchant", async (_req, res) => {
  const db = await getConnection();
  const body = _req.body;
  let collection = db.collection("merchant_details");
  const response = await collection.insertOne(body);
  res.status(200).send(response);
});

app.get("/api/get-merchant", async (_req, res) => {
  const db = await getConnection();
  let collection = db.collection("merchant_details");
  const response = await collection.find({}).toArray();
  res.status(200).send(response);
});

app.post("/api/shipping-box/create", async (_req, res) => {
  const db = await getConnection();
  const body = _req.body;
  let collection = db.collection("shipping_boxes");
  const response = await collection.insertOne(body);
  res.status(200).send(response);
});

app.delete("/api/shipping-box/delete", async (_req, res) => {
  const db = await getConnection();
  const id = _req.body._id;
  let collection = db.collection("shipping_boxes");
  const response = await collection.deleteOne({ _id: new ObjectId(id) });
  res.status(200).send(response);
});

app.get("/api/shipping-boxes", async (_req, res) => {
  const db = await getConnection();
  let collection = db.collection("shipping_boxes");
  const response = await collection.find({}).toArray();
  res.status(200).send(response);
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products", async (_req, res) => {
  const products = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(products);
});

app.get("/api/get-token", async (_req, res) => {
  const products = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(products);
});

app.get("/api/order-metafields", async (_req, res) => {
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  const queryString = `{
    orders(first: 60) {
      edges {
        node {
          id
          metafields(first: 10) {
            edges {
              node {
                key
                value
              }
            }
          }
        }
      }
    }
  }`;

  const data = await client.query({
    data: queryString,
  });
  res.status(200).send(data);
});

app.get("/api/products-metafields", async (_req, res) => {
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  const queryString = `{
    products(first: 20) {
      edges {
        node {
          id
          title
          tags
          metafields(first: 7) {
            edges {
              node {
                key
                value
              }
            }
          }
        }
      }
    }
  }`;

  const data = await client.query({
    data: queryString,
  });
  res.status(200).send(data);
});

app.post("/api/product/add-location", async (_req, res) => {
  const { location_name, product_ids } = _req.body;
  const session = res.locals.shopify.session;
  var products = [];
  product_ids.forEach(async (element) => {
    const product = new shopify.api.rest.Product({ session: session });
    product.id = parseInt(element);
    product.metafields = [
      {
        key: "location",
        value: location_name,
        type: "single_line_text_field",
        namespace: "Product",
      },
    ];
    await product.save({
      update: true,
    });

    products.push(product);
  });
  res.status(200).send(products);
});

app.post("/api/product/add-dimensions", async (_req, res) => {
  const {
    package_type,
    height,
    width,
    length,
    weight,
    isIndividual,
    product_ids,
  } = _req.body;
  const session = res.locals.shopify.session;
  var products = [];
  product_ids.forEach(async (element) => {
    const product = new shopify.api.rest.Product({ session: session });
    product.id = parseInt(element);
    product.metafields = [
      {
        key: "package_type",
        value: package_type,
        type: "single_line_text_field",
        namespace: "Product",
      },
      {
        key: "height",
        value: height,
        type: "single_line_text_field",
        namespace: "Product",
      },
      {
        key: "width",
        value: width,
        type: "single_line_text_field",
        namespace: "Product",
      },
      {
        key: "length",
        value: length,
        type: "single_line_text_field",
        namespace: "Product",
      },
      {
        key: "weight",
        value: weight,
        type: "single_line_text_field",
        namespace: "Product",
      },
      {
        key: "is_individaul",
        value: isIndividual,
        type: "single_line_text_field",
        namespace: "Product",
      },
    ];
    await product.save({
      update: true,
    });

    products.push(product);
  });
  res.status(200).send(products);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));
app.use("/api/*", shopify.validateAuthenticatedSession())
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
