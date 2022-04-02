import { _click, closeBrowser, getBrowser, getElementByProperty, getPage, openUrl, waitForElement, getElements, _getProperty } from '../basics/puppeteer';
import { asyncForEach } from '../basics/loops';

const getGroupPostsByKeywords = async (group, keywords) => {
	let browser;
	let page;
	try {
		browser = await getBrowser();
		page = await getPage(browser);
		await openUrl(page, group.replace('www.', 'mbasic.'));
		const cookieButton = await getElementByProperty(page, 'button', 'name', 'accept_only_essential');
		if (cookieButton !== null) {
			await _click(cookieButton);
		}
		await waitForElement(page, '#m_group_stories_container', 5000);
		const articles = await getElements(page, 'article');
		let articleHTMLs = [];
		let articleTexts = [];
		await asyncForEach(articles, async (article) => {
			const html = await _getProperty(article, 'innerHTML');
			articleHTMLs.push(html);
			const text = await _getProperty(article, 'innerText');
			let splits = text.split('>').length > 1 ? text.split('>')[1].split('\n') : [text];
			let newArticleText = '';
			for (let i = 1; i < splits.length; i++) {
				newArticleText += splits[i];
			}
			articleTexts.push(newArticleText);
		});
		const posts = articleHTMLs.map((html, index) => ({ html, text: articleTexts[index] }));
		const postsFound = posts
			.filter((post) => {
				let found = false;
				keywords.forEach((keyword) => {
					if (post.text.includes(keyword)) {
						found = true;
					}
				});
				return found;
			})
			.map((post) => post.html);
		// Note: this wont work for other languages
		const hits = postsFound.map((post) => post.split(' mir</a>')[1].split('<a href="')[1].split('/?refid=')[0].replace('mbasic.', 'www.'));
		await closeBrowser(browser);
		return { hits };
	} catch (error) {
		console.error(error);
		try {
			const file = await page.screenshot({
				type: "png",
			  });
			await closeBrowser(browser);
			return { file };
		} catch(e) {
			console.error(e);
			return { hits: [], error: e };
		}
	}
};

export { getGroupPostsByKeywords };
