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
import { useSession } from "@/hooks/useSession";
import createCustomerSession from "@/api/customerSession";
import React from "react";
import Spinner from "./loading";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || "", {
  betas: ["blocked_card_brands_beta_2"],
});

interface CheckoutElementProps {
  options: StripeElementsOptions;
  elementOptions: StripePaymentElementOptions;
  callback: (options: {
    payment_method_id: string;
    stripe: Stripe;
    elements: StripeElements;
  }) => void;
  loading: boolean;
}

const CheckoutElement = (props: CheckoutElementProps) => {
  const { customer, loaded } = useSession();
  const [session, setSession] = React.useState<string | null | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (loaded && customer) {
      createCustomerSession(customer.id).then((secret) => {
        console.log(secret);
        setSession(secret);
      });
    }
    setSession((prev) => null);
  }, [customer, loaded]);

  if (session == undefined) {
    return <Spinner />;
  }
  return (
    <div className="max-w-xl mx-auto">
      <Elements
        stripe={stripePromise}
        options={{
          ...props.options,
          customerSessionClientSecret: session,
        }}
      >
        <PaymentElement
          options={props.elementOptions}
          callback={props.callback}
          loading={props.loading}
        />
      </Elements>
    </div>
  );
};

export default CheckoutElement;
