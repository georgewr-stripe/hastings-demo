import { ScenarioIds } from "@/types/scenarios";
import { StripeElementsOptions, StripePaymentElementOptions } from "@stripe/stripe-js";


export const paymentElementOptions: StripePaymentElementOptions = {
  layout: 'accordion',
  // You can add more here
}


export const ElementConfigs: Record<ScenarioIds, StripeElementsOptions> = {
  1: {
    mode: "payment",
    amount: 1000,
    currency: "eur",
    paymentMethodCreation: "manual",
    // @ts-ignore
    allowedCardBrands: ["visa", "mastercard"],
  },
  2: {
    mode: "payment",
    amount: 1000,
    currency: "eur",
    setupFutureUsage: "off_session",
    paymentMethodCreation: "manual",
    captureMethod: "manual",
  },
  3: {
    mode: "setup",
    currency: "eur",
    setupFutureUsage: "off_session",
    paymentMethodCreation: "manual",
  },
  4: {
    mode: "subscription",
    currency: "eur",
    amount: 1000,
    paymentMethodCreation: "manual",
  },
  5: {
    mode: "subscription",
    currency: "eur",
    amount: 1000,
    paymentMethodCreation: "manual",
  },
  6: {
    mode: "setup",
    currency: "eur",
    setupFutureUsage: "off_session",
    paymentMethodCreation: "manual",
  },
  7: {
    mode: "payment",
    amount: 1000,
    currency: "eur",
    setupFutureUsage: "off_session",
    paymentMethodCreation: "manual",
  },
};
