import {
  reactExtension,
  Banner,
  useApi,
  useSessionToken,
} from '@shopify/ui-extensions-react/customer-account';
import { useEffect } from 'react';

export default reactExtension(
  'purchase.thank-you.header.render-after',
  () => <Extension />,
);

function Extension() {
  const test = useApi()
  const { orderConfirmation } = useApi();
  const sessionToken = useSessionToken();
  console.log(orderConfirmation, "orderConfirmation")
  console.log(test, "test")

  const getOrderId = (orderIdString) => {
    const regex = /(\d+)/;
    const match = orderIdString.match(regex);

    // Check if there is a match and extract the numeric portion
    const orderId = match ? match[0] : null;
    return orderId;
  }

  const getCodes = (data) => {
    const item = data.find(obj => obj.source === "Fast Courier");
    return item ? item.code : null;
  }

  getOrderDetails = async () => {
    const token = await sessionToken.get();

    const orderId = getOrderId(orderConfirmation.current.order.id);


    const result = await fetch(
      `https://boundaries-sitemap-dylan-cord.trycloudflare.com/api/get-order/${orderId}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      },
    );

    const orderDetails = await result.json();
    console.log("orderDetails", orderDetails);


    const codes = getCodes(orderDetails.shipping_lines);

    console.log(codes, "codes==");
    if (codes != null) {

      const valuesArray = codes.split(',');

      // Trim the quotes from each value and assign them to variables
      const quoteId = valuesArray[0].replace(/"/g, '');
      const orderHashId = valuesArray[1].replace(/"/g, '');


      const setMetafields = await fetch(
        `https://fc-app.vuwork.com/api/set-order-metafields`,
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            quoteId: quoteId,
            orderHashId: orderHashId,
            orderId: orderId
          }),
        },
      );
    }


    console.log("setMetafields===", setMetafields);

  }


  useEffect(() => {
    getOrderDetails();
  }, [orderConfirmation])



  return (
    <Banner>
      Please include your order ID
      in support requests
    </Banner>
  );

}
