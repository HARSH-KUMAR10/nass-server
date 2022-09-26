const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded());

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require("axios");

async function get_google(search){
    const result = await axios(`https://scholar.google.com/scholar?q=${search}+computer+networks`);
    const dom = await new JSDOM(result.data);
    spanList = dom.window.document.querySelectorAll('div.gs_rs');
    var response = spanList[1].textContent;
    return response;
}

async function get_wiki(search){
    const result = await axios(`https://en.wikipedia.org/wiki/${search}`);
    const dom = await new JSDOM(result.data);
    spanList = dom.window.document.querySelectorAll('p');
    var response = "";
    response = spanList[1].textContent;
    return response;
}


app.post("/google",async(req,res)=>{
    try{
    const {search} = req.body;
    result = await get_google(search);
    res.json({data:result,statusCode:200,message:"Found output"});
    }catch(err){
        res.json({statusCode:500,message:"Server Occured",data:err});
    }
});

app.post("/wiki",async(req,res)=>{
    try{
    const {search} = req.body;
    result = await get_wiki(search);
    res.json({data:result,statusCode:200,message:"Found output"});
    }catch(err){
        res.json({statusCode:500,message:"Server Occured",data:err});
    }
});

app.post("/wiki",async(req,res)=>{
    try{
    const {search} = req.body;
    result = await get_wiki(search);
    res.json({data:result,statusCode:200,message:"Found output"});
    }catch(err){
        res.json({statusCode:500,message:"Server Occured",data:err});
    }
})

app.get("/",(req,res)=>{
    res.json({statusCode:200,message:'Connected to Nass'});
})

app.listen(PORT,()=>console.log(`http://localhost:${PORT}`))