import Container from "@/app/components/Container";
// import { product } from "@/utils/product";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import { products } from "@/utils/products";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";
import AddRating from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface Iparams{
    productId?: string;
}

const Product = async({params}:{params:Iparams}) => {
    
    const product = await getProductById(params);
    if(!product){
        return <NullData title="Oops! Product with the given ID does not exist"/>
    }
    
    const user = await getCurrentUser();
    
    return ( 
        <div className="p-8">
            <Container>
                <ProductDetails product = {product}/>
                <div className="flex flex-col mt-20 gap-4">
                    <AddRating product={product} user={user}/>
                    <ListRating product={product}/>
                </div>
            </Container>
        </div>
     );
}
 
export default Product;