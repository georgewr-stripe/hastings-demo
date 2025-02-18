"use server";

import useStripe from "./stripe";

const getPMFromSI = async (props: { setup_intent_id: string }) => {
  const stripe = await useStripe();
  return (await stripe.setupIntents.retrieve(props.setup_intent_id))
    .payment_method as string;
};

export default getPMFromSI;
