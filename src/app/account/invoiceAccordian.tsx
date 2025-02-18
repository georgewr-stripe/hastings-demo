"use client";

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
} from "@tremor/react";
import moment from "moment";
import Link from "next/link";
import Stripe from "stripe";

interface InvoiceAccordianProps {
  invoice: Invoice;
}

const InvoiceAccordion = (props: InvoiceAccordianProps) => {
  const badgeColour = () => {
    switch (props.invoice.status) {
      case "paid":
        return "green";
      case "open":
        return "yellow";
      case "draft":
        return "blue";
      case "void":
        return "red";
      default:
        return "blue";
    }
  };

  const due_date = () => {
    if (props.invoice.status_transitions.paid_at) {
        return moment.unix(props.invoice.status_transitions.paid_at)
    }
    if (props.invoice.automatically_finalizes_at) {
      return moment.unix(props.invoice.automatically_finalizes_at);
    }
    return moment(props.invoice.due_date);
  };

  return (
    <Accordion>
      <AccordionHeader className="w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <Text>{due_date().format("Do MMM YYYY")}</Text>
          <Title>Invoice</Title>
          <Badge color={badgeColour()}>{props.invoice.status}</Badge>
        </div>
      </AccordionHeader>
      <AccordionBody className="p-3">
        <div className="flex items-center">
          <Text className="text-md font-bold">Invoice ID: </Text>
          <pre className="ml-1 text-xs"> {props.invoice.number}</pre>
        </div>
        {props.invoice.amount_due != props.invoice.amount_paid ? (
          <div className="flex items-center">
            <Text className="text-md font-bold">Amount Due:</Text>
            <pre className="ml-1">
              {amountToLocal(props.invoice.amount_due)}
            </pre>
          </div>
        ) : (
          <></>
        )}
        {props.invoice.amount_paid ? (
          <div className="flex items-center">
            <Text className="text-md font-bold">Amount Paid:</Text>
            <pre className="ml-1">
              {amountToLocal(props.invoice.amount_paid)}
            </pre>
          </div>
        ) : (
          <></>
        )}
        <div className="flex items-center">
          <Text className="text-md font-bold">Payment Method:</Text>
          <pre className="ml-1">
            {props.invoice.payment_intent?.payment_method?.type || props.invoice.default_payment_method.type || "N/A"}
          </pre>
        </div>
        <div className="mx-auto max-w-md pt-2">
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

        {props.invoice.payment_intent?.latest_charge?.amount_refunded ? (
          <Callout
            className="mt-2"
            color={"red"}
            title={`Refund Issued for ${amountToLocal(
              props.invoice.payment_intent.latest_charge.amount_refunded
            )}`}
          />
        ) : (
          <></>
        )}
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
