"use server";

import useStripe from "./stripe";

const waitForTestClockToAdvance = async (props: { id: string }) => {
  const stripe = await useStripe();
  const testClock = await stripe.testHelpers.testClocks.retrieve(props.id);
  if (testClock.status == "advancing") {
    // sleep for 2 seconds
    await new Promise((r) => setTimeout(r, 2000));
    return await waitForTestClockToAdvance(props);
  }
  return;
};

const advanceTime = async (props: { id: string; date: number }) => {
  const stripe = await useStripe();
  await stripe.testHelpers.testClocks.advance(props.id, {
    frozen_time: props.date,
  });
  await waitForTestClockToAdvance({ id: props.id });
};
export default advanceTime;
