var express     = require("express"),
    app         = express(),
    sass        = require("node-sass"),
    bodyParser  = require("body-parser"),
    getBrief    = require("./getbrief.js")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.render("pages/index")
})

app.get("/about", function(req, res) {
    res.render("pages/about")
})


app.post("/", function(req, res) {
    var brief = new Object();
    var job = req.body.job;
    var industry = req.body.industry;
    if (job == "brandid"){
        brief.name = "";
    } else {
        brief.name = getBrief.companyName(industry);
    }
    brief.desc = getBrief.companyDesc(industry);
    brief.job = getBrief.jobDesc(job, industry);
    brief.deadline = getBrief.deadline();
    res.render("pages/index", {brief: brief});
})

app.listen(8000, function() {
    console.log("Brief server running...")
})