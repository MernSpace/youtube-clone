import { db } from "@/db"
import { categories } from "@/db/schema"
import { baseProcedure, createTRPRouter } from '@/trpc/init'
export const categoriesRouter = createTRPRouter({
    getMany: baseProcedure.query(async () => {
        const data = await db.select().from(categories);
        return data;
    })
})