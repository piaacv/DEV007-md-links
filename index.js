// module.exports = () => {
//   // ...
// };
const fs = require("fs");
const path = require("path");
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
  const searchLinks = fileContent
  const resultSearchLinks = /\[(.+)\]\(([^ ]+?)( "(.+)")?\)/.test(searchLinks);
  function checkLinks(){
    let findingLinks;
    if(resultSearchLinks){
      findingLinks = 'It has links';
    } else {
      findingLinks = 'It has no links';
    }
    console.log(`Does the file have links? ${findingLinks}`);
  }
  
  //search for url links
  checkLinks();
}

// the return value is a promise
};
