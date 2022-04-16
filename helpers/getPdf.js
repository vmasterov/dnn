const puppeteer = require("puppeteer");

const getPdf = async ({ title, html }) => {
  const launchOptions = { headless: true, args: ["--no-sandbox"] };
  const browser = await puppeteer.launch(launchOptions);

  const content = `<h1>${title}</h1>${html}`;
  const fileName = title.split(" ").join("-") + ".pdf";

  const page = await browser.newPage();

  const contentOptions = { waitUntil: "load" };
  await page.setContent(content, contentOptions);

  await page.emulateMediaType("screen");

  const pdfBufferOptions = {
    format: "A4",
    margin: { top: 30, bottom: 30, left: 30, right: 30 },
  };
  const pdfBuffer = await page.pdf(pdfBufferOptions);

  await browser.close();

  return { pdf: pdfBuffer, name: fileName };
};

module.exports = getPdf;
