"use client";
import React, { use } from "react";
import Image from "next/image";
import CTA from "../../components/cta";
import Login from "@/components/login";
import { useSession } from "@/hooks/useSession";
import { Card, Title, Text, Button } from "@tremor/react";
import { amountToLocal } from "@/utils";
import Spinner from "@/components/loading";
import CheckoutElement from "@/components/CheckoutElement";
import attachPM from "@/api/attachPM";
import createInvoice from "@/api/createInvoice";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import createSetupIntent from "@/api/createSetupIntent";
import { useRouter, useSearchParams } from "next/navigation";
import getPMFromSI from "@/api/getPMFromSI";
import {
  BREAKDOWN_DATA,
  BUSINESS_BREAKDOWN_COVER_PROD,
  BUSINESS_CAR_INSURANCE_PROD,
  OVERDUE_AMOUNT,
  OVERDUE_AMOUNT_PROD,
  POLICY,
} from "@/constants";
import moment from "moment";
import subscribeToBreakdown from "@/api/subscribeToBreakdown";
import Link from "next/link";
import { set } from "lodash";

interface State {
  loadingPayment: boolean;
  loadingInvoice: boolean;
}

export const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectStatus = searchParams.get("redirect_status");
  const paymentIntentId = searchParams.get("payment_intent");
  const { customer, setCustomer, loaded } = useSession();
  const [state, setState] = React.useState<State>({
    loadingPayment: false,
    loadingInvoice: paymentIntentId ? true : false,
  });

  React.useEffect(() => {
    if (redirectStatus === "succeeded" && paymentIntentId && customer) {
      attachPM({
        payment_method_id: "pm_card_chargeCustomerFail",
        customer_id: customer.id,
      }).then((pm) => {
        createInvoice({
          customer_id: customer.id,
          payment_method_id: pm.id,
          amount: POLICY.amount,
          product_id: BUSINESS_CAR_INSURANCE_PROD,
          policy_id: POLICY.id,
          due: moment().add("months", 6).unix(),
        }).then((invoice) => {
          setState((prev) => ({ ...prev, loadingInvoice: false }));
          router.push("/account");
        });
      });
    }
  }, [redirectStatus, paymentIntentId, customer]);

  const createPolicy = React.useCallback(
    (options: {
      payment_method_id: string;
      stripe: Stripe;
      elements: StripeElements;
    }) => {
      const { payment_method_id, stripe, elements } = options;
      if (customer) {
        setState((prev) => ({ ...prev, loadingPayment: true }));
        createInvoice({
          customer_id: customer.id,
          amount: OVERDUE_AMOUNT,
          policy_id: POLICY.id,
          product_id: OVERDUE_AMOUNT_PROD,
          finalise: true,
          due: moment().unix(),
        }).then((invoice) => {
          console.log(invoice);
          attachPM({ payment_method_id, customer_id: customer.id }).then(
            (pm) => {
              if (invoice.client_secret) {
                stripe.confirmPayment({
                  elements,
                  clientSecret: invoice.client_secret,
                  confirmParams: {
                    payment_method: pm.id,

                    return_url: window.location.href,
                  },
                });
              } else {
                console.log("No client secret found for invoice");
              }
            }
          );
        });
      }
    },
    [customer]
  );

  if (!loaded) {
    return <Spinner />;
  }

  if (!customer) {
    return <Login nextURL="/overdue" />;
  }

  return (
    <Card className="py-4 px-8  w-full sm:w-4/5">
      <div className="flex flex-col">
        <Title>Overdue Amount on Policy</Title>
        <pre>Policy ID: {POLICY.id}</pre>
        <pre>Overdue Amount: {amountToLocal(OVERDUE_AMOUNT)}</pre>
        <pre></pre>
        <div className="pt-2">
          {state.loadingInvoice ? (
            <Spinner />
          ) : (
            <CheckoutElement
              options={{
                paymentMethodCreation: "manual",
                setup_future_usage: "off_session",
                mode: "payment",
                currency: "gbp",
                amount: OVERDUE_AMOUNT,
              }}
              elementOptions={{ layout: "accordion" }}
              callback={createPolicy}
              loading={state.loadingPayment}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Page;
