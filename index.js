const fs = require("fs");
const path = require("path");
const { extractLinks, validateLink, stats, statsAndValidate } = require("./utils");

const mdLinks = (route, options = { stats: false, validate: false }) => {
  return new Promise((resolve, reject) => {
    const routeExist = fs.existsSync(route);
    // is the path exist?
    if (!routeExist) {
      reject("Route doesn't exist");
      return;
    }

    let routeAbsolute = "";
    if (!path.isAbsolute(route)) {
      routeAbsolute = path.resolve(route);
    } else {
      routeAbsolute = route;
    }

    try {
      const stats = fs.statSync(routeAbsolute);
      // is it a file or a folder?
      if (stats.isDirectory()) {
        reject("Should be a file, not a folder");
        return;
      }
      if (!stats.isFile()) {
        reject("Not a valid file");
        return;
      }
    } catch (err) {
      reject(err);
      return;
    }
    // is it a md extentions?
    const extention = path.extname(routeAbsolute);
    if (extention !== ".md") {
      reject(`Should be a .md file not ${extention}`);
      return;
    }

    const fileContent = fs.readFileSync(routeAbsolute, "utf-8");

    const linksExtractedFound = extractLinks(fileContent);

    if (!options.validate && !options.stats) {
      // Show detail of links
      const linkDetails = linksExtractedFound.map((link, index) => {
        return `
         Link ${index + 1}:
         Text: ${link.text}
         URL: ${link.url}
        `;
      });
      console.log(`The file has the following links:\n${linkDetails.join("\n")}`);
      resolve("Success");
      return;
    }

    const validatePromises = linksExtractedFound.map((link) => validateLink(link));
    Promise.all(validatePromises)
      .then((validatedLinks) => {
        if (options.validate && options.stats) {
          // Show stats and validate
          console.log("stats and validate:", statsAndValidate(validatedLinks));
        } else if (options.stats) {
          // Show stats
          console.log("stats:", stats(validatedLinks));
        } else {
          // Show validation
          const validationMessages = validatedLinks.map((validatedLink, index) => {
            return `
             Link ${index + 1}:
             Text: ${validatedLink.text}
             URL: ${validatedLink.url}
             Status: ${validatedLink.status}
             OK: ${validatedLink.ok}
            `;
          });
          console.log(validationMessages.join("\n"));
        }

        resolve("Success");
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = {
  mdLinks,
};
