"use server";
import useStripe from "./stripe";

const createCustomerSession = async (customer_id: string) => {
  const stripe = await useStripe();
  return (
    await stripe.customerSessions.create({
      customer: customer_id,
      components: {
        payment_element: {
          enabled: true,
          features: { payment_method_redisplay: "enabled" },
        },
      },
    })
  ).client_secret;
};

export default createCustomerSession;
