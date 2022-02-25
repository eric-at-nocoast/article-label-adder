require("dotenv").config();
let axios = require("axios");

//Authorization needs to be base64 encoded to be accepted by Zendesk
const encodedToken = Buffer.from(
  `${process.env.ZD_USER}/token:${process.env.ZD_TOKEN}`
).toString("base64");

// This is the config that we use for making our api requests through axios. It will be reassigned with different data for the appropriate call using Object.assign
let config = {
  method: "get",
  url: process.env.ZD_URL + "/api/v2/help_center/user_segments",
  headers: {
    Authorization: `Basic ${encodedToken}`,
    "Content-Type": "application/json",
  },
};

//This function receives the current iterations article id. It first checks if the article has a user_segment. If it doesn't it moves on to the next.
//If it does, then based off that checks the labels attached to the article to see if any of them matches the user_segment.
//If the user_segment label is not present then it updates the article with it.
const articleUpdater = async (article, userSegments) => {
  let articleId = JSON.stringify(article.id);
  let labelArr = article.label_names;

  if (article.user_segment_id != null) {
    let segmentObj = userSegments.find(
      ({ id }) => id === article.user_segment_id
    );

    if (article.label_names.length > 0) {

      let segmentLabel = article.label_names.find(
        (label) => label == segmentObj.user_type
      );
      let payload = {
        article: {
          label_names: labelArr,
        },
      };

      Object.assign(config, {
        method: "put",
        url:
          process.env.ZD_URL +
          `/api/v2/help_center/en-us/articles/${articleId}`,
        data: payload,
      });
      if (segmentLabel === undefined) {
        labelArr.push(segmentObj.user_type);
        const res = await axios(config);
        const segmentLabel =
          res.data.article.label_names[res.data.article.label_names.length - 1];
        return `Article ${res.data.article.id} updated! with the label ${segmentLabel}`;
      } else if (segmentLabel != undefined) {
        return `Article ${articleId} already has the user segment label`;
      }
    }
  }
  //If there is no userSegment then the article will be tagged with 'public'
  else {
    labelArr.push('public')
    let publicPayload = {
      article: {
        label_names: labelArr,
      },
    };

    Object.assign(config, {
      method: "put",
      url:
        process.env.ZD_URL +
        `/api/v2/help_center/en-us/articles/${articleId}`,
      data: publicPayload,
    });
    const response = await axios(config)
    return `Article ${response.data.article.id} updated! with the label public`
  };
};

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

//This function grabs a list of all the articles and then loops through them to the articleUpdater
const articleGetter = async (userSegments) => {
  Object.assign(config, {
    url: process.env.ZD_URL + `/api/v2/help_center/en-us/articles`,
  });
  const resp = await axios(config);
  let resultArr = [];
  //parsing the ticket id out of the response for use in updating the ticket
  let articleArr = resp.data.articles;
  for (i = 0; i < articleArr.length; i++) {
    await delay();
    const res = await articleUpdater(articleArr[i], userSegments);
    resultArr.push(res);
  }
  return resultArr;
};

async function main() {
  const res = await axios(config);
  const userSeg = res.data.user_segments;
  const results = await articleGetter(userSeg);
  console.log(results);
}

main().catch((err) => {
  console.log(err);
});
