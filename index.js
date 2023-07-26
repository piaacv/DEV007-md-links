// module.exports = () => {
//   // ...
// };
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
// to have path
const route = process.argv[2];
console.log(route, "input route");


// is the path exist?
const routeExist = fs.existsSync(route);
console.log(`does the route exist? ${routeExist}`);
if(!routeExist) {
  console.log("Route doesn't find");
} else {
  let routeAbsolute ="";
  if(!path.isAbsolute(route)) {
    routeAbsolute = path.resolve(route);
    console.log(`${route} converted to absolute route: ${routeAbsolute}`);
  } else {
  routeAbsolute = route; //if the route is absolute, is it saved in the same variable?
  console.log(`the route is already absolute: ${routeAbsolute}`);
  } 
 // is the route a file or a folder?
 try {
  const stats = fs.statSync(routeAbsolute);

  if (stats.isDirectory()) {
    console.log("Should be a file, not a folder");
  } else {
    console.log("It's a file");
  }
} catch (err) {
  throw err;
}
// is it a md file?
const extention = path.extname(routeAbsolute);
if (extention != ".md"){
console.log(`Should be a .md file not ${extention}`);
} else {
  // read file
  const fileContent = fs.readFileSync(routeAbsolute, "utf-8");
  // console.log(fileContent);
  
  // is there links?
  const resultSearchLinks = /\[(.+)\]\(([^ ]+?)( "(.+)")?\)/.test(fileContent);
  let findingLinks;
    if(resultSearchLinks){
      findingLinks = 'It has links';
    } else {
      findingLinks = 'It has no links';
    }
  console.log(`Does the file have links? ${findingLinks}`);
  //Extract links
  function extractLinks() {
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
  const linksExtractedFound = extractLinks(fileContent);
  console.log(`The fail has the following links:`)
  linksExtractedFound.forEach((link,index) => {
    console.log(`Link ${index + 1}:`);
    console.log(`Text: ${link.text}`);
    console.log(`URL: ${link.url}`);
  })
  //Function validateLink
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
  const validatePromises = linksExtractedFound.map((link) => validateLink(link));
  Promise.all(validatePromises)
  .then((validatedLinks) => {
    // Imprimir los resultados de validación
    validatedLinks.forEach((validatedLink, index) => {
      console.log(`Link ${index + 1}:`);
      console.log(`Text: ${validatedLink.text}`);
      console.log(`URL: ${validatedLink.url}`);
      console.log(`Status: ${validatedLink.status}`);
      console.log(`OK: ${validatedLink.ok}`);
    });

    // Calcular y mostrar el total de links usando la función stats
    console.log("stats:", stats(validatedLinks));
    console.log("stats and validate:", statsAndValidate(validatedLinks));
  })
  .catch((error) => {
    console.error("Error occurred during validation:", error);
  });
  
//Function stats
const stats =(links) =>{
  return {
    Total: links.length,
    Unique: new Set(links.map((link) => link.url)).size,
  }
};

}
 //Function Stats and Validate
const statsAndValidate = (links) => {
  const brokenLinks = links.filter((link) => link.ok !=="Ok").length;
  return {
    Total: links.length,
    Unique: new Set(links.map((link) => link.url)).size,
    Broken: brokenLinks,
  }
}

};


