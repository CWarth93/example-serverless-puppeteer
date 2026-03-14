const { getBrowser, getPage, openUrl, closePage, closeBrowser } = require('../basics/puppeteer');

const getSearchResultUrls = async (page, searchPhrase, maxCount = 5) => {
	await openUrl(page, 'https://html.duckduckgo.com/html/', { timeout: 15000 });
	await page.waitForSelector('input[name="q"]', { timeout: 10000 });
	await page.type('input[name="q"]', searchPhrase, { delay: 50 });
	await page.click('input[type="submit"]');
	await page.waitForSelector('.result', { timeout: 15000 });
	const urls = await page.evaluate((max) => {
		const links = document.querySelectorAll('a.result__a');
		const out = [];
		const seen = new Set();
		for (const a of links) {
			const href = a.href;
			if (!href || seen.has(href) || href.includes('duckduckgo.com')) continue;
			seen.add(href);
			out.push(href);
			if (out.length >= max) break;
		}
		return out;
	}, maxCount);
	return urls;
};

const getSearchUrls = async (searchPhrase) => {
	let browser;
	try {
		browser = await getBrowser();
		const page = await getPage(browser);
		const urls = await getSearchResultUrls(page, searchPhrase, 5);
		await closePage(page);
		await closeBrowser(browser);
		return { urls };
	} catch (error) {
		console.error(error);
		if (browser) await closeBrowser(browser).catch(() => {});
		return { urls: [], error: error.message };
	}
};

module.exports = { getSearchUrls };
