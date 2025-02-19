"use client";

import advanceTime, { getCurrentTime } from "@/api/advanceTime";
import { useSession } from "@/hooks/useSession";
import { Button, Callout, NumberInput } from "@tremor/react";
import moment from "moment";
import React from "react";

interface State {
  months: number;
  loading: boolean;
  current_time: number;
}
const TimeMachine = () => {
  const { customer } = useSession();
  const [state, setState] = React.useState<State>({
    months: 12,
    loading: false,
    current_time: moment().unix(),
  });

  React.useEffect(() => {
    if (customer?.test_clock_id) {
      getCurrentTime(customer.test_clock_id).then((time) => {
        setState((prev) => ({ ...prev, current_time: time }));
      });
    }
  }, [customer?.test_clock_id]);

  const _advanceTime = React.useCallback(() => {
    if (customer?.test_clock_id) {
      setState((prev) => ({ ...prev, loading: true }));
      advanceTime({
        id: customer.test_clock_id,
        months: state.months,
      }).then((frozen_time) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          current_time: frozen_time,
        }));
        window.location.reload();
      });
    }
  }, [customer, state.months]);

  if (!customer) {
    return <></>;
  }
  return (
    <Callout title={`Advance Time | Currently ${moment.unix(state.current_time).format("Do MMM YYYY")}`}>
      <div className="flex gap-2 items-center">
        <NumberInput
          disabled={state.loading}
          placeholder="Months"
          value={state.months}
          onValueChange={(months) => setState((prev) => ({ ...prev, months }))}
        />
        <Button onClick={_advanceTime} loading={state.loading}>
          {state.loading ? "Advancing..." : "Advance"}
        </Button>
      </div>
    </Callout>
  );
};
export default TimeMachine;
