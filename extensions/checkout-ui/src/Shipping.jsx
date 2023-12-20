import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  Text,
  TextField,
  useCartLines,
  useApplyCartLinesChange,
  useCartLineTarget,
  useShippingAddress,
  useCheckoutToken
} from '@shopify/ui-extensions-react/checkout';
import { InlineLayout, InlineSpacer, Pressable } from '@shopify/ui-extensions/checkout';
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
  const applyCartLineChange = useApplyCartLinesChange();
  const shippingAddress = useShippingAddress();
  const checkoutToken = useCheckoutToken();
  const { extension, query, sessionToken } = useApi();
  const [variantData, setVariantData] = useState(null);
  const [isShipping, setIsShipping] = useState(false);
  const [shippingRate, setShippingRate] = useState("");

  // useEffect(() => {
  //   async function queryApi() {
  //     // Request a new (or cached) session token from Shopify
  //     const token = await sessionToken.get();
  //     console.log('sessionToken.get()', token);

  //     const apiResponse =
  //       await fetchWithToken(token);
  //     // Use your response
  //     console.log('API response', apiResponse);
  //   }

  //   function fetchWithToken(token) {
  //     const result = fetch(
  //       `https://channels-galleries-ought-url.trycloudflare.com/api/products`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": 'application/json',
  //           "X-Shopify-Access-Token": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczpcL1wvdGVzdC1kZXZlbG9wbWVudC1mYy1hcHAubXlzaG9waWZ5LmNvbVwvYWRtaW4iLCJkZXN0IjoiaHR0cHM6XC9cL3Rlc3QtZGV2ZWxvcG1lbnQtZmMtYXBwLm15c2hvcGlmeS5jb20iLCJhdWQiOiI1MTQxZWU1NzAwNzU0NDlmODRlNWU4MzFmZjg3M2VkNiIsInN1YiI6Ijg4MzI0MTEyNjAzIiwiZXhwIjoxNzAyNjM3Nzg3LCJuYmYiOjE3MDI2Mzc3MjcsImlhdCI6MTcwMjYzNzcyNywianRpIjoiNmRjNzUzZjEtNzg0MS00YzdjLTg3YTQtMzU3ZTExYWFkMjQ2Iiwic2lkIjoiMmY4M2Y4ZTM0ZTI3MjRlNjUyYzcxOGIwMTQ4MjM0MGU3NThmYTJmNjRlMGFlYTkxZWUxNmYwYmY3NjY0ZmVlZCIsInNpZyI6IjY0NTBlYmQwNjczNTQyOGQwMzliMmQxZDAwNmRmZDI1ZmEyNmQ3OWNiZmQ0MjM0ZDdkMjUyNzIwN2I1MmMyZTYifQ.REm8hfTUsyCHrKyiW9Dsvl-ny_ZUhGbLfCjKOrI1E5A`,
  //         },
  //       },
  //     );
  //     return result;
  //   }

  //   queryApi();
  // }, [sessionToken]);

  useEffect(() => {
    if (isShipping) {
      applyCartLineChange({
        type: "addCartLine",
        quantity: 1,
        merchandiseId: variantId,
      })
    } else {
      const cartLineId = cartLines.find((cartLine) => cartLine.merchandise.id === variantId)?.id;
      if (cartLineId) {
        applyCartLineChange({
          type: "removeCartLine",
          quantity: 1,
          id: cartLineId,
        })
      }
    }
  }, [isShipping]);

  const setShippingRates = async (checkoutToken) => {
    try {
      const checkout = new shopify.api.rest.Checkout({ session: sessionToken });
      checkout.token = checkoutToken;
      checkout.shipping_line = {
        "handle": "shopify-Free%20Shipping-0.00",
        "price": "10.00",
        "title": "Free Shipping"
      };
      await checkout.save({
        update: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    console.log(checkoutToken);
    setShippingRates(checkoutToken);
  }, [shippingAddress]);

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

      console.log(queryResult);

      if (queryResult.data) {
        setVariantData(queryResult.data.node);
      }
    }
  }, []);

  if (!variantData) return null;

  return (
    <Pressable onPress={() => setIsShipping(!isShipping)}>
      <InlineLayout>
        <Text>ADD VARIANT+ </Text>
        <Text>{variantData.price.amount}</Text>
      </InlineLayout>
    </Pressable>
  );
}