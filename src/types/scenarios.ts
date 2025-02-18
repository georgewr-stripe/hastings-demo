

export const Scenarios = {
    1: 'One Time Payment (Travel) [No Amex]',
    2: 'One Time Payment (separate auth & capture) & Save Payment Method for Future Usage (Valuables)',
    3: 'Save Payment Method for Future Usage (A&H)',
    4: 'Subscription with Immediate Payment (EMEA Ireland)',
    5: 'Subscription with Future Payment (Renters)',
    // 'One Time Payment with a Saved Payment Method (Endorsement)',
    6: 'Payment Method Update',
    7: 'Payment Method Update with Immediate Payment'
 } as const;



export type ScenarioNames = (typeof Scenarios)[keyof typeof Scenarios]
export type ScenarioIds = keyof typeof Scenarios

