"use client";

import advanceTime from "@/api/advanceTime";
import { useSession } from "@/hooks/useSession";
import { Button, Callout, NumberInput } from "@tremor/react";
import moment from "moment";
import React from "react";

interface State {
  time: number;
  loading: boolean;
}
const TimeMachine = () => {
  const { customer } = useSession();
  const [state, setState] = React.useState<State>({
    time: 12,
    loading: false,
  });

  const _advanceTime = React.useCallback(() => {
    if (customer?.test_clock_id) {
      setState((prev) => ({ ...prev, loading: true }));
      advanceTime({
        id: customer.test_clock_id,
        date: moment().add("months", state.time).unix(),
      }).then(() => {
        setState((prev) => ({ ...prev, loading: false }));
        window.location.reload();
      });
    }
  }, [customer, state.time]);

  if (!customer) {
    return <></>;
  }
  return (
    <Callout title="Advance Time">
      <div className="flex gap-2 items-center">
        <NumberInput
          disabled={state.loading}
          placeholder="Months"
          value={state.time}
          onValueChange={(time) => setState((prev) => ({ ...prev, time }))}
        />
        <Button onClick={_advanceTime} loading={state.loading}>
          {state.loading ? "Advancing..." : "Advance"}
        </Button>
      </div>
    </Callout>
  );
};
export default TimeMachine;
