"use client";

import { CartContextProvider } from "@/hooks/useCart";
import { Toaster } from "react-hot-toast";

interface CartProviderProps{
    children: React.ReactNode
}

const CartProvider : React.FC<CartProviderProps> = ({children}) => {
    return ( 
        <CartContextProvider>{children}</CartContextProvider>
        
     );
}
 
export default CartProvider;