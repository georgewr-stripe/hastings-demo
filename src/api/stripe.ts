'use server'

import Stripe from "stripe";

const SK = process.env.STRIPE_SK;
if (!SK) {
    throw 'Stripe Secret Key not set!'
}
const stripe = new Stripe(SK);


const useStripe = async () => {
    return stripe
}
export default useStripe;
