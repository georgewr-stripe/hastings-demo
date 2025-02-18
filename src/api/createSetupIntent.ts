"use server";

import attachPM from "./attachPM";
import useStripe from "./stripe";

interface CreateSetupIntentProps {
  payment_method_id: string;
  customer_id: string;
}

const createSetupIntent = async (props: CreateSetupIntentProps) => {
  const stripe = await useStripe();
  const pm = await stripe.paymentMethods.retrieve(props.payment_method_id);
  if (pm.customer != props.customer_id) {
    await attachPM({
      payment_method_id: pm.id,
      customer_id: props.customer_id,
    });
  }
  const si = await stripe.setupIntents.create({
    payment_method: pm.id,
    customer: props.customer_id,
  });
  return { id: si.id, client_secret: si.client_secret };
};

export default createSetupIntent;
