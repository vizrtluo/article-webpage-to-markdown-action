const https = require('https');
const nodeFetch = require('node-fetch');
const fs = require('fs');
const {
  hostURL_EN,
  options
} = require('./toMarkdownConstant.js');
const {
  gatherInputs,
  inputExistCheck,
  isNewFile,
  addComment,
  getRouteAddr,
  haveRouterAddrmd,
  HTMLtoMarkdown
} = require('./utilities.js');

// cd ./news-translation
// You can run `node script\toMarkdown\index.js URL<String>`(URL is the URL of the article).
(async function toMarkdown() {
  try {
    const input = gatherInputs();

    await inputExistCheck(input);

    const articleChildRouter = await getRouteAddr(input.newsLink);

    const URL = `${hostURL_EN}/news/${articleChildRouter}/`;
    options.path = `/news/${articleChildRouter}/`;
    options.agent = new https.Agent(options);

    const articleFileName = await haveRouterAddrmd(articleChildRouter);
    const htmlString = await (await nodeFetch(URL, options)).text();
    const articleText = await HTMLtoMarkdown(htmlString);
      
    if (!await isNewFile(input.markDownFilePath + articleFileName)) {
      throw new Error('file has exist');
    } 

    await fs.writeFile(
      input.markDownFilePath + articleFileName,
      articleText,
      (err) => {
        if (err) return Promise.reject(err);
      }
    );
  } catch (error) {
      console.log('ERR:', error);
      addComment(error);
      process.exitCode = 1;
  }
})();
