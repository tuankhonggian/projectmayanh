"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutClient = () => {
    const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (cartProducts && paymentIntent) {
            setLoading(true);
            setError(false);

            fetch("/api/create-payment-intent", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartProducts,
                    payment_intent_id: paymentIntent
                })
            })
                .then((res) => {
                    setLoading(false);
                    if (!res.ok) {
                        throw new Error('Phản hồi của mạng không ổn');
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data.paymentIntent && data.paymentIntent.client_secret) {
                        setClientSecret(data.paymentIntent.client_secret);
                        handleSetPaymentIntent(data.paymentIntent.id);

                        // Navigate to the checkout page after setting clientSecret
                        router.push("/checkout");
                    } else {
                        throw new Error('Phản hồi không hợp lệ từ máy chủ');
                    }
                })
                .catch((error) => {
                    setError(true);
                    console.error("Error", error);
                    toast.error("Đã xảy ra lỗi");
                });
        }
    }, [cartProducts, paymentIntent, handleSetPaymentIntent, router]);



    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: "stripe",
            labels: "floating"
        }
    }

    const handleSetPaymentSuccess = useCallback((value: boolean) => {
        setPaymentSuccess(value);
    }, []);

    return (
        <div className="w-full">
            {clientSecret && cartProducts && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm
                        clientSecret={clientSecret}
                        handleSetPaymentSuccess={handleSetPaymentSuccess}
                    />
                </Elements>
            )}
            {loading && <div className="text-center">Đang tải thanh toán ...</div>}
            {error &&
                <div className="text-center text-rose-500">Đã xảy ra lỗi...</div>
            }
            {paymentSuccess && (
                <div className="flex items-center flex-col gap-4">
                    <div className="text-teal-500 text-center">Thanh toán thành công</div>
                    <div className="max-w-[220px] w-full">
                        <Button
                            label="Xem đơn đặt hàng của bạn"
                            onClick={() => router.push("/order")}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutClient;
