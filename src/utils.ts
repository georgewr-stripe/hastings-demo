

export const amountToLocal = (amount: number) : string => {
    return (amount / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
}