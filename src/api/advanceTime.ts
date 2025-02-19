"use server";

import moment from "moment";
import useStripe from "./stripe";

const waitForTestClockToAdvance = async (props: { id: string }) => {
  const stripe = await useStripe();
  const testClock = await stripe.testHelpers.testClocks.retrieve(props.id);
  if (testClock.status == "advancing") {
    // sleep for 2 seconds
    await new Promise((r) => setTimeout(r, 2000));
    return await waitForTestClockToAdvance(props);
  }
  return testClock.frozen_time;
};

const advanceTime = async (props: { id: string; months: number }) => {
  const stripe = await useStripe();
  const tc = await stripe.testHelpers.testClocks.retrieve(props.id);
  const frozen_time = moment.unix(tc.frozen_time).add( props.months, 'months').unix();
  await stripe.testHelpers.testClocks.advance(props.id, {
    frozen_time
  });
  return await waitForTestClockToAdvance({ id: props.id });
};
export default advanceTime;

export const getCurrentTime = async (id: string) => {
  const stripe = await useStripe();
  const tc = await stripe.testHelpers.testClocks.retrieve(id);
  return tc.frozen_time
}
