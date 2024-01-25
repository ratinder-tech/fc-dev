import {
    reactExtension,
    Banner,
    useApi, 
  } from '@shopify/ui-extensions-react/customer-account';
import { useEffect } from 'react';
  
  export default reactExtension(
    'purchase.thank-you.header.render-after',
    () => <Extension />,
  );
  
  function Extension() {
    const test = useApi()
    console.log(test,"test")
 
  

      return (
        <Banner>
          Please include your order ID  
          in support requests
        </Banner>
      );
  
  }
  