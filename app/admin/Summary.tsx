"use client";

import { Order, Product, User } from "@prisma/client";
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import { formatPrice } from "@/utils/formatPrice";
import { formatNumber } from "@/utils/formatNumber";

interface SummaryProps{
    orders: Order[],
    products: Product[],
    users: User[]
}

type SummaryDataType={
    [key:string]:{
        label:string;
        digit:number;
    }
}

const Summary:React.FC<SummaryProps> = ({orders,products,users}) => {
    const [summaryData, setsummaryData] = useState<SummaryDataType>({
        sale:{
            label: "Total Sale",
            digit: 0
        },
        products:{
            label: "Total Products",
            digit: 0
        },
        orders:{
            label: "Total Orders",
            digit: 0
        },
        users:{
            label: "Total Users",
            digit: 0
        },
    })

    useEffect(() => {
      setsummaryData((prev)=>{
        let tempdata={...prev}
        const totalsale = orders.reduce((acc,item)=>{
            if(item.status==="complete"){
                return acc + item.amount
            }
            else{
                return acc
            }
        },0)

        tempdata.sale.digit = totalsale;
        tempdata.orders.digit = orders.length;
        tempdata.products.digit = products.length;
        tempdata.users.digit = users.length;

        return tempdata
      })
    }, [orders,products,users])

    const summaryKeys = Object.keys(summaryData);
    

    return ( 
        <div className="max-w-[1150px] m-auto">
            <div className="mb-4 mt-8">
                <Heading title="Stats" center/>
            </div>
            <div className="grid grid-cols-2 gap-3  overflow-y-auto">
                {summaryKeys && summaryKeys.map((key)=>{
                    return <div key={key} className="rounded-xl border-2 p-4 py-10 flex flex-col items-center gap-2 transition">
                        <div className="text-xl md:text-4xl font-bold">
                            {summaryData[key].label==="Total Sale"?
                            <>{formatPrice(summaryData[key].digit)}</> :
                            <>{formatNumber(summaryData[key].digit)}</>}
                        </div>

                        <div>{summaryData[key].label}</div>
                    </div>
                })}
            </div>
        </div>
     );
}
 
export default Summary;