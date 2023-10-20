require('dotenv').config();
const CosmosClient = require("@azure/cosmos").CosmosClient;

const endpoint = `${process.env.ENDPOINT}`;
const key = `${process.env.KEY}`;

const options = {
    endpoint: endpoint,
    key: key,
    userAgentSuffix: 'CosmosDBJavascriptQuickstart'
};
const getClient = (async) => {
    try {
      return new CosmosClient(options);
    } catch (e) {
      if(e.code === "ERR_INVALID_URL"){
        console.log("Primary Key or URL is not correct");
        return ({"error": "Primary Key or URL is not correct"});
      }
      else{
        console.log(e);
        return ({"error": "Internal Server Error"});
      } 
    }  
};

module.exports = { getClient };


