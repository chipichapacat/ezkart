"use client"

import { useCallback, useState } from "react";
import Avatar from "../Avatar";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import { signOut } from "next-auth/react";
import MenuItem from "./MenuItem";
import Backdrop from "./Backdrop";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";


interface UserMenuProps {
    currentUserr: SafeUser | null | undefined
}

const UserMenu: React.FC<UserMenuProps> =  ({ currentUserr }) => {

    const [isOpen, setisOpen] = useState(false);
    const router = useRouter();

    const toggleOpen = useCallback(() => {
        setisOpen((prev) => !prev);
    }, [])

    return (
        <>
            <div className="relative z-30">
                <div onClick={toggleOpen} className="p-2 border-[1px] border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700">
                    <Avatar src={currentUserr?.image}/>
                    <AiFillCaretDown />
                </div>
                {isOpen && (
                    <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
                        {/* when logged in */}
                        {currentUserr ? (
                            <div>
                                <Link href="/orders">
                                    <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
                                </Link>
                                {/* {currentUserr.role==="ADMIN" && <Link href="/admin">
                                    <MenuItem onClick={toggleOpen}>Admin Dashboard</MenuItem>
                                </Link>} */}
                                <hr/>
                                <MenuItem onClick={() => {
                                    toggleOpen();
                                    // router.push("/login");
                                    // router.refresh();
                                    signOut();
                                }}>Logout</MenuItem>
                            </div>
                        ) : (
                            <div>
                                <Link href="/login">
                                    <MenuItem onClick={toggleOpen}>Login</MenuItem>
                                </Link>
                                <Link href="/register">
                                    <MenuItem onClick={toggleOpen}>Register</MenuItem>
                                </Link>
                            </div>
                        )}



                    </div>
                )}
            </div >
            {isOpen ? <Backdrop onClick={toggleOpen} /> : null
            }

        </>
    );
}

export default UserMenu;