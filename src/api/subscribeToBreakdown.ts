"use server";

import { BUSINESS_BREAKDOWN_COVER_PROD, POLICY } from "@/constants";
import useStripe from "./stripe";

const subscribeToBreakdown = async (props: {
  customer_id: string;
  amount: number;
}) => {
  const stripe = await useStripe();
  const invoices = await stripe.invoices.list({
    customer: props.customer_id,
    status: "draft",
  });
  const updates = invoices.data.map((invoice) => {
    return stripe.invoiceItems.create({
      invoice: invoice.id,
      customer: props.customer_id,
      metadata: { policy_id: POLICY.id },
      price_data: {
        currency: "gbp",
        unit_amount: props.amount,
        product: BUSINESS_BREAKDOWN_COVER_PROD,
      },
    });
  });
  await Promise.all(updates);
};

export default subscribeToBreakdown;
