import { getGroupPostsByKeywords } from '../business/facebook';

const handler = async (group, keywords) => {
	return await getGroupPostsByKeywords(group, keywords);
};

export default handler;
