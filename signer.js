const fs = require('fs');
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

const keyPairId = 'xxxxxxxxxxxxxx'; // https://us-east-1.console.aws.amazon.com/cloudfront/v4/home#/publickey
const privateKeyPath = './private_key.pem';
const cloudfrontDomain = 'https://xxxxxxxxxxxxxx.cloudfront.net'; // https://us-east-1.console.aws.amazon.com/cloudfront/v4/home#/distributions
const completeUrl = `${cloudfrontDomain}/index.m3u8`; // index.m3u8 for HLS
const expireDate = "2099-01-01"

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const policy = {
  Statement: [
    {
      Resource: completeUrl,
      Condition: {
        DateLessThan: {
          "AWS:EpochTime": new Date(expireDate).getTime() / 1000,
        },
      },
    },
  ],
};
const policyString = JSON.stringify(policy);


(async () => {
  const signedUrl = getSignedUrl({
    keyPairId,
    policy: policyString, 
    privateKey,
  });
  console.log(`Signed Url: ${signedUrl}`);
})();
