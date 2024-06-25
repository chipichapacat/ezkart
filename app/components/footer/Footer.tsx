import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import { FaFacebook, FaInstagramSquare, FaYoutube  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
            <Container>
                <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Shop Categories</h3>
                        <Link href="#">Phones</Link>
                        <Link href="#">Laptops</Link>
                        <Link href="#">Desktops</Link>
                        <Link href="#">Watches</Link>
                        <Link href="#">TVs</Link>
                        <Link href="#">Accessories</Link>
                    </FooterList>
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Customer Services</h3>
                        <Link href="#">Contact Us</Link>
                        <Link href="#">Shipping Policy</Link>
                        <Link href="#">Returns and Exchanges</Link>
                        <Link href="#">FAQs</Link>
                    </FooterList>
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-base font-bold mb-2">About Us</h3>
                        <p className="mb-2">At our electronics store, we are dedicated to providing the latest and greatest devices and accessories to our customers. With a wide selection of phones, TVs, laptops, watches and other electronics.</p>
                        <p>&copy; {new Date().getFullYear()} EZKart. All rights reserved.</p>
                    </div>

                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Follow Us</h3>
                        <div className="flex gap-2">
                            <Link href="#" className="text-lg text-slate-200 hover:text-slate-400 transition duration">
                                <FaFacebook/>
                            </Link>
                            <Link href="#" className="text-lg text-slate-200 hover:text-slate-400 transition duration">
                                <FaXTwitter/>
                            </Link>
                            <Link href="#" className="text-lg text-slate-200 hover:text-slate-400 transition duration">
                                <FaInstagramSquare/>
                            </Link>
                            <Link href="#" className="text-lg text-slate-200 hover:text-slate-400 transition duration">
                                <FaYoutube/>
                            </Link>
                        </div>
                    </FooterList>

                </div>
            </Container>
        </footer>
    );
}

export default Footer;