import puppeteer from 'puppeteer';

const url = 'https://slides.nico.dev/230525-robots-webinale/#/';
const width = 900;
const height = 500;

(async (): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width,
    height,
    //deviceScaleFactor: 2,
  });
  await page.goto(url);
})();
