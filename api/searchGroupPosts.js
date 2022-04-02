import { getGroupPostsByKeywords } from '../business/facebook';

const endpoint = async (req, res) => {
  const { group, keywords } = req.body;

  try {    
    const res = await getGroupPostsByKeywords(group, keywords);
    if(res.hits) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.setHeader("Content-Type", `application/json`);
      res.status('200').json({ hits: res.hits });
    } else if (res.file) {      
      res.statusCode = 200;
      res.setHeader("Content-Type", `image/png`);
      res.end(file);
    }
  } catch (e) {
    res.statusCode = 500;
    res.json({
      body: "Sorry, Something went wrong!",
    });
  }
};


export default endpoint;