// import { PrismaClient } from "@prisma/client";

// declare global{
//     var prisma: PrismaClient 
// }

// // const client = globalThis.prisma || new PrismaClient()

// // if(process.env.NODE_ENV  != "production")
// //     globalThis.prisma = client


// // export default client;

// if(process.env.NODE_ENV === "production"){
//     prisma = new PrismaClient();
// }
// else{
//     if(!global.prisma){
//         global.prisma = new PrismaClient();
//     }
//     prisma = global.prisma;
// }

// export default prisma;


import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient;
}

let prisma: PrismaClient;

// Initialize prisma if not already initialized
if (process.env.NODE_ENV !== "production") {
    prisma = globalThis.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== "test") {
        globalThis.prisma = prisma;
    }
} else {
    // In production, ensure a single instance of PrismaClient
    if (!globalThis.prisma) {
        globalThis.prisma = new PrismaClient();
    }
    prisma = globalThis.prisma;
}

export default prisma;
