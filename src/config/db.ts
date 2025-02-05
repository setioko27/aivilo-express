import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;

export const disconectDB = async() =>{
    try{
        await prisma.$disconnect();
        console.log('💫 Disconnected from database');

        process.exit(0);
    }catch(e){
        console.error("Error during disconnect database",e)
        process.exit(1);
    }
}
