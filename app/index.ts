import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import fs from 'fs';
import sha1 from 'sha1';

const PORT = Number(process.env.PORT) || 8080;
const FOLDER = (String(process.env.FOLDER) || 'public') + '/';

const app: express.Application = express();
app.use(cors());
app.use(express.static(FOLDER));

const delay = (time: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

app.get('/', async (req: express.Request, res: express.Response) => {
  const url = String(req.query.url) || '';
  if (
    !/^https:\/\/slides\.nico\.dev\/[0-9a-z-]*\/(\#\/([0-9]*\/?)*)?$/.test(url)
  ) {
    res.status(400).send('invalid url');
    return;
  }

  !fs.existsSync(FOLDER) && fs.mkdirSync(FOLDER);
  !fs.existsSync(`${FOLDER}images/`) && fs.mkdirSync(`${FOLDER}images/`);
  const width = Number(req.query.width) || 900;
  const height = Number(req.query.height) || 500;
  const force = String(req.query.rebuild) === 'true';
  const image = `${FOLDER}images/${sha1(url + width + height)}.png`;

  if (!fs.existsSync(image) || force) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    const removeElement = async (selector: string): Promise<void> => {
      await page.evaluate(sel => {
        const elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, selector);
    };

    await page.goto(url);
    await page.evaluate(sel => {
      const elements = document.querySelectorAll(sel);
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block';
      }
    }, '.puppeteer');
    await page.setViewport({
      width,
      height,
      //deviceScaleFactor: 2,
    });
    await delay(1000);
    await removeElement('.controls');
    await removeElement('.progress');
    await removeElement('.footer');
    await page.screenshot({
      path: image,
      fullPage: true,
    });
    //await browser.close();
  }

  const file = await fs.readFileSync(image);
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': file.length,
  });

  res.end(file, 'binary');
});

app.listen(PORT, () => console.log(`APP listening to ${PORT}!`));
