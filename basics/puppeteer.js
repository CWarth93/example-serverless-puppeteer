const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

const getBrowser = async () => {
	try { 
		const options = {
			args: chrome.args,
			executablePath: await chrome.executablePath,
			headless: chrome.headless,
		  };
		const browser = await puppeteer.launch(options);
		return browser;
	} catch (e) {
		console.log(e);
	}
};

const getPage = async (browser) => {
	const page = await browser.newPage();
	return page;
};

const openUrl = async (page, url) => {
	await page.goto(url);
};

const waitForElement = async (page, cssSelector, timeout) => {
	await page.waitForSelector(cssSelector, { timeout });
};

const getElement = async (page, cssSelector) => await page.$(cssSelector);

const getElements = async (page, cssSelector) => await page.$$(cssSelector);

const getProperty = async (page, cssSelector, propertyName) => (await (await getElement(page, cssSelector)).getProperty(propertyName)).jsonValue();

const _getProperty = async (element, propertyName) => (await element.getProperty(propertyName)).jsonValue();

const getElementByProperty = async (page, cssSelector, propertyName, propertyValue) => {
	let allElements = await getElements(page, cssSelector);
	let i = 0;
	while (i < allElements.length) {
		if ((await _getProperty(allElements[i], propertyName)) === propertyValue) {
			return allElements[i];
		} else {
			i++;
		}
	}
	return null;
};

const getElementByPropertyIncludes = async (page, cssSelector, propertyName, propertyValueInclude) => {
	let allElements = await getElements(page, cssSelector);
	let i = 0;
	while (i < allElements.length) {
		if ((await _getProperty(allElements[i], propertyName)).includes(propertyValueInclude)) {
			return allElements[i];
		} else {
			i++;
		}
	}
	return null;
};

const getElementsByPropertyIncludes = async (page, cssSelector, propertyName, propertyValueInclude) => {
	let allElements = await getElements(page, cssSelector);
	let correctElements = [];
	let i = 0;
	while (i < allElements.length) {
		if ((await _getProperty(allElements[i], propertyName)).includes(propertyValueInclude)) {
			correctElements.push(allElements[i]);
		}
		i++;
	}
	return correctElements;
};

const setInputValue = async (page, cssSelector, value) => {
	await page.evaluate(
		(data) => {
			return (document.querySelector(data.cssSelector).value = data.value);
		},
		{ cssSelector, value }
	);
};

const getChilds = async (page, cssSelector) => await page.evaluate((element) => element.childNodes, await getElement(page, cssSelector));

const _getChilds = async (page, element) => await page.evaluate((element) => element.childNodes, element);

const click = async (page, cssSelector) => {
	await (await getElement(page, cssSelector)).click();
};

const _click = async (element) => {
	await element.click();
};

const focus = async (page, cssSelector) => {
	await page.focus(cssSelector);
};

const press = async (page, key) => {
	await page.keyboard.press(key);
};

const type = async (page, text) => {
	await page.keyboard.type(text, { delay: 5 });
};

const sleep = async (page, ms) => {
	await page.waitFor(ms);
};

const runJavascript = async (page, jsFunction, params) => {
	await page.evaluate(jsFunction, params);
};

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
	getElement,
	getElements,
	getProperty,
	_getProperty,
	getElementByProperty,
	getElementByPropertyIncludes,
	getElementsByPropertyIncludes,
	setInputValue,
	getChilds,
	_getChilds,
	click,
	_click,
	focus,
	press,
	type,
	sleep,
	runJavascript,
	closePage,
	closeBrowser,
};
