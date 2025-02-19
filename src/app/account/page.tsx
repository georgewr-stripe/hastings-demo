"use client";

import listInvoices, { Invoice } from "@/api/listInvoices";
import Spinner from "@/components/loading";
import { useSession } from "@/hooks/useSession";
import {
  AccordionList,
  Badge,
  Button,
  Callout,
  Card,
  Title,
} from "@tremor/react";
import React from "react";
import Stripe from "stripe";
import InvoiceAccordion from "./invoiceAccordian";
import { BREAKDOWN_DATA, POLICY } from "@/constants";
import { Plus } from "lucide-react";
import Link from "next/link";
import { amountToLocal } from "@/utils";
import TimeMachine from "@/components/timeMachine";

const Page = () => {
  const { customer } = useSession();
  const [invoices, setInvoices] = React.useState<Invoice[] | null>(null);

  React.useEffect(() => {
    if (customer) {
      listInvoices({ customer_id: customer.id }).then((invoices) => {
        console.log(invoices);
        setInvoices(invoices);
      });
    }
  }, [customer]);

  if (invoices === null) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center">
      <div className="flex flex-row-reverse">
        <TimeMachine />
      </div>

      <Card className="py-4 px-8  w-full sm:w-4/5">
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <Title>{POLICY.description}</Title>
            <Badge color="green">Active</Badge>
          </div>

          <pre>Policy ID: {POLICY.id}</pre>
        </div>
        {customer?.has_breakdown_cover ? (
          <Callout title="Breakdown Cover Included" color="green" />
        ) : (
          <Callout
            className="mt-4"
            title={`Add breakdown cover for only ${amountToLocal(
              BREAKDOWN_DATA.amount
            )}!`}
          >
            <Link href="/breakdown_cover" passHref>
              <Button variant="light" icon={Plus}>
                Add Now
              </Button>
            </Link>
          </Callout>
        )}

        <AccordionList className="pt-4">
          {invoices.map((invoice) => (
            <InvoiceAccordion key={invoice.id} invoice={invoice} />
          ))}
        </AccordionList>
      </Card>
    </div>
  );
};

export default Page;
