"use server";

import Stripe from "stripe";
import useStripe from "./stripe";
import _ from "lodash";

type PI = Stripe.PaymentIntent & {
  latest_charge: Stripe.Charge;
  payment_method: Stripe.PaymentMethod;
};
export type Invoice = Stripe.Invoice & {
  payment_intent?: PI;
  default_payment_method: Stripe.PaymentMethod;
};

const listInvoices = async (props: { customer_id: string }) => {
  const stripe = await useStripe();
  const invoices = (
    await stripe.invoices.list({
      customer: props.customer_id,
      expand: [
        "data.payment_intent",
        "data.payment_intent.payment_method",
        "data.default_payment_method",
        "data.payment_intent.latest_charge",
      ],
    })
  ).data as Invoice[];
  return _.orderBy(invoices, 'status_transitions.paid_at', "desc");
};

export default listInvoices;
