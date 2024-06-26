"use client";

import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface ProductDetailsProps {
    product: any
}

export type CartProductType = {
    id: string,
    name: string,
    description: string,
    category: string,
    brand: string,
    selectedImg: SelectedImgType,
    quantity: number,
    price: number
}

export type SelectedImgType = {
    color: string,
    colorCode: string,
    image: string
}

const Horizontal = () => {
    return <hr className="w-[30%] my-2" />
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {

    const { handleAddProductToCart, cartProducts } = useCart();
    const [isProductInCart, setIsProductInCart] = useState(false);

    const { cartTotalQty } = useCart();

    const [cartProduct, setcartProduct] = useState<CartProductType>({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        selectedImg: product.images[0],
        quantity: 1,
        price: product.price
    });


    const router= useRouter();
    // console.log(cartProducts);

    useEffect(() => {
        setIsProductInCart(false);
        if (cartProducts) {
            const existingIndex = cartProducts.findIndex((item) => item.id === product.id)
            if (existingIndex > -1) {
                setIsProductInCart(true);
            }
        }
    }, [cartProducts])


    const productRating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length

    const handleColorSelect = useCallback((value: SelectedImgType) => {
        setcartProduct((prev) => {
            return { ...prev, selectedImg: value };
        })
    }, [cartProduct.selectedImg])

    const handleQtyIncrease = useCallback(() => {
        setcartProduct((prev) => {
            return { ...prev, quantity: prev.quantity + 1 };
        })
    }, [cartProduct])

    const handleQtyDecrease = useCallback(() => {
        if (cartProduct.quantity > 1) {
            setcartProduct((prev) => {
                return { ...prev, quantity: prev.quantity - 1 };
            })
        }
    }, [cartProduct])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductImage cartProduct={cartProduct} product={product} handleColorSelect={handleColorSelect} />
            <div className="flex flex-col gap-2 text-slate-500 text-sm">
                <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
                <div className="flex items-center gap-2">
                    <Rating value={productRating} readOnly />
                    <div>{product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}</div>
                </div>

                <Horizontal />

                <div className="text-justify mt-4">{product.description}</div>

                <Horizontal />

                <div>
                    <span className="font-semibold">CATEGORY : </span> {product.category}
                </div>
                <div>
                    <span className="font-semibold">BRAND : </span> {product.brand}
                </div>
                <div className={product.inStock ? "text-green-600" : "text-red-600"}>{product.inStock ? "In Stock" : "Out of Stock"}</div>

                <Horizontal />

                {isProductInCart ? (
                    <>
                        <p className="mb-2 flex items-center gap-3">
                            <FaCheckCircle className="text-green-600 w-[30px] h-[30px]"/>
                            <span>Product Added to Cart</span>
                        </p>
                        <div className="max-w-[300px]">
                            <Button label="View Cart" outline onClick={()=>{
                                router.push("/cart");
                            }}/>
                        </div>
                    </>
                    ) : (
                    <>
                        <SetColor cartProduct={cartProduct} images={product.images} handleColorSelect={handleColorSelect} />


                        <Horizontal />
                        <SetQuantity cartProduct={cartProduct} handleQtyIncrease={handleQtyIncrease} handleQtyDecrease={handleQtyDecrease} />

                        <Horizontal />
                        <div className="max-w-[300px]">
                            <Button label="Add to Cart" onClick={() => { handleAddProductToCart(cartProduct) }} />
                        </div>


                    </>)}



            </div>
        </div>
    );
}

export default ProductDetails;