const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const getOptions = async (isDev) => {
  let options;
  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}

const endpoint = async (req, res) => {
  const pageToScreenshot = req.query.page;
  const isDev = req.query.isDev === "true";

  try {
    const options = await getOptions(isDev);
    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(pageToScreenshot);
    const file = await page.screenshot({
      type: "png",
    });
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Content-Type", `image/png`);
    res.end(file);
  } catch (e) {
    res.statusCode = 500;
    res.json({
      body: "Sorry, Something went wrong!",
    });
  }
};


export default endpoint;