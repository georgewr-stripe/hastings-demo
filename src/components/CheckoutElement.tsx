"use client";

import { Elements } from "@stripe/react-stripe-js";
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeElementsOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import PaymentElement from "./PaymentElement";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "", {
  betas: ["blocked_card_brands_beta_2"],
});

interface CheckoutElementProps {
  options: StripeElementsOptions;
  elementOptions: StripePaymentElementOptions;
  callback: (options: {payment_method_id: string, stripe: Stripe, elements: StripeElements}) => void;
  loading: boolean;
}

const CheckoutElement = (props: CheckoutElementProps) => {
  return (
    <Elements stripe={stripePromise} options={props.options}>
      
      <PaymentElement
        options={props.elementOptions}
        callback={props.callback}
        loading={props.loading}
      />
    </Elements>
  );
};

export default CheckoutElement;
