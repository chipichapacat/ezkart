import Link from "next/link";
import Container from "../Container";

import { Raleway } from "next/font/google";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
// import Categories from "./Categories";
import Searchbar from "./Searchbar";
import dynamic from "next/dynamic";

const redressed = Raleway({subsets:['latin'], weight:['700']})

const NavBar = async () => {

    const currentUser =  await getCurrentUser();
    const CategoriesComponent =dynamic(() => import('./Categories'), { ssr: false });

    return ( 
        <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex  items-center justify-between gap-3 md:gap-0">
                        <Link href="/" className={`${redressed.className} font-bold text-2xl`}>EZKart</Link>
                        <div className="hidden md:block"><Searchbar/></div>
                        <div className="flex items-center gap-8 md:gap-12">
                            <CartCount/>
                            <UserMenu currentUserr={currentUser}/>
                        </div>
                    </div>
                </Container>
            </div>
            <CategoriesComponent/>
        </div>
     );
}
 
export default NavBar;