import {
  useApi,
  useTranslate,
  reactExtension,
  TextField,
  Checkbox,
  useShippingAddress,
  useCheckoutToken,
  BlockSpacer
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';


export default reactExtension(
  'purchase.checkout.contact.render-after',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const shippingAddress = useShippingAddress();
  const checkoutToken = useCheckoutToken();
  const test = useApi()
  console.log(test,"test")

  const [companyName, setCompanyName] = useState("");
  const [authorityToLeave, setAuthorityToLeave] = useState(false);


  const getQuotes = async () => {
    const token = await sessionToken.get();

    const result = await fetch(
      `https://polo-duke-mailto-hard.trycloudflare.com/api/get-checkout/${checkoutToken}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        // body: JSON.stringify({
        //   "checkoutToken": checkoutToken
        // }),
      },
    );
  }


  // useEffect(() => {
  //   console.log("company", companyName)
  // }, [companyName])

  return (
    <>
      <TextField label="Company Name (optional)" value={companyName} onInput={(value) => setCompanyName(value)} />
      <BlockSpacer spacing="loose" />
      <Checkbox id="authorityToLeave" name="authorityToLeave" value={authorityToLeave} onChange={(value) => setAuthorityToLeave(value)}>
        Authority to leave (optional)
      </Checkbox>
    </>
  );
}