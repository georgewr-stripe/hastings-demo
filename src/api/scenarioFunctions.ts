import { ScenarioIds } from "@/types/scenarios";
import { StripeError } from "@stripe/stripe-js";
import stripe from "./stripe";
import { CONNECTED_ACCOUNT_ID } from "../constants";
import Stripe from "stripe";
import createSubscription from "./createInvoice";

interface ScenarioFunctionProps {
  paymentMethodId: string;
  customerId: string;
}

type ScenarioFunction = (props: ScenarioFunctionProps) => Promise<{
  clientSecret: string | null;
  error?: StripeError;
}>;

export const ScenarioFunctions: Record<ScenarioIds, ScenarioFunction> = {
  1: async (props) => {
    const { client_secret } = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "eur",
      customer: props.customerId,
      payment_method: props.paymentMethodId,
      transfer_data: { destination: CONNECTED_ACCOUNT_ID },
    });
    return { clientSecret: client_secret };
  },
  2: async (props) => {
    const { client_secret } = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "eur",
      customer: props.customerId,
      payment_method: props.paymentMethodId,
      setup_future_usage: "off_session",
      capture_method: 'manual',
      transfer_data: { destination: CONNECTED_ACCOUNT_ID },
    });
    return { clientSecret: client_secret };
  },
  3: async (props) => {
    const { client_secret } = await stripe.setupIntents.create({
      customer: props.customerId,
      payment_method: props.paymentMethodId,
      usage: "off_session",
    });
    return { clientSecret: client_secret };
  },
  4: async (props) => {
    const subscription = await createSubscription({
      customer_id: props.customerId,
    });
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;
    const clientSecret = paymentIntent.client_secret;
    return { clientSecret };
  },
  5: async (props) => {
    const subscription = await createSubscription({
      customer_id: props.customerId,
    });
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;
    const clientSecret = paymentIntent.client_secret;
    return { clientSecret };
  },
  6: async (props) => {
    return { clientSecret: "" };
  },
  7: async (props) => {
    return { clientSecret: "" };
  },
};
