
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();


const app = express();

// .................static folder.............................
app.use(express.static(path.join(__dirname, "public")));

// ................body parser middleware.....................
app.use(bodyParser.urlencoded({extended : true}));

// ...............signup route..................
app.post("/signup", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

 // ....Make sure the fields are filled...
 if(!firstName || !lastName || !email){
   res.redirect("/failure.html");
   return;
 }else{
   res.redirect("/success.html");
 }

// **************api setup**********************

// ................member fields...........
const data = {
        members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }]
    };

const postData = JSON.stringify(data);

const options = {
  url : API_URL,
  method : "POST",
  headers:{
  Authorization : process.env.API_KEY
},
  body : postData
}

// ..............mailchimp request.............\
request(options, (err, response, body) => {
  if(err){
    res.redirect("/failure.html");
  }else{
    if (response.statusCode === 200){
        res.redirect("/success.html");
    }else{
      res.redirect("/failure.html");
    }
  }
 });
});

app.post("/failure.html", function(req,res){
  res.redirect("/index.html");
})




const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
