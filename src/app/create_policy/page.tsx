"use client";
import React, { use } from "react";
import Image from "next/image";
import CTA from "../../components/cta";
import Login from "@/components/login";
import { useSession } from "@/hooks/useSession";
import { Card, Title, Text } from "@tremor/react";
import { amountToLocal } from "@/utils";
import Spinner from "@/components/loading";
import CheckoutElement from "@/components/CheckoutElement";
import attachPM from "@/api/attachPM";
import createInvoice from "@/api/createInvoice";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import createSetupIntent from "@/api/createSetupIntent";
import { useRouter, useSearchParams } from "next/navigation";
import getPMFromSI from "@/api/getPMFromSI";
import { BUSINESS_CAR_INSURANCE_PROD, POLICY } from "@/constants";
import moment from "moment";

interface State {
  loadingPayment: boolean;
  loadingInvoice: boolean;
}

export const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectStatus = searchParams.get("redirect_status");
  const setupIntentId = searchParams.get("setup_intent");
  const { customer, setCustomer, loaded } = useSession();
  const [state, setState] = React.useState<State>({
    loadingPayment: false,
    loadingInvoice: setupIntentId ? true : false,
  });

  React.useEffect(() => {
    if (redirectStatus === "succeeded" && setupIntentId && customer) {
      getPMFromSI({ setup_intent_id: setupIntentId }).then((pm) => {
        createPolicyInvoice({
          customer_id: customer.id,
          payment_method_id: pm,
        });
      });
    }
  }, [redirectStatus, setupIntentId, customer]);

  const createPolicyInvoice = React.useCallback(
    (options: { customer_id: string; payment_method_id: string }) => {
      setState((prev) => ({ ...prev, loadingInvoice: true }));
      createInvoice({
        customer_id: options.customer_id,
        payment_method_id: options.payment_method_id,
        amount: POLICY.amount,
        product_id: BUSINESS_CAR_INSURANCE_PROD,
        policy_id: POLICY.id,
        finalise: true,
        pay: true,
        due: moment().unix(),
      })
        .then((invoice) => {
          console.log(invoice);
          attachPM({
            payment_method_id: "pm_card_createDispute",
            customer_id: options.customer_id,
          })
            .then((pm) => {
              createInvoice({
                customer_id: options.customer_id,
                payment_method_id: pm.id,
                amount: POLICY.amount,
                product_id: BUSINESS_CAR_INSURANCE_PROD,
                policy_id: POLICY.id,
                finalise: false,
                due: moment().add("years", 1).unix(),
              }).then((invoice) => {
                console.log(invoice);
                setState((prev) => ({ ...prev, loadingInvoice: false }));
                router.push("/account");
              });
            })
            .catch((e) => {
              console.log(e);
              setState((prev) => ({ ...prev, loadingInvoice: false }));
            });
        })
        .catch((e) => {
          console.log(e);
          setState((prev) => ({ ...prev, loadingInvoice: false }));
        });
    },
    [customer]
  );

  const createPolicy = React.useCallback(
    (options: {
      payment_method_id: string;
      stripe: Stripe;
      elements: StripeElements;
    }) => {
      const { payment_method_id, stripe, elements } = options;
      if (customer) {
        setState((prev) => ({ ...prev, loading: true }));
        createSetupIntent({
          payment_method_id: payment_method_id,
          customer_id: customer.id,
        })
          .then((si) => {
            if (si.client_secret) {
              stripe
                .confirmSetup({
                  elements,
                  confirmParams: { return_url: window.location.href },
                  clientSecret: si.client_secret,
                })
                .then((result) => {
                  if (result.error) {
                    setState((prev) => ({ ...prev, loadingPayment: false }));
                    console.log(result.error);
                  } else {
                    createPolicyInvoice({
                      customer_id: customer.id,
                      payment_method_id: payment_method_id,
                    });
                  }
                });
            }
          })
          .then((pm) => {
            console.log(pm);
          })
          .catch((e) => {
            console.log(e);
            setState((prev) => ({ ...prev, loading: false }));
          });
      }
    },
    [customer]
  );

  if (!loaded) {
    return <Spinner />;
  }

  if (!customer) {
    return <Login nextURL="/create_policy" />;
  }

  return (
    <Card className="py-4 px-8  w-full sm:w-4/5">
      <div className="flex flex-col">
        <Title>Business Car Policy</Title>
        <pre>Policy ID: {POLICY.id}</pre>
        <pre>
          Amount: {amountToLocal(POLICY.amount)} per {POLICY.freq}
        </pre>
        <pre></pre>
        <div className="pt-2">
          {state.loadingInvoice ? (
            <Spinner />
          ) : (
            <CheckoutElement
              options={{
                paymentMethodCreation: "manual",
                setup_future_usage: "off_session",
                mode: "setup",
                currency: "gbp",
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
