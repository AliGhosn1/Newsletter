const https = require("https");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) =>{
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;


    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/5be1452ac1";

    const options = {
        method: "POST",
        auth: "ali:8e11430bdb78fe93024d7abe8edca1a0-us10"
    };
    
    const sendRequest = https.request(url, options, (response) =>{
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    sendRequest.write(jsonData);
    sendRequest.end();
});

app.get("/fail", (req, res) =>{
    res.redirect("/");
});

app.listen(3000, () =>{
    console.log("Server started on port 3000.")
});


//Key= 8e11430bdb78fe93024d7abe8edca1a0-us10
//List Id= 5be1452ac1