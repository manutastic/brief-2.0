const puppeteer = require('puppeteer');
const embeddedFonts  = require("./embeddedFonts.js");

exports.getPdf = async function (options) {
  const { html } = options
  let buffer;
  let browser;
  try {
    browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: 'networkidle0'});
    await page.evaluateHandle('document.fonts.ready');

    const bodyHeight = await page.evaluate(_ => {return document.querySelector('body').offsetHeight});
    const bodyWidth = await page.evaluate(_ => {return document.querySelector('body').offsetWidth});
    
    page.setViewport({width: bodyWidth, height: bodyHeight});
    
    const pageHeight = await page.evaluate(_ => {return document.querySelector('html').clientHeight});

    buffer = await page.pdf({
      printBackground: true,
      height: pageHeight,
      pageRanges: '1',
      margin: {
          left: '0px',
          top: '0px',
          right: '0px',
          bottom: '0px'
      }
  })
  } catch (e) {
    console.log(e)
  } finally {
    await browser.close();
  }
  return buffer;

}

exports.getImg = async function (options) {
  const { html } = options
  let buffer;
  let browser;
  try {
    browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: 'networkidle0'});
    await page.evaluateHandle('document.fonts.ready');  

    const bodyHeight = await page.evaluate(_ => {return document.querySelector('body').offsetHeight});
    const bodyWidth = await page.evaluate(_ => {return document.querySelector('body').offsetWidth});
    
    page.setViewport({width: bodyWidth, height: bodyHeight});
    
    buffer = await page.screenshot()
  } catch (e) {
    console.log(e)
  } finally {
    await browser.close();
  }
  return buffer;

}

exports.getHtml = function (brief) {
  let html = `<html>
    <head>
    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800" rel="stylesheet">
    <style>
    ${embeddedFonts}
    * {
      font-family: 'Nunito Sans', Roboto, 'Open Sans', Tahoma, Geneva, 'Helvetica Neue', Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    html {
      padding: 0;
      margin: 0;
    }
    body {
      padding: 60px;
      padding-top: 20px;
      background: #00BFA5;
      min-height: 0;
      height: min-content;
      margin: 0;
    }
    h1 {
      color: white;
      font-size: 1.5em;
      font-weight: normal;
      font-family: 'sofia_prolight','Nunito Sans', Roboto, 'Open Sans', Tahoma, Geneva, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    h1 strong {
      font-weight: normal;
      font-family: 'sofia_probold','Nunito Sans', Roboto, 'Open Sans', Tahoma, Geneva, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .brief {
      background: white;
      padding: 30px;
      border-radius: 3px;
    }
    .mono {
      font-family: monospace;
      color: #064038;
      opacity: .5;
      font-size: small;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    h2 {
      margin: 0;
      font-size: 1em;
    }
    p {
      margin-top: 0;
    }
    </style>
    </head>
    <body>
    <h1>good<strong>brief</strong>.io</h1>
    <div class='brief'>
    <p class='mono'>Design Brief</p>
    ${
      brief.name ?
      `<h2>Company Name:</h2><p>${brief.name}</p>`
      :
      ''
    }
    <h2>Company Description:</h2>
    <p>${brief.desc}</p>
    <h2>Job Description</h2>
    <p>${brief.job}</p>
    <h2>Deadline</h2>
    <p>${brief.deadline}</p>
    </div></body></html>`;
  return html;
}