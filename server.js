const dotenv=require ("dotenv") 
const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const PORT=9090
const app=express()
dotenv.config()

// body parts 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// set views folder in express
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
//public folder 
app.use(express.static(path.join(__dirname,"public")))


mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Database connected successfully");
})
.catch((err) => {
    console.log("Database error:", err);
});

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/service",(req,res)=>{
    res.render("service/service.ejs")
})
app.get("/about",(req,res)=>{
    res.render("about/about.ejs")
})
app.get("/id-cards",(req,res)=>{
    res.render("idcard/idcard.ejs")
})

app.get("/contect",(req,res)=>{
    res.render("contected/contect.ejs")
})
const contactRoutes = require("./routes/contactRoutes");

// routes use
app.use("/", contactRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});