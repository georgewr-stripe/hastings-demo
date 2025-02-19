"use server";

import useStripe from "./stripe";

const getRefundInfo = async (props: { payment_intent_id: string }) => {
  const stripe = await useStripe();
  const refunds = await stripe.refunds.list({
    payment_intent: props.payment_intent_id,
  });
  return refunds.data;
};

export default getRefundInfo;
