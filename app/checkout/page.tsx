import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import FormWrapCheckout from "../components/FormwrapCheckout";
import CheckoutClient from "./CheckoutClient";


const Checkout = () => {
    return (
        <div className="p-8">
            <Container>
                <div className="-mt-20 xl:max-w-[800px] mx-auto justify-center">
                    <FormWrapCheckout>
                        <CheckoutClient />
                    </FormWrapCheckout>
                </div>



            </Container>
        </div>
    );
}

export default Checkout;