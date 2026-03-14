import micro from 'micro-cors';

let searchModule = null;
const getSearchUrlsFromModule = async (...args) => {
	if (!searchModule) searchModule = await import('../../business/search.js');
	const { getSearchUrls } = searchModule.default || searchModule;
	return getSearchUrls(...args);
};

const parseBody = (req) =>
	new Promise((resolve) => {
		if (typeof req.body === 'object' && req.body !== null) {
			resolve(req.body);
			return;
		}
		let data = '';
		const timeout = setTimeout(() => resolve(data ? JSON.parse(data) : {}), 5000);
		req.on('data', (chunk) => (data += chunk));
		req.on('end', () => {
			clearTimeout(timeout);
			try {
				resolve(data ? JSON.parse(data) : {});
			} catch (_) {
				resolve({});
			}
		});
	});

const SEARCH_TIMEOUT_MS = 15000;

const runSearchWithTimeout = (searchPhrase) => {
	return Promise.race([
		getSearchUrlsFromModule(searchPhrase),
		new Promise((_, reject) =>
			setTimeout(
				() => reject(new Error(`Search timed out after ${SEARCH_TIMEOUT_MS / 1000}s`)),
				SEARCH_TIMEOUT_MS
			)
		),
	]);
};

const api = async (req, res) => {
	if (req.method === 'GET') {
		return res.status(200).json({ ok: true, message: 'POST with body: { "searchPhrase": "..." }' });
	}
	try {
		const body = await parseBody(req);
		const { searchPhrase } = body;

		if (!searchPhrase || typeof searchPhrase !== 'string') {
			return res.status(400).json({ error: 'searchPhrase is required' });
		}

		const result = await runSearchWithTimeout(searchPhrase.trim());
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.toString().replace(/^Error:\s*/, '') });
	}
};

const cors = micro({
	allowHeaders: [
		'X-Requested-With',
		'Access-Control-Allow-Origin',
		'X-HTTP-Method-Override',
		'Content-Type',
		'Authorization',
		'Accept',
		'Bypass-Tunnel-Reminder',
	],
});

export default cors(api);
