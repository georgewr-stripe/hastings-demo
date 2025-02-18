"use server";
import useStripe from "./stripe";

const attachPM = async (props: {
  payment_method_id: string;
  customer_id: string;
}) => {
  const stripe = await useStripe();
  const pm = await stripe.paymentMethods.attach(props.payment_method_id, {
    customer: props.customer_id,
  });
  return { id: pm.id };
};

export default attachPM;
