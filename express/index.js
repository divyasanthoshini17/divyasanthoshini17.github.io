var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var cookiseParser = require("cookie-parser");

app.use(cookiseParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  console.log("hello request recieved");
  console.log(res);
  res.send("Emi ra ela unnav");
});

function auth(req,res,next){
  if(req.cookies.username && req.cookies.password){
    next()
  }
  else{
      res.redirect("/login.html")
  }
}

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.cookie("password", req.body.password);
  res.send("hogaya login");
})

app.use(auth);


app.post("/addEnquiry", (req, res) => {
  console.log(req.body);
  var enquiries = JSON.parse(fs.readFileSync(__dirname + "/getEnquiries.txt").toString());
  enquiries.push(req.body);
  fs.writeFileSync(__dirname + "/getEnquiries.txt", JSON.stringify(enquiries, null, 2));
  // res.send("ayindhi " );
  res.redirect("/getEnquiries");
});

app.get("/deleteEnquiry/:id", (req, res) => {
  console.log(req.params.id);
  var id = req.params.id;
  var enquiries = JSON.parse(fs.readFileSync(__dirname + "/getEnquiries.txt").toString());
  enquiries.splice(id, 1);

  fs.writeFileSync(__dirname + "/getEnquiries.txt", JSON.stringify(enquiries, null, 2));
  res.redirect("/getEnquiries");
});

app.get("/getEnquiries", (req, res) => {
  var enquiries = JSON.parse(fs.readFileSync(__dirname + "/getEnquiries.txt").toString());
  var ui=`<div class="enquiries">`
  enquiries.forEach((enquiry,id) => {
    ui += `<p><strong>Name:</strong> ${enquiry.name}</p>
            <p><strong>Number:</strong> ${enquiry.Number}</p>
            <p><strong>Message:</strong> ${enquiry.message}</p>
            <a href="/deleteEnquiry/${id}">
              <button>Delete</button>
            </a>
            <hr>`;
  });
  ui += `</div>`;
  res.send(ui);
});


app.get("/abc", function (req, res) {
  res.send("You requested abc! em kavali");
});

app.get("/xyz", function (req, res) {
  res.send("Ok pada");
});

app.get("/products/:id",(req,res)=>{
  var id = req.params.id;
  var data = fs.readFileSync("products.txt");
  var details = JSON.parse(data.toString());
  console.log(details)
  var selectedProduct = details.products.find(p=>{
    console.log(p.id)
    console.log(id)
    return p.id==id
  })
  res.send(selectedProduct);
})


app.get("/products/getRange/:x/:y",(req,res)=>{
  var x = +req.params.x;
  var y = +req.params.y;
  var data = fs.readFileSync("products.txt");
  var details = JSON.parse(data.toString());
  console.log(details)
  var selectedProducts = details.products.filter((pr)=>{
    if(pr.id>x && pr.id<=y){
      return true
    }
  })
  res.send(selectedProducts);
})

app.get("/add/:x/:y", function (req, res) {
  console.log(req.cookies);
  console.log(req.params);
  res.send(+req.params.x + +req.params.y);
});

app.get("/sub/:x/:z", (req, res) => {
  res.send(req.params.x - req.params.z);
});

app.get("/products", (req, res) => {
  var data = fs.readFileSync("products.txt");
  var k = JSON.parse(data.toString());
  res.send(k);
});

app.listen(3500, () => {
  console.log("Server uriking on 3500");
});