import {
  reactExtension,
  Banner,
  useOrder,
} from '@shopify/ui-extensions-react/customer-account';

export default reactExtension(
  'customer-account.order-status.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const order = useOrder();

  console.log("order", order);

  if (order) {
    return (
      <Banner>
        Please include your order ID ({order.id})
        in support requests
      </Banner>
    );
  }

  return null;
}
