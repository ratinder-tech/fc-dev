// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { MongoClient, ObjectId } from "mongodb";
// import log4js from "log4js";
// import * as fs from "fs";



// log4js.configure({ 
//   appenders: {  
//       file: {  
//           type: "file",  
//           filename: "logs.log" 
//       }  
//   }, 
//   categories: { 
//       default: { 
//           appenders: 
//               ["file"], level: "info"
//       } 
//   }, 
// }); 

// Create a logger object 
// const logger = log4js.getLogger(); 

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

// app.get("/api/shipping-rates", async (_req, res) => {
//   const response = `{
//     "rates": [
//         {
//             "service_name": "canadapost-overnight",
//             "service_code": "ON",
//             "total_price": "1295",
//             "description": "This is the fastest option by far",
//             "currency": "CAD",
//             "min_delivery_date": "2013-04-12 14:48:45 -0400",
//             "max_delivery_date": "2013-04-12 14:48:45 -0400"
//         },
//         {
//             "service_name": "fedex-2dayground",
//             "service_code": "2D",
//             "total_price": "2934",
//             "currency": "USD",
//             "min_delivery_date": "2013-04-12 14:48:45 -0400",
//             "max_delivery_date": "2013-04-12 14:48:45 -0400"
//         },
//         {
//             "service_name": "fedex-priorityovernight",
//             "service_code": "1D",
//             "total_price": "3587",
//             "currency": "USD",
//             "min_delivery_date": "2013-04-12 14:48:45 -0400",
//             "max_delivery_date": "2013-04-12 14:48:45 -0400"
//         }
//     ]
// }`;

//   logger.info("Info message");
//   logger.warn("Warning message");
//   logger.error("Error message");
//   res.status(200).send(response);
// });

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
    const metafield = new shopify.api.rest.Metafield({ session: res.locals.shopify.session });
    metafield.order_id = id;
    metafield.namespace = "my_fields";
    metafield.key = "purchase_order";
    metafield.type = "single_line_text_field";
    metafield.value = "123";
    await metafield.save({
      update: true,
    });

    orders.push(metafield);
  });
  res.status(200).send(orders);
});

app.get("/api/orders", async (_req, res) => {
  const orders = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: "any",
  });
  res.status(200).send(orders);
});

app.post("/api/set-shipping", async (_req, res) => {
  const checkout = new shopify.api.rest.Checkout({ session: res.locals.shopify.session });
  checkout.token = _req.body.checkoutToken;
  checkout.shipping_line = {
    "handle": "shopify-Free%20Shipping-0.00",
    "price": "10.00",
    "title": "Free Shipping"
  };
  await checkout.save({
    update: true,
  });
  res.status(200).send(checkout);
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
  const response = await collection.deleteOne({ "_id": new ObjectId(id) });
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

app.get("/api/products-metafields", async (_req, res) => {
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session })
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
  }`

  const data = await client.query({
    data: queryString
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
        "key": "location",
        "value": location_name,
        "type": "single_line_text_field",
        "namespace": "Product"
      }
    ];
    await product.save({
      update: true,
    });

    products.push(product);
  });
  res.status(200).send(products);
});

app.post("/api/product/add-dimensions", async (_req, res) => {
  const { package_type, height, width, length, weight, isIndividual, product_ids } = _req.body;
  const session = res.locals.shopify.session;
  var products = [];
  product_ids.forEach(async (element) => {
    const product = new shopify.api.rest.Product({ session: session });
    product.id = parseInt(element);
    product.metafields = [
      {
        "key": "package_type",
        "value": package_type,
        "type": "single_line_text_field",
        "namespace": "Product"
      },
      {
        "key": "height",
        "value": height,
        "type": "single_line_text_field",
        "namespace": "Product"
      },
      {
        "key": "width",
        "value": width,
        "type": "single_line_text_field",
        "namespace": "Product"
      },
      {
        "key": "length",
        "value": length,
        "type": "single_line_text_field",
        "namespace": "Product"
      },
      {
        "key": "weight",
        "value": weight,
        "type": "single_line_text_field",
        "namespace": "Product"
      },
      {
        "key": "is_individaul",
        "value": isIndividual,
        "type": "single_line_text_field",
        "namespace": "Product"
      }
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

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
