import { db } from "@/db"
import { categories } from "@/db/schema"

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
    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `video related to ${name.toLowerCase()}`
        }))
        await db.insert(categories).values(values);


    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

main()