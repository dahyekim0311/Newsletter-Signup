const express = require('express');
const {
  Http2ServerRequest
} = require('http2');
const request = require('request')

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.post('/', (req, res) => {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const https = require('https');

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data)

  const url = 'https://us20.api.mailchimp.com/3.0/lists/afdb1ce179';

  const options = {
    method: "POST",
    auth: "dahye1:5cf116f07ee7471e4f5dfca35aa7f468-us20"
  }

  const request = https.request(url, options, (response) => {

    if (response.statusCode == 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");

    }
      
    response.on("data", function (data) {
      console.log(JSON.parse(data))

    })
  })
  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
 res.redirect("/")
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});