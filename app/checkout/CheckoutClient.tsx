"use client";

import { useCart } from "@/hooks/useCart";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutClient = () => {

    const { cartProducts, paymentIntent, handlePaymentIntent } = useCart();

    const [error, seterror] = useState(false);
    const [loading, setloading] = useState(false);
    const [clientSecret, setclientSecret] = useState("")
    const [paymentSuccess, setpaymentSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        //create a payment intent as soon as the page loads
        if (cartProducts) {
            setloading(true);
            seterror(false);

            fetch('/api/create-payment-intent', {
                method: "POST",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    items: cartProducts,
                    payment_intent_id: paymentIntent
                })
            }).then((res) => {
                setloading(false)
                if (res.status === 401) {
                    return router.push("/login");
                }

                return res.json();
            }).then((data) => {
                setclientSecret(data.paymentIntent.client_secret)
                handlePaymentIntent(data.paymentIntent.id)
            }).catch((error) => {
                seterror(true);
                console.log("Error : ", error);
                toast.error("Something went wrong")
            })
        }
    }, [cartProducts, paymentIntent])

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            labels: 'floating'
        }
    }

    const handleSetPaymentSuccess = useCallback((value: boolean) => {
        setpaymentSuccess(value)
    }, [])


    // console.log("paymentIntent : ",paymentIntent);
    // console.log("clientSecret : ",clientSecret);

    return (
        <div className="w-full">
            {clientSecret && cartProducts &&(
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess}/>
                </Elements>
            )}
            {loading && <div className="text-center">Loading Checkout...</div>}
            {error && <div className="text-center text-rose-600">Some error ocurred.</div>}
            {paymentSuccess && <div className="flex items-center flex-col gap-4">
                <div className="text-green-600">Payment Successfull!</div>
                <div className="max-w-[220px] w-full">
                    <Button label="View Your Orders" onClick={()=>router.push("/orders")}/>
                </div>
            </div> }

        </div>
    );
}

export default CheckoutClient;