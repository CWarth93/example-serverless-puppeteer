export default function Home() {
	return (
		<div style={{ padding: 40, fontFamily: 'sans-serif' }}>
			<h1>Search API</h1>
			<p>POST <code>/api/search</code> with body: <code>{'{"searchPhrase": "your query"}'}</code></p>
			<p>Returns the first 5 search result URLs.</p>
		</div>
	);
}
