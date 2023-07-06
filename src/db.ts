import env from "dotenv";
import {MongoClient, ServerApiVersion} from "mongodb";
import {Blog, Post} from "./types";

if (process.env.NODE_ENV != 'production') {
    env.config({ path: `.env.development` });
} else {
    env.config();
}

const client = new MongoClient(process.env.MONGO_URL!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const blogsCollection = client.db(process.env.NODE_ENV).collection<Blog>("blogs");
export const postsCollection = client.db(process.env.NODE_ENV).collection<Post>("posts");

export const connectDb = async () => {
    try {
        console.log("Mongodb connecting...");
        await client.connect();
        await client.db().command({ping: 1})
        console.log("Mongodb connection status: ok");
    } catch (e: any) {
        console.log("Mongodb connection error: " + e.message);
        await client.close();
    }
}