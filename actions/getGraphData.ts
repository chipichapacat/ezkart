import moment from "moment";
import prisma from "@/libs/prismadb";

export default async function getGraphData() {
    try {
        //Get the start and end dates for the data range ( 7 days ago to today)
        const startDate = moment().subtract(6, "days").startOf("day");
        const endDate = moment().endOf("day");

        // query the database to get order data grouped by created date
        const result = await prisma.order.groupBy({
            by: ["createDate"],
            where: {
                createDate: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString()
                },
                status: "complete"
            },
            _sum: {
                amount: true
            }
        });

        // initialise the object to aggregate the data by day
        const aggregatedData: {
            [day: string]: { day: string, date: string, totalAmount: number };
        } = {};

        // create a clone of the start date to iterate over each day
        const currentDate = startDate.clone();

        // iterate over each day in the date range
        while (currentDate <= endDate) {
            //format the day as a string
            const day = currentDate.format("dddd");
            console.log("day-----", day, currentDate)

            //initialise the aggregated data for the day with the day, date and totalamount
            aggregatedData[day] = {
                day,
                date: currentDate.format("YYYY-MM-DD"),
                totalAmount: 0
            };

            //move to the next day
            currentDate.add(1, "day");
        }

        //calculate the total amount for each day by summing the order amounts
        result.forEach((entry:any)=>{
            const day = moment(entry.createDate).format("dddd");
            const amount = entry._sum.amount || 0;
            aggregatedData[day].totalAmount += amount;
        });

        //convert the aggregatedData object to an array and sort it by date
        const formattedData = Object.values(aggregatedData).sort((a,b)=>
        moment(a.date).diff(moment(b.date)))

        //return the formatted data
        return formattedData;
    }
    catch (error: any) {
        throw new Error(error)
    }
}
