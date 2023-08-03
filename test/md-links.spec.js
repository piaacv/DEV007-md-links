// const { mdLinks } = require ('../index.js');
// // const { extractLinks, validateLink, stats, statsAndValidate } = require("./utils");


// describe('mdLinks', () => {

//   it('should be reject if path doen´t exist', () => {
//     return mdLinks("exmaple.md").catch((error) =>
//     expect(error).toBe("Route doesn't exist")
//     )
//   });
  
//   // it('should')
 
//   it("return stats", () => {
//     mdLinks("./readme.md", { stats: true }).then((result) =>
//       expect(result.stats).toEqual({ Total: 80, Unique: 75 }),
//     );
//   });
//   it("return links details when validate is true", () => {
//     mdLinks("./readme.md", { validate: true }).then((result) =>
//       expect(result.linksExtractedFound[0]).toEqual({
//         link: "",
//         text: "1. Preámbulo",
//         URL: "#1-preámbulo",
//         status: "Error",
//         ok: "Failed",
//       }),
//     );
//   });

//   it(" when validate y stats are true", () => {
//     mdLinks("./readme.md", { stats: true, validate: true }).then((result) =>
//       expect(result).toEqual({ Total: 80, Unique: 75, Broken: 17 }),
//     );
//   });


// });

const { mdLinks } = require('../index.js');
const { extractLinks, validateLink, stats, statsAndValidate } = require('../utils.js');

describe('mdLinks', () => {
  it('should reject if path doesn’t exist', () => {
    return expect(mdLinks('nonexistent.md')).rejects.toBe('Route doesn\'t exist');
  });

  it('should resolve with success when no options provided', () => {
    const result = mdLinks('C:/Users/vasxi/OneDrive/Escritorio/Laboratoria/DEV007-md-links/README.md', {});
    expect(result).resolves.toBe('Success');
  });

  it('should resolve with success when only stats option provided', () => {
    const result =  mdLinks('C:/Users/vasxi/OneDrive/Escritorio/Laboratoria/DEV007-md-links/README.md', { stats: true });
    expect(result).resolves.toBe('Success');
  });

  it('should resolve with success when only validate option provided', () => {
    const result = mdLinks('C:/Users/vasxi/OneDrive/Escritorio/Laboratoria/DEV007-md-links/README.md', { validate: true });
    expect(result).resolves.toBe('Success');
  });

  it('should reject if the file is not .md extension', () => {
    return expect(mdLinks('C:/Users/vasxi/OneDrive/Escritorio/Laboratoria/DEV007-md-links/thumb.png')).rejects.toBe('Should be a .md file not .png');
  });

  it('should reject if the path is a directory', () => {
    return expect(mdLinks('C:/Users/vasxi/OneDrive/Escritorio/Laboratoria/DEV007-md-links/test')).rejects.toBe('Should be a file, not a folder');
  });
  
  it('should handle empty file content', () => {
    const fileContent = '';
    const expectedLinks = [];
    expect(extractLinks(fileContent)).toEqual(expectedLinks);
  });

  it('should extract links from file content', () => {
    const fileContent = `
      [Link 1](https://example.com)
      [Link 2](https://test.com)
    `;
    const expectedLinks = [
      { text: 'Link 1', url: 'https://example.com' },
      { text: 'Link 2', url: 'https://test.com' },
    ];
    expect(extractLinks(fileContent)).toEqual(expectedLinks);
  });

  it('should validate a link', () => {
    const link = { text: 'Link 1', url: 'https://example.com' };
    return validateLink(link).then((result) => {
      expect(result).toEqual({
        ...link,
        status: 200,
        ok: 'Ok',
      });
    });
  });

  it('should calculate link stats', () => {
    const links = [
      { text: 'Link 1', url: 'https://example.com' },
      { text: 'Link 2', url: 'https://test.com' },
    ];
    const expectedStats = { Total: 2, Unique: 2 };
    expect(stats(links)).toEqual(expectedStats);
  });

  it('should calculate link stats and validation', () => {
    const links = [
      { text: 'Link 1', url: 'https://example.com', status: 200, ok: 'Ok' },
      { text: 'Link 2', url: 'https://test.com', status: 404, ok: 'Broke' },
    ];
    const expectedStats = { Total: 2, Unique: 2, Broken: 1 };
    expect(statsAndValidate(links)).toEqual(expectedStats);
  });

  

});
