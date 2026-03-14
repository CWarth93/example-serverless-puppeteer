/**
 * Runs first when the API route loads on Vercel. Sets Lambda env vars so
 * @sparticuz/chromium detects the environment and extracts shared libs (al2).
 * Also suppresses DEP0169 (url.parse) deprecation from dependencies.
 */
if (process.env.VERCEL) {
	process.env.AWS_EXECUTION_ENV = process.env.AWS_EXECUTION_ENV || 'AWS_Lambda_nodejs18.x';
	process.env.AWS_LAMBDA_JS_RUNTIME = process.env.AWS_LAMBDA_JS_RUNTIME || 'nodejs18.x';

	if (typeof process.emitWarning === 'function') {
		const orig = process.emitWarning;
		process.emitWarning = (warning, ...args) => {
			const code = args[2] ?? (args[1] && typeof args[1] === 'object' && args[1].code);
			if (code === 'DEP0169' || (typeof warning === 'string' && warning.includes('url.parse'))) return;
			return orig.apply(process, [warning, ...args]);
		};
	}
}
