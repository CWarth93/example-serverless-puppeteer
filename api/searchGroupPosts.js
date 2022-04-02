import { getGroupPostsByKeywords } from '../business/facebook';

const endpoint = async (req, res) => {
  const { group, keywords } = req.body;

  try {    
    const { hits } = await getGroupPostsByKeywords(group, keywords);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Content-Type", `application/json`);
    res.status('200').json({ hits });
  } catch (e) {
    res.statusCode = 500;
    res.json({
      body: "Sorry, Something went wrong!",
    });
  }
};


export default endpoint;