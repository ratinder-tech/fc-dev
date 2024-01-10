import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  Text,
  TextField,
  useCartLines,
  useApplyCartLinesChange,
  useApplyDiscountCodeChange,
  useCartLineTarget,
  useShippingAddress,
  useCheckoutToken,
  useTotalShippingAmount,
  useSessionToken,
  Spinner,
  Heading
} from '@shopify/ui-extensions-react/checkout';
import { InlineLayout, InlineSpacer, InlineStack, Pressable } from '@shopify/ui-extensions/checkout';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default reactExtension(
  'purchase.checkout.reductions.render-after',
  () => <Extension />,
);

const variantId = "gid://shopify/ProductVariant/44544528220379";

function Extension() {
  const translate = useTranslate();
  const cartLines = useCartLines();
  const applyDiscountCodeChange = useApplyDiscountCodeChange();
  const applyCartLineChange = useApplyCartLinesChange();
  const shippingAddress = useShippingAddress();
  const shippingCost = useTotalShippingAmount();
  const checkoutToken = useCheckoutToken();
  // const sessionToken = useSessionToken();
  const { extension, query, sessionToken } = useApi();
  const [variantData, setVariantData] = useState(null);
  const [isShipping, setIsShipping] = useState(false);
  const [shippingRate, setShippingRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [merchantDetails, setMerchantDetails] = useState(null);

  useEffect(() => {
    if (isShipping) {
      applyCartLineChange({
        type: "addCartLine",
        quantity: 1,
        merchandiseId: variantId,
      })
    } else {
      const cartLineId = cartLines.find((cartLine) => cartLine.merchandise.id === variantId)?.id;

      console.log("cartLines", cartLines);
      if (cartLineId) {
        applyCartLineChange({
          type: "removeCartLine",
          quantity: 1,
          id: cartLineId,
        })
      }
    }
  }, [isShipping]);

  // useEffect(() => {
  //   console.log("shippingAddress", shippingAddress);

  //   const shippingList = [
  //     {
  //       "postcode": "2000",
  //       "shipping_rate": "$28.88"
  //     },
  //     {
  //       "postcode": "3000",
  //       "shipping_rate": "$38.85"
  //     },
  //     {
  //       "postcode": "4000",
  //       "shipping_rate": "$44.42"
  //     },
  //     {
  //       "postcode": "5000",
  //       "shipping_rate": "$58.85"
  //     },
  //     {
  //       "postcode": "6000",
  //       "shipping_rate": "$63.33"
  //     }
  //   ]

  //   const shipping = shippingList.find((element) => shippingAddress.zip == element.postcode);

  //   // Function to change the state after 5 seconds
  //   const changeStateAfterDelay = () => {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       setShippingRate(shipping.shipping_rate);
  //       setIsLoading(false);
  //     }, 7000); // 5000 milliseconds = 5 seconds
  //   };

  //   // Call the function when the component mounts
  //   changeStateAfterDelay();
  // }, [shippingAddress]);




  const getMerchantDetails = async () => {
    const token = await sessionToken.get();

    const response = await fetch(
      `https://austin-feedback-realized-floppy.trycloudflare.com/api/get-merchant`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log("data", data);

    setMerchantDetails(data[0]);
  }

  useEffect(() => {
    getMerchantDetails();
  }, []);


  useEffect(() => {
    console.log(merchantDetails);
    if (merchantDetails != null) {
      getQuotes();
    }
  }, [shippingAddress, merchantDetails]);


  const getQuotes = async () => {
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "request-type": "shopify_development",
      "version": "3.1.1",
      "Authorization": "Bearer " + merchantDetails.access_token
    }
    const payload = {
      "destinationFirstName": "steve",
      "destinationLastName": "smith",
      "destinationCompanyName": "",
      "destinationEmail": "stevesmith@gmail.com",
      "destinationAddress1": "858, elizabeth st ",
      "destinationAddress2": "",
      "destinationSuburb": "Melbourne",
      "destinationState": "VIC",
      "destinationPostcode": "3000",
      "destinationBuildingType": "residential",
      "isPickupTailLift": "0",
      "destinationPhone": "",
      "parcelContent": "test",
      "valueOfContent": "150",
      "items": [
        {
          "name": "test box",
          "type": "box",
          "contents": "other",
          "height": "10",
          "length": "10",
          "width": "10",
          "weight": "1",
          "quantity": "1",
        }
      ],
    }
    // axios.get('https://fctest-api.fastcourier.com.au/api/wp/quote', { "params": payload, "headers": headers }).then(response => {
    //   console.log("merchantDetials", response.data.data);
    // }).catch(error => {
    //   console.log(error);
    // })

    const response = await fetch(
      `https://fctest-api.fastcourier.com.au/api/wp/quote?${new URLSearchParams(payload)}`,
      {
        method: "GET",
        credentials: "include",
        headers: headers,
      },
    );

    const data = await response.json();

    console.log("data", data);

  }

  useEffect(() => {
    getVariantData();
    async function getVariantData() {
      const queryResult = await query(`{
        node(id: "${variantId}"){
          ...on ProductVariant {
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            product {
              title
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }`);

      // console.log(queryResult);

      if (queryResult.data) {
        setVariantData(queryResult.data.node);
      }
    }
  }, []);

  if (!variantData) return null;

  return (
    <Pressable onPress={() => setIsShipping(!isShipping)}>

      {isLoading ? <Spinner /> :
        <InlineStack>
          <Text>Shipping Cost: </Text>
          <InlineSpacer spacing="loose" />
          <InlineSpacer spacing="loose" />
          <InlineSpacer spacing="loose" />
          <InlineSpacer spacing="loose" />
          <InlineSpacer spacing="loose" />
          <InlineSpacer spacing="loose" />
          <InlineSpacer spacing="loose" />
          <InlineSpacer spacing="none" />
          {/* <Text>{variantData.price.amount}</Text> */}
          <Heading>{shippingRate}</Heading>
        </InlineStack>}

    </Pressable>
  );
}