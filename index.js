const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(cors());


app.post('/get-keyword', async(req, res) => {
    const searchKeyword = req.body.searchTerm;

    console.log("searchKeyword data: ", searchKeyword);
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.copyright.gov');
    await page.setViewport({ width: 1366, height: 768});

    await page.type('#query', `${searchKeyword}`);
    await page.click('#search_form > div > span > button');
    await page.waitForSelector('#results');

    const data = await page.evaluate(() => {
        return {
          title: Array.from(document.querySelectorAll('.result > h4 > a')).map(elem => elem.innerText),
          urldata: Array.from(document.querySelectorAll('.result > span.url')).map(elem => elem.innerText),
          details: Array.from(document.querySelectorAll('.result > span.description')).map(elem => elem.innerText),
        };
      });
      let dataArray = [];
      for(let i = 0; i < data.title; i++) {
        let dataObj = {
          titleVal: data.title[i],
          urlVal: data.urldata[i],
          descriptionVal: data.details[i],
        }
        dataArray.push(dataObj);
      }
    await browser.close();
    res.status(200).json(data);
})


app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, 'Frontend', 'build')));
    res.sendFile(path.resolve(__dirname, 'Frontend', 'build', 'index.html'));
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


//Puppeteer headless mode
