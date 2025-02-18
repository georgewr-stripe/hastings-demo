"use client";

import advanceTime from "@/api/advanceTime";
import { useSession } from "@/hooks/useSession";
import { Button, Callout, NumberInput } from "@tremor/react";
import moment from "moment";
import React from "react";

interface State {
  months: number;
  loading: boolean;
}
const TimeMachine = () => {
  const { customer } = useSession();
  const [state, setState] = React.useState<State>({
    months: 12,
    loading: false,
  });

  const _advanceTime = React.useCallback(() => {
    if (customer?.test_clock_id) {
      setState((prev) => ({ ...prev, loading: true }));
      advanceTime({
        id: customer.test_clock_id,
        months: state.months,
      }).then(() => {
        setState((prev) => ({ ...prev, loading: false }));
        window.location.reload();
      });
    }
  }, [customer, state.months]);

  if (!customer) {
    return <></>;
  }
  return (
    <Callout title="Advance Time">
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
