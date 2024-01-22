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
  Heading,
  useTotalAmount
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
  const totalAmount = useTotalAmount();
  // const sessionToken = useSessionToken();
  const { extension, query, sessionToken } = useApi();
  const [variantData, setVariantData] = useState(null);
  const [isShipping, setIsShipping] = useState(false);
  const [shippingRate, setShippingRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [pickupLocations, setPickupLocations] = useState(null);
  const [quotes, setQuotes] = useState(null);


  useEffect(() => {
    getMerchantDetails();
  }, [shippingAddress]);


  const getMerchantDetails = async () => {
    const token = await sessionToken.get();

    const response = await fetch(
      `https://disc-singh-arthur-computational.trycloudflare.com/api/get-merchant`,
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

    console.log("merchant", data[0]);

    setMerchantDetails(data[0]);
  }



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

  useEffect(() => {
    if (merchantDetails?.booking_preference == "free_for_all_orders") {
      setShippingRate("Free");
    } else if (merchantDetails?.booking_preference == "free_for_basket_value_total" && totalAmount.amount > merchantDetails?.conditional_price) {
      console.log("Free");
      setShippingRate("Free");
    } else {
      console.log("not free");
      getQuotes();
    }
  }, [shippingAddress, merchantDetails]);


  useEffect(() => {
    if (merchantDetails != null) {
      getPickupLocations();
      getQuotes();
    }
  }, [shippingAddress, merchantDetails]);


  const getPickupLocations = async () => {
    const merchantDomainId = merchantDetails?.id;
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "request-type": "shopify_development",
      "version": "3.1.1",
      "Authorization": "Bearer " + merchantDetails.access_token
    }


    const response = await fetch(
      `https://fctest-api.fastcourier.com.au/api/wp/merchant_domain/locations/${merchantDomainId}`,
      {
        method: "GET",
        headers: headers
      },
    );

    const data = await response.json();

    console.log("pickupLocation", data.data);

    setPickupLocations(data.data);
  }

  const defaultPickupLocation = pickupLocations?.find(element => element.is_default == 1);



  const getQuotes = async () => {
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "request-type": "shopify_development",
      "version": "3.1.1",
      "Authorization": "Bearer " + merchantDetails?.access_token
    }
    const payload = {
      "destinationFirstName": shippingAddress?.firstName,
      "destinationLastName": shippingAddress?.lastName,
      "destinationCompanyName": shippingAddress?.company,
      "destinationEmail": "stevesmith@gmail.com",
      "destinationAddress1": shippingAddress?.address1,
      "destinationAddress2": shippingAddress?.address2,
      "destinationSuburb": shippingAddress?.provinceCode,
      "destinationState": shippingAddress?.city,
      "destinationPostcode": shippingAddress?.zip,
      "destinationBuildingType": "residential",
      "pickupBuildingType": "residential",
      "isPickupTailLift": "0",
      "destinationPhone": "",
      "orderType": "8",
      "parcelContent": "test",
      "valueOfContent": totalAmount.amount,
      "items": JSON.stringify([
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
      ]),
    }

    const response = await fetch(
      `https://fctest-api.fastcourier.com.au/api/wp/quote?${new URLSearchParams(payload)}`,
      {
        method: "GET",
        credentials: "include",
        headers: headers
      },
    );

    const data = await response.json();

    console.log("quotes", data.data);
    setQuotes(data.data);
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
      if (queryResult.data) {
        setVariantData(queryResult.data.node);
      }
    }
  }, []);

  if (!variantData) return null;



  console.log("defaultPickupLocation", defaultPickupLocation);

  return (
    <Pressable onPress={() => setIsShipping(!isShipping)}>
      {isLoading ? <Spinner /> :
        <>
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
            <Heading>{quotes?.priceIncludingGst}</Heading>
          </InlineStack>
          <InlineStack>
            <Text>Carrier Name: </Text>
            <InlineSpacer spacing="loose" />
            <InlineSpacer spacing="loose" />
            <InlineSpacer spacing="loose" />
            <InlineSpacer spacing="loose" />
            <InlineSpacer spacing="loose" />

            {/* <Text>{variantData.price.amount}</Text> */}
            <Heading>{quotes?.name}</Heading>
          </InlineStack></>}

    </Pressable>
  );
}