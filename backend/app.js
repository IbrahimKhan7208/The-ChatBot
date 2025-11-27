import express from "express"
const app = express()
import cors from "cors"
const port = process.env.PORT
import aiRoute from "./routes/ai.route.js"

app.use(express.json())
app.use(cors())

app.post('/ai', aiRoute)

app.listen(port, ()=>{
    console.log("Server Running on ", port)
})