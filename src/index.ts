import {app} from './app'
import {connectDb} from "./db";

const port = process.env.PORT || 3000;

app.listen(port, async () => {
    await connectDb();
    console.log(`App is running on port: ${port}`)
})