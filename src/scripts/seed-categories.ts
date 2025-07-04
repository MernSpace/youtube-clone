import { db } from "@/db"
import { categories } from "@/db/schema"
import { asc } from "drizzle-orm"

const categoryNames = [
    "Cars and vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film and animation",
    "How to-add style",
    "Music",
    "News and politics",
    "people and blogs",
    "pets and animals",
    "science and technology",
    "sports",
    "Travel and events"
]

async function main() {
    console.log("seeding categories")
    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `video related to ${name.toLowerCase()}`
        }))
        await db.insert(categories).values(values);

        console.log("categoris seeded success fully")

    } catch (err) {
        console.log("Error seeding categories: ", err)
        process.exit(1)
    }
}

main()