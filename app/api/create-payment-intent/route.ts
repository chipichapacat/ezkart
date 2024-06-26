// import Stripe from "stripe"
// import prisma from "@/libs/prismadb"
// import { NextResponse } from "next/server"
// import { CartProductType } from "@/app/product/[productId]/ProductDetails";
// import { getCurrentUser } from "@/actions/getCurrentUser";
// // import { connect } from "http2";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//     apiVersion: "2024-04-10",
// });

// const calculateOrderAmount = (items: CartProductType[]) => {
//     const totalPrice = items.reduce((acc, item) => {
//         const itemTotal = item.price * item.quantity;
//         return acc = itemTotal;
//     }, 0)

//     const price:any  = Math.floor(totalPrice);

//     return price;
// }



// export async function POST(request: Request) {
//     const currentUser = await getCurrentUser();
//     if (!currentUser) {
//         return NextResponse.error();
//     }

//     const body = await request.json();
//     const { items, payment_intent_id } = body
//     const total = calculateOrderAmount(items) * 100
//     const orderData = {
//         user: { connect: { id: currentUser.id } },
//         amount: total,
//         currency: "inr",
//         status: "pending",
//         deliveryStatus: "pending",
//         paymentIntentId: payment_intent_id,
//         products: items
//     }

//     if (payment_intent_id) {
//         //update the order
//         const currentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
//         if (currentIntent) {
//             const updatedIntent = await stripe.paymentIntents.update(
//                 payment_intent_id,
//                 { amount: total },
//             )

//             const [existing_order] = await Promise.all([
//                 prisma.order.findFirst({
//                     where: { paymentIntentId: payment_intent_id },
//                 }),
//                 prisma.order.update({
//                     where: { paymentIntentId: payment_intent_id },
//                     data:{
//                         amount: total,
//                         products: items,
//                         // status: "complete"
//                     }
//                 })

//             ])

//             if (!existing_order) {
//                 return NextResponse.error();
//             }

//             return NextResponse.json({ paymentIntent: updatedIntent })

//         }


//     }
//     else {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: total,
//             currency: "inr",
//             automatic_payment_methods: { enabled: true }
//         })

//         orderData.paymentIntentId = paymentIntent.id;
//         await prisma.order.create({
//             data: orderData
//         })
//         return NextResponse.json({ paymentIntent })
//     }

//     //return a default response
//     return NextResponse.error();
// }



import { NextResponse, NextRequest } from "next/server";

export const config = {
    runtime:"nodejs",
    dynamic:"force-dynamic"
}

import Stripe from "stripe";
import prisma from "@/libs/prismadb";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { getCurrentUser } from "@/actions/getCurrentUser";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-04-10",
});

const calculateOrderAmount = (items: CartProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;
        return acc + itemTotal; // corrected accumulation logic
    }, 0);

    const price: any = Math.floor(totalPrice);

    return price;
}

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.error();
        }

        const body = await request.json();
        const { items, payment_intent_id } = body;
        const total = calculateOrderAmount(items) * 100;
        const orderData = {
            user: { connect: { id: currentUser.id } },
            amount: total,
            currency: "inr",
            status: "pending",
            deliveryStatus: "pending",
            paymentIntentId: payment_intent_id,
            products: items
        };

        if (payment_intent_id) {
            try {
                // Update the order
                const currentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
                if (currentIntent) {
                    const updatedIntent = await stripe.paymentIntents.update(
                        payment_intent_id,
                        { amount: total },
                    );

                    const [existing_order] = await Promise.all([
                        prisma.order.findFirst({
                            where: { paymentIntentId: payment_intent_id },
                        }),
                        prisma.order.update({
                            where: { paymentIntentId: payment_intent_id },
                            data: {
                                amount: total,
                                products: items,
                                // status: "complete"
                            }
                        })
                    ]);

                    if (!existing_order) {
                        console.error("Order not found");
                        return NextResponse.error();
                    }

                    return NextResponse.json({ paymentIntent: updatedIntent });
                }
            } catch (error) {
                console.error("Error updating payment intent:", error);
                return NextResponse.error();
            }
        } else {
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: total,
                    currency: "inr",
                    automatic_payment_methods: { enabled: true }
                });

                orderData.paymentIntentId = paymentIntent.id;
                await prisma.order.create({
                    data: orderData
                });

                return NextResponse.json({ paymentIntent });
            } catch (error) {
                console.error("Error creating payment intent:", error);
                return NextResponse.error();
            }
        }

    } catch (error) {
        console.error("Error in POST /api/create-payment-intent:", error);
        return NextResponse.error();
    }
}
