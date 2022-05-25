import micro from 'micro-cors';
import searchGroupPosts from '../../handlers/searchGroupPosts';

const api = async (req, res) => {
	try {
		// read request
		const {
			query: { endpoint },
			method,
			headers,
			body,
		} = req;

		// process request
		let result;
		if (endpoint === 'searchGroupPosts') {
			const { group, keywords } = body;
			result = await searchGroupPosts(group, keywords);
		} else {
			throw new Error('Endpoint doesnt exist.');
		}

		// send response
		res.status('200').json(result);
	} catch (error) {
		res.status('500').json({ error: error.toString().split('Error: ')[1] });
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
	  'Bypass-Tunnel-Reminder'
	],
  });

export default cors(api);