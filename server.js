const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");

async function get_google(search) {
  const result = await axios(
    `https://scholar.google.com/scholar?q=${search}+computer+networks`
  );
  const dom = await new JSDOM(result.data);
  spanList = dom.window.document.querySelectorAll("div.gs_rs");
  var response = spanList[1].textContent;
  return response;
}

async function get_wiki(search) {
  const result = await axios(`https://en.wikipedia.org/wiki/${search}`);
  const dom = await new JSDOM(result.data);
  spanList = dom.window.document.querySelectorAll("p");
  var response = "";
  response = spanList[25].textContent;
  return response;
}

async function get_ibm(search) {
  const token = Buffer.from(
    `apikey:XnFNu8Cp0jTFwqP844yZFLtI5GfzQXYjSzew2SCAxAs4`,
    "utf8"
  ).toString("base64");
  var searchString ="";
  console.log('ibm : ',search);
  var searchList = search.split(" ");
  for(var i=0;i<searchList.length;i++){
    searchString+=searchList[i]+"%20";
  }
  
  console.log('searchString:',searchString)
  const result = await axios(
    `https://api.eu-gb.discovery.watson.cloud.ibm.com/instances/073787b8-0498-4692-beb8-18e065bc2e71/v1/environments/6377d0e6-3ccb-4b94-9c3c-46b17fe427b2/collections/85b40339-bfc5-4f45-ae7e-cae0bea96ff6/query?version=2019-04-30&natural_language_query=${searchString}&return=text`,
    {
      headers: {
        Authorization: `Basic ${token}`,
      },
    }
  );
  console.log(result.data.results[0]);
  return result.data.results[0].text;
}

app.post("/google", async (req, res) => {
  try {
    const { search } = req.body;
    result = await get_google(search);
    res.json({ data: result, statusCode: 200, message: "Found output" });
  } catch (err) {
    res.json({ statusCode: 500, message: "Server Occured", data: err });
  }
});

app.post("/wiki", async (req, res) => {
  try {
    const { search } = req.body;
    result = await get_wiki(search);
    res.json({ data: result, statusCode: 200, message: "Found output" });
  } catch (err) {
    res.json({ statusCode: 500, message: "Server Occured", data: err });
  }
});

app.get("/IBM", async (req, res) => {
  try {
    const { search } = req.query;
    console.log('back : ',req.query);
    result = await get_ibm(search);
    res.json({ data: result, statusCode: 200, message: "Found output" });
  } catch (err) {
    console.log(err);
    res.json({ statusCode: 500, message: "Server Error Occured", data: err });
  }
});

app.get("/", (req, res) => {
  res.json({ statusCode: 200, message: "Connected to Nass" });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
