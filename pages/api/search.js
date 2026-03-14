import micro from 'micro-cors';
import { spawn } from 'child_process';
import path from 'path';

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

const runSearchInChild = (searchPhrase) =>
	new Promise((resolve, reject) => {
		const root = path.resolve(process.cwd());
		const scriptPath = path.join(root, 'run-search.js');
		const child = spawn(
			process.execPath,
			['--openssl-legacy-provider', scriptPath, searchPhrase],
			{
				cwd: root,
				env: { ...process.env, IS_LOCAL: 'true' },
				stdio: ['ignore', 'pipe', 'pipe'],
			}
		);
		let stdout = '';
		let stderr = '';
		child.stdout.on('data', (d) => (stdout += d));
		child.stderr.on('data', (d) => (stderr += d));
		const timeout = setTimeout(() => {
			child.kill('SIGTERM');
			reject(new Error(`Search timed out after ${SEARCH_TIMEOUT_MS / 1000}s. ${stderr || ''}`));
		}, SEARCH_TIMEOUT_MS);
		child.on('close', (code, signal) => {
			clearTimeout(timeout);
			if (signal === 'SIGTERM') {
				reject(new Error('Search timed out'));
				return;
			}
			if (code !== 0) {
				reject(new Error(stderr || 'Search failed'));
				return;
			}
			try {
				resolve(JSON.parse(stdout));
			} catch (_) {
				reject(new Error('Invalid response'));
			}
		});
		child.on('error', (err) => {
			clearTimeout(timeout);
			reject(err);
		});
	});

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

		const result = await runSearchInChild(searchPhrase.trim());
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
