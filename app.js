var express = require("express"),
    compression = require("compression"),
    app = express(),
    getBrief = require("./getbrief.js");

const { getPdf, getImg, getHtml } = require('./export.js')

const { Database } = require('./db.js');

var port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(compression());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = new Database;

// Redirect http requests to https
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        // Heroku does not set req.secure
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
}

app.get("/", function (req, res) {
    const options = getBrief.getOptions();
    res.render("pages/index", { options })
})

app.get("/about", function (req, res) {
    res.render("pages/about")
})

app.get("/v1", function (req, res) {
    res.render("pages/v1")
})

app.post("/brief", function (req, res) {
    var brief = new Object();
    var job = req.body.job;
    var industry = req.body.industry;

    if (job != "brandid") {
        brief.name = getBrief.companyName(industry);
    }
    brief.desc = getBrief.companyDesc(industry);
    brief.job = getBrief.jobDesc(job);
    brief.deadline = getBrief.deadline();

    try {
        db.logEvent('briefGeneration', 'briefsGenerated');
        db.logEvent('jobType', job);
        db.logEvent('industry', industry);
    } catch (e) {
        console.error(`Error logging events: ${e}`);
    }

    res.json(brief);
})

app.post("/export", async function (req, res) {
    const format = req.body.format;
    const html = getHtml(req.body.brief);
    if (format === 'img') {
        try {
            db.logEvent('exportType', 'img');
        } catch (e) {
            console.error(`Error logging events: ${e}`);
        }
        const buffer = await getImg({
            html: html
        });
        res.end(buffer)
    } else if (format === 'pdf') {
        try {
            db.logEvent('exportType', 'pdf');
        } catch (e) {
            console.error(`Error logging events: ${e}`);
        }
        const buffer = await getPdf({
            html: html
        });
        res.end(buffer)
    }
})

app.listen(port, function () {
    console.log(`${String.fromCodePoint(0x2728)}  Goodbrief server is running.`);
    console.log(`You can view it at http://localhost:${port}`);
})