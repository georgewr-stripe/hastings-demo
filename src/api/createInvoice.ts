"use server";

import Stripe from "stripe";
import useStripe from "./stripe";

interface CreateInvoiceProps {
  customer_id: string;
  payment_method_id?: string;
  amount: number;
  product_id: string;
  policy_id: string;
  due: number;
  finalise?: boolean;
  pay?: boolean;
}

const createSubscription = async (props: CreateInvoiceProps) => {
  const stripe = await useStripe();

  let invoice = await stripe.invoices.create({
    customer: props.customer_id,
    auto_advance: true,
    metadata: { policy_id: props.policy_id },
    default_payment_method: props.payment_method_id,
    collection_method: "charge_automatically",
    description: props.policy_id,
    automatically_finalizes_at: props.due,
    expand: ["payment_intent"],
  });
  const items = await stripe.invoiceItems.create({
    invoice: invoice.id,
    customer: props.customer_id,
    metadata: { policy_id: props.policy_id },
    price_data: {
      currency: "gbp",
      unit_amount: props.amount,
      product: props.product_id,
    },
  });
  if (props.finalise) {
    invoice = await stripe.invoices.finalizeInvoice(invoice.id, {
      expand: ["payment_intent"],
    });
  }
  if (props.pay) {
    invoice = await stripe.invoices.pay(invoice.id, {
      expand: ["payment_intent"],
    });
  }

  const paymentIntent = invoice.payment_intent as
    | Stripe.PaymentIntent
    | undefined;
  return {
    id: invoice.id,
    status: invoice.status,
    client_secret: paymentIntent?.client_secret,
  };
};

export default createSubscription;
