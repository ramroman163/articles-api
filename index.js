import express from "express";
import cors from "cors"
import { articleRouter } from "./routes/articles.js";
import dotenv from "dotenv";

const app = express()

dotenv.config();
app.disable('x-powered-by')
app.use(express.json())
app.use(cors())

app.use('/articles', articleRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`App started at http://localhost:${PORT}`)
})

/*

 SELECT A.name AS nombre, A.price AS precio, C.name AS categoria, B.name AS marca FROM Articles AS A
... INNER JOIN categories AS C ON A.category_id = C.id
... INNER JOIN brands AS B ON A.brand_id = B.id;

*/