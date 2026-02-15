import "dotenv/config";
import { connectDB } from "./config/db.connection.js";
import app from "./app.js";


const port = process.env.PORT || 5000;

connectDB()
    .then(()=> {
        const server = app.listen(port, ()=> {
            console.log(`Server is running on http://localhost:${port}`);
        });

        server.on("error",(err)=> {
            console.error("Server failed to start", err);
            process.exit(1)
        });
    })
    .catch(err=> {
        console.error("❌ DB connection failed", err);
        process.exit(1);
    });
