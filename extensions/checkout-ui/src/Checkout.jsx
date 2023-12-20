import {
  useApi,
  useTranslate,
  reactExtension,
  TextField,
  useShippingAddress,
  useCheckoutToken
} from '@shopify/ui-extensions-react/checkout';
import { useEffect } from 'react';


export default reactExtension(
  'purchase.checkout.contact.render-after',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const shippingAddress = useShippingAddress();
  const checkoutToken = useCheckoutToken();
  // const fetch = useAuthenticatedFetch();


  useEffect(() => {
    console.log(shippingAddress);
  }, [shippingAddress])

  return (
    <TextField label="Company Name (optional)" />
  );
}