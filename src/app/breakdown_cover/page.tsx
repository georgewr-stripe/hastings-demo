"use client";
import React, { Suspense, use } from "react";
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
  POLICY,
} from "@/constants";
import moment from "moment";
import subscribeToBreakdown from "@/api/subscribeToBreakdown";
import Link from "next/link";

interface State {
  loadingPayment: boolean;
  loadingInvoice: boolean;
}

const Page = () => {
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
    if (
      redirectStatus === "succeeded" &&
      paymentIntentId &&
      customer &&
      !customer?.has_breakdown_cover
    ) {
      subscribeToBreakdown({
        customer_id: customer.id,
        amount: BREAKDOWN_DATA.amount,
      }).then((invoice) => {
        console.log(invoice);
        setCustomer({ ...customer, has_breakdown_cover: true });
        setState((prev) => ({ ...prev, loadingInvoice: false }));
        router.push("/account");
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
          amount: 1250,
          policy_id: POLICY.id,
          product_id: BUSINESS_BREAKDOWN_COVER_PROD,
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
                    payment_method_data: {
                      allow_redisplay: 'always'
                    },

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
    return <Login nextURL="/create_policy" />;
  }

  if (customer.has_breakdown_cover) {
    return (
      <Card className="py-4 px-8 w-full sm:w-4/5">
        <div className="flex flex-col">
          <Title>Breakdown Cover</Title>
          <Text>You already have breakdown cover on your policy</Text>
          <Link href="/account" passHref>
            <Button className="bg-hastings-green">Go to account</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="py-4 px-8  w-full sm:w-4/5">
      <div className="flex flex-col">
        <Title>Add Breakdown Cover to your Policy</Title>
        <pre>Policy ID: {POLICY.id}</pre>
        <pre>
          Amount Due Today: {amountToLocal(1250)} per {POLICY.freq}
        </pre>
        <pre></pre>
        <div className="pt-2">
          {state.loadingInvoice ? (
            <Spinner />
          ) : (
            <CheckoutElement
              options={{
                paymentMethodCreation: "manual",
                mode: "payment",
                currency: "gbp",
                amount: 1250,
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

const SuspensePage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Page />
    </Suspense>
  );
};
export default SuspensePage;
