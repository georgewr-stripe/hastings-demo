"use client";

import getRefundInfo from "@/api/getRefundInfo";
import { Invoice } from "@/api/listInvoices";
import { amountToLocal } from "@/utils";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Badge,
  Title,
  Text,
  Button,
  Callout,
  List,
  ListItem,
  Divider,
} from "@tremor/react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import Stripe from "stripe";

interface InvoiceAccordianProps {
  invoice: Invoice;
}

const InvoiceAccordion = (props: InvoiceAccordianProps) => {
  const [refund, setRefund] = React.useState<Stripe.Refund | null>(null);

  React.useEffect(() => {
    if (props.invoice.payment_intent?.latest_charge?.amount_refunded) {
      getRefundInfo({
        payment_intent_id: props.invoice.payment_intent.id,
      }).then((refund) => {
        refund.length ? setRefund(refund[0]) : setRefund(null);
      });
    }
  }, [props.invoice]);
  const badgeInfo = () => {
    switch (props.invoice.status) {
      case "paid":
        return { colour: "green", text: "paid" };
      case "open":
        return { colour: "red", text: "failed" };
      case "draft":
        return { colour: "yellow", text: "upcoming" };
      case "void":
        return { colour: "red", text: "void" };
      default:
        return { colour: "gray", text: "unknown" };
    }
  };

  const due_date = () => {
    if (props.invoice.status_transitions.paid_at) {
      return moment.unix(props.invoice.status_transitions.paid_at);
    }
    if (props.invoice.automatically_finalizes_at) {
      return moment.unix(props.invoice.automatically_finalizes_at);
    }
    return moment(props.invoice.due_date);
  };

  const refundInfo = React.useMemo(() => {
    if (refund) {
      return (
        <Callout
          className="mt-2"
          color={"red"}
          title={`Refund Issued for ${amountToLocal(
            refund.amount
          )}, it may take 5-10 days to process, use this reference to contact your bank: ${
            refund.destination_details?.type
              ? (refund.destination_details as any)[
                  refund.destination_details.type
                ]?.reference
              : "N/A"
          }`}
        />
      );
    }
    return <></>;
  }, [refund]);

  return (
    <Accordion>
      <AccordionHeader className="w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <Text>{due_date().format("Do MMM YYYY")}</Text>
          <Title>Invoice</Title>
          <Badge color={badgeInfo().colour}>{badgeInfo().text}</Badge>
        </div>
      </AccordionHeader>
      <AccordionBody className="p-3">
        <Divider>Invoice Information</Divider>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <List>
            <ListItem>
              <Text className="text-md font-bold">Invoice ID: </Text>
              <pre className="ml-1 text-xs">
                {" "}
                {props.invoice.number || "N/A"}
              </pre>
            </ListItem>
            {props.invoice.amount_due != props.invoice.amount_paid ? (
              <ListItem>
                <Text className="text-md font-bold">Amount Due:</Text>
                <pre className="ml-1">
                  {amountToLocal(props.invoice.amount_due)}
                </pre>
              </ListItem>
            ) : (
              <></>
            )}
            {props.invoice.amount_paid ? (
              <ListItem>
                <Text className="text-md font-bold">Amount Paid:</Text>
                <pre className="ml-1">
                  {amountToLocal(props.invoice.amount_paid)}
                </pre>
              </ListItem>
            ) : (
              <></>
            )}
            <ListItem>
              <Text className="text-md font-bold">Payment Method:</Text>
              <pre className="ml-1">
                {props.invoice.payment_intent?.payment_method?.type ||
                  props.invoice?.default_payment_method?.type ||
                  "N/A"}
              </pre>
            </ListItem>
          </List>
          <div className=" pt-2">
            <Text className="text-md font-bold">Line Items</Text>
            <List>
              {props.invoice.lines.data.map((line) => (
                <ListItem key={line.id}>
                  <Text>{line.description}</Text>
                  <Text>{amountToLocal(line.amount)}</Text>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
        {refundInfo}
        {props.invoice.invoice_pdf ? (
          <div className="flex flex-row-reverse w-full pt-2">
            <Link href={props.invoice.invoice_pdf} passHref target="blank">
              <Button className="bg-hastings-green">Invoice PDF</Button>
            </Link>
          </div>
        ) : null}
      </AccordionBody>
    </Accordion>
  );
};

export default InvoiceAccordion;
