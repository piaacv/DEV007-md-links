const fetch = require("node-fetch");

function extractLinks(fileContent) {
    const searchingLinks = /\[(.+)\]\(([^ ]+?)( "(.+)")?\)/g
    const linksFound = [];
    let match;
    while((match = searchingLinks.exec(fileContent)) !== null) {
     const text = match[1];
     const url = match[2];
     linksFound.push({text,url});
    };
    return linksFound;
  }
  const validateLink = (link) => {
    if (link && link.url){
    return fetch(link.url)
    .then((response) =>{
      if(response.status >= 200 && response.status < 400) {
        link.status = response.status;
        link.ok = "Ok";
        return link;
      } else {
        link.status = response.status;
        link.ok = "Broke";
        return link;
      }
  
    })
    .catch((error) => {
      link.status = "Error";
      link.ok = "Failed";
      return link;
  })
    }}

const stats =(links) => {
        return {
          Total: links.length,
          Unique: new Set(links.map((link) => link.url)).size,
        }
};

const statsAndValidate = (links) => {
    const brokenLinks = links.filter((link) => link.ok !=="Ok").length;
    return {
      Total: links.length,
      Unique: new Set(links.map((link) => link.url)).size,
      Broken: brokenLinks,
    }
  }

  module.exports = { extractLinks, validateLink, stats, statsAndValidate };