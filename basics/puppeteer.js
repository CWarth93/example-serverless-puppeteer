const path = require('path');
const os = require('os');
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

const getBrowser = async () => {
	if (isServerless) {
		// Must set before require: chromium's top-level code uses this to extract al2 libs.
		if (process.env.VERCEL) {
			process.env.AWS_EXECUTION_ENV = process.env.AWS_EXECUTION_ENV || 'AWS_Lambda_nodejs18.x';
			process.env.AWS_LAMBDA_JS_RUNTIME = process.env.AWS_LAMBDA_JS_RUNTIME || 'nodejs18.x';
		}
		const chromium = require('@sparticuz/chromium');
		const puppeteer = require('puppeteer-core');
		chromium.setGraphicsMode = false;
		const executablePath = await chromium.executablePath();
		// Force lib path so the Chromium process finds libnss3.so, libnspr4.so.
		const al2Lib = path.join(os.tmpdir(), 'al2', 'lib');
		process.env.LD_LIBRARY_PATH = [al2Lib, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
		return puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath,
			headless: chromium.headless,
			ignoreHTTPSErrors: true,
		});
	}
	const puppeteer = require('puppeteer');
	return puppeteer.launch({
		headless: true,
		ignoreHTTPSErrors: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
};

const getPage = async (browser) => {
	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 800 });
	await page.setUserAgent(
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
	);
	return page;
};

const openUrl = async (page, url, options = {}) => {
	await page.goto(url, { timeout: options.timeout || 20000, waitUntil: 'load' });
};

const waitForElement = async (page, cssSelector, timeout) => {
	await page.waitForSelector(cssSelector, { timeout });
};

const waitForSelectorOptional = async (page, cssSelector, timeout = 3000) => {
	try {
		await page.waitForSelector(cssSelector, { timeout });
		return true;
	} catch (_) {
		return false;
	}
};

const getElement = async (page, cssSelector) => await page.$(cssSelector);

const getElements = async (page, cssSelector) => await page.$$(cssSelector);

const click = async (page, cssSelector) => {
	const el = await page.$(cssSelector);
	if (el) await el.click();
};

const getProperty = async (element, propertyName) => (await element.getProperty(propertyName)).jsonValue();

const closePage = async (page) => {
	await page.close();
};

const closeBrowser = async (browser) => {
	await browser.close();
};

module.exports = {
	getBrowser,
	getPage,
	openUrl,
	waitForElement,
	waitForSelectorOptional,
	getElement,
	getElements,
	getProperty,
	click,
	closePage,
	closeBrowser,
};
