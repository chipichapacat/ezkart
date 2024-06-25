// import Stripe from "stripe"
// import { NextApiRequest, NextApiResponse } from "next"
// import { buffer } from "micro"

// export const config = {
//     api: {
//         bodyParser: true
//     }
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//     apiVersion: "2024-04-10"
// })

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     const buf = await buffer(req)
//     const sig = req.headers['stripe-signature']

//     if (!sig) {
//         console.log("Error")
//         return res.status(400).send("Missing the stripe signature")
//     }

//     let event: Stripe.Event

//     try {
//         event = stripe.webhooks.constructEvent(
//             buf, sig, process.env.STRIPE_WEBHOOK_SECRET!
//         )
//     } catch (err) {
//         console.log("WEBHHOOOOOOK ERROR : "+err)
//         return res.status(400).send("Webhook Error" + err)
//     }

//     switch(event.type){
//         case 'charge.succeeded':
//             const charge:any = event.data.object as Stripe.Charge
//             if(typeof charge.payment_intent === 'string'){
//                 // console.log("Hogyaa")
//                 await prisma?.order.update({
//                     where: {paymentIntentId: charge.payment_intent},
//                     data: {status:'complete', address:charge.shipping?.address}
//                 })
//             }
//             break;

//         default:
//             console.log("Unhandled event type : "+event.type)
//     }

//     res.json({received: true})
// }

import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import prisma from "@/libs/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-04-10"
});

export const config = {
    api: {
        bodyParser: false // Disable built-in bodyParser to use `buffer` from `micro`
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        console.log("Error: Missing the stripe signature");
        return res.status(400).send("Missing the stripe signature");
    }

    try {
        const event = stripe.webhooks.constructEvent(
            buf, sig, process.env.STRIPE_WEBHOOK_SECRET!
        );

        // Handle the event asynchronously
        await handleWebhookEvent(event);

        res.json({ received: true });
    } catch (err:any) {
        console.error("Webhook Error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}

async function handleWebhookEvent(event: Stripe.Event) {
    switch(event.type) {
        case 'charge.succeeded':
            const charge = event.data.object as Stripe.Charge;
            if (typeof charge.payment_intent === 'string') {
                // Queue update operation in background
                await queueBackgroundTask(charge.payment_intent);
            }
            break;
        
        default:
            console.log("Unhandled event type:", event.type);
    }
}

async function queueBackgroundTask(paymentIntentId: string) {
    try {
        // Example: Update order status in the database asynchronously
        await prisma?.order.update({
            where: { paymentIntentId },
            data: { status: 'complete' }
        });
        console.log(`Order with paymentIntentId ${paymentIntentId} updated successfully.`);
    } catch (error) {
        console.error(`Failed to update order with paymentIntentId ${paymentIntentId}:`, error);
    }
}

