import { CartProductType } from "@/app/product/[productId]/ProductDetails";
// import { product } from "@/utils/product";
import { createContext, useCallback, useContext, useEffect, useState } from "react"

import toast, { Toaster } from "react-hot-toast";

type CartContextType = {
    cartTotalQty: number,
    cartTotalAmount:number,
    cartProducts: CartProductType[] | null,
    handleAddProductToCart: (product: CartProductType) => void,
    handleRemoveProductFromCart: (product: CartProductType) => void,
    handleQtyIncrease: (product: CartProductType) => void,
    handleQtyDecrease: (product: CartProductType) => void,
    handleClearCart: () => void,
    paymentIntent: string | null,
    handlePaymentIntent: (val:string | null)=> void
}


export const CartContext = createContext<CartContextType | null>(null);

interface Props {
    [propName: string]: any,
}

export const CartContextProvider = (props: Props) => {
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
    const [cartTotalAmount, setcartTotalAmount] = useState(0);

    const [paymentIntent, setpaymentIntent] = useState<string | null>(null)

    useEffect(() => {
        const cartItems: any = localStorage.getItem("ezkartCartItems");

        const cProducts: CartProductType[] | null = JSON.parse(cartItems);

        const ezkartPaymentIntent:any = localStorage.getItem("ezkartPaymentIntent");
        const paymentIntent: string | null = JSON.parse(ezkartPaymentIntent);
        
        setCartProducts(cProducts);
        setpaymentIntent(paymentIntent)
    }, [])


    useEffect(() => {
        const getTotals = () => {

            if (cartProducts) {
                const { total, qty } = cartProducts?.reduce((acc, item) => {
                    const itemTotal = item.price * item.quantity;
                    acc.total += itemTotal;
                    acc.qty += item.quantity;
                    return acc
                }, {
                    total: 0,
                    qty: 0
                })
                setCartTotalQty(qty);
                setcartTotalAmount(total);
            }

        }
        getTotals();
    }, [cartProducts])



    const handleAddProductToCart = useCallback((product: CartProductType) => {
        setCartProducts((prev) => {
            let updatedCart;

            if (prev) {
                updatedCart = [...prev, product];
            }
            else {
                updatedCart = [product]
            }
            // console.log("call");
            // <Toaster/>
            localStorage.setItem("ezkartCartItems", JSON.stringify(updatedCart));
            return updatedCart;
        })
        toast.success("Product Added to Cart");
    }, [])

    const handleRemoveProductFromCart = useCallback((product: CartProductType) => {
        if (cartProducts) {
            const filterProducts = cartProducts.filter((item) => {
                return item.id !== product.id;
            })
            setCartProducts(filterProducts);
            localStorage.setItem("ezkartCartItems", JSON.stringify(filterProducts));
            toast.success("Product Removed from Cart");
        }
    }, [cartProducts])

    const handleQtyIncrease = useCallback((product: CartProductType) => {
        let updatedCart;
        if (product.quantity === 99) {
            return toast.error("Quantity cannot be increased further");
        }

        if (cartProducts) {
            updatedCart = [...cartProducts];
            const existingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if (existingIndex > -1) {
                updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity + 1;
            }
            setCartProducts(updatedCart);
            localStorage.setItem("ezkartCartItems", JSON.stringify(updatedCart));
        }
    }, [cartProducts])

    const handleQtyDecrease = useCallback((product: CartProductType) => {
        let updatedCart;
        if (product.quantity === 1) {
            return toast.error("Quantity cannot be decreased further");
        }

        if (cartProducts) {
            updatedCart = [...cartProducts];
            const existingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if (existingIndex > -1) {
                updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity - 1;
            }
            setCartProducts(updatedCart);
            localStorage.setItem("ezkartCartItems", JSON.stringify(updatedCart));
        }
    }, [cartProducts])

    const handleClearCart = useCallback(() => {
        setCartProducts(null);
        setCartTotalQty(0);
        localStorage.setItem("ezkartCartItems", JSON.stringify(null));
    }, [cartProducts])



    const handlePaymentIntent = useCallback((val:string | null)=>{
        setpaymentIntent(val);
        localStorage.setItem("ezkartPaymentIntent",JSON.stringify(val))
    },[paymentIntent])

    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleQtyIncrease,
        handleQtyDecrease,
        handleClearCart,
        paymentIntent,
        handlePaymentIntent
    }
    return <CartContext.Provider value={value} {...props} />

}

export const useCart = () => {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error("useCart must be used within a CartContextProvider");
    }

    return context;
}