"use client"

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import FormWrapCheckout from "../components/FormwrapCheckout";
import Button from "../components/Button";
import getOrdersByUserId from "@/actions/getOrdersByUserId";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface CheckoutFormProps {
    clientSecret: string,
    handleSetPaymentSuccess: (value: boolean) => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, handleSetPaymentSuccess }) => {
    const { cartTotalAmount, handleClearCart, handlePaymentIntent } = useCart();
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setisLoading] = useState(false);
    const formattedPrice = formatPrice(cartTotalAmount);

    useEffect(() => {
        if (!stripe) {
            return
        }
        if (!clientSecret) {
            return;
        }
        handleSetPaymentSuccess(false);

    }, [stripe])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setisLoading(true);
        stripe.confirmPayment({
            elements,
            redirect: "if_required"
        }).then(result => {
            if (!result.error) {
                toast.success("Checkout Successful!")
                handleClearCart();
                handleSetPaymentSuccess(true);
                handlePaymentIntent(null);
            }
            setisLoading(false);
        })
    }

    return (
        <form onSubmit={handleSubmit} id="payment-form">
            <div className="mb-0">
                <Heading center title="Enter Your payment details to complete checkout" />
            </div>
            <div className="flex xl:flex-row lg:flex-row md:flex-row sm:flex-col xs:flex-col justify-between items-center max-w-[1200px]">
                <FormWrapCheckout>
                    <h2 className="font-semibold mb-2">Address Information</h2>
                    <AddressElement options={{ mode: "shipping", allowedCountries: ["US", "IN"] }} />
                </FormWrapCheckout>
                <FormWrapCheckout>
                    <h2 className="font-semibold mt-4 mb-2 sm:mt-0">Payment Information</h2>
                    <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
                    <div className="py-4 text-center text-slate-700 text-lg font-semibold">
                        Total : {formattedPrice}
                    </div>
                    <Button label={isLoading? " Processing":"Pay Now"} disabled={isLoading || !stripe || !elements} onClick={()=>{}}/>
                </FormWrapCheckout>
            </div>
        </form>
    );
}

export default CheckoutForm;