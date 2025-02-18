"use server";

import { Customer } from "@/types/objects";
import useStripe from "./stripe";
import moment from "moment";

export const createCustomer = async (
  props: Omit<Customer, "id" | "test_clock_id" | "has_breakdown_cover">
): Promise<Customer> => {
  const stripe = await useStripe();
  const test_clock = await stripe.testHelpers.testClocks.create({
    frozen_time: moment().unix(),
  });
  const customer = await stripe.customers.create({
    ...props,
    test_clock: test_clock.id,
  });
  return {
    id: customer.id,
    ...props,
    test_clock_id: test_clock.id,
    has_breakdown_cover: false,
  };
};
