import {
  ExpressCheckoutElement,
  PaymentElement as StripePaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Stripe, StripeElements, StripeError, StripeExpressCheckoutElementConfirmEvent, StripePaymentElementOptions } from "@stripe/stripe-js";
import { error } from "console";
import React from "react";
import { Button } from "@tremor/react";

interface Props {
  options: StripePaymentElementOptions;
  callback: (options: {payment_method_id: string, stripe: Stripe, elements: StripeElements}) => void;
  loading: boolean;
}

const PaymentElement = (props: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = React.useState<string>();

  const handleError = (error: StripeError) => {
    console.log(error);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event: { preventDefault: () => void } | StripeExpressCheckoutElementConfirmEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    if ('preventDefault' in event) {
      event.preventDefault();
    }

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      //`Elements` instance that was used to create the Payment Element
      elements,
    });

    if (pmError) {
      // Show error to your customer (for example, payment details incomplete)
      handleError(pmError);
    } else {
      setErrorMessage("");
      props.callback({payment_method_id: paymentMethod.id, stripe, elements});
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      <ExpressCheckoutElement onConfirm={handleSubmit}  />
      <StripePaymentElement options={props.options} />
      <div className="flex flex-row-reverse pt-2">
      <Button
        disabled={!stripe}
        loading={props.loading}
        type="submit"
        className="bg-hastings-green"
      >
        Submit
      </Button>
      </div>
      <span className="mt-2 text-sm text-red-500">{errorMessage}</span>
    </form>
  );
};

export default PaymentElement;
