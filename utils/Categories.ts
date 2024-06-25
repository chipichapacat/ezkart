import {AiOutlineDesktop, AiOutlineLaptop } from "react-icons/ai";
import { MdOutlineKeyboard, MdStorefront, MdTv, MdWatch } from "react-icons/md";
import { IoIosPhonePortrait } from "react-icons/io";

export const categories = [
    {
        label: "All",
        icon: MdStorefront
    },
    {
        label: "Phones",
        icon: IoIosPhonePortrait 
    },
    {
        label: "Laptops",
        icon: AiOutlineLaptop
    },
    {
        label: "Desktops",
        icon: AiOutlineDesktop
    },
    {
        label: "Watches",
        icon: MdWatch
    },
    {
        label: "TVs",
        icon: MdTv
    },
    {
        label: "Accessories",
        icon: MdOutlineKeyboard
    },
]