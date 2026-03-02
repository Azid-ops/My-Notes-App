const fs = require("fs");
const path = require("path");

// Path to your pages.json
const pagesPath = path.join(__dirname, "../../src/data/pages.json");
const pages = JSON.parse(fs.readFileSync(pagesPath, "utf-8"));

// Iterate and replace blocksFile with actual blocks array
const updatedPages = pages.map((page) => {
  if (page.blocksFile) {
    // Updated path to src/blocks
    const blocksPath = path.join(__dirname, "..", page.blocksFile);
    const blocks = JSON.parse(fs.readFileSync(blocksPath, "utf-8"));
    return { ...page, blocks };
  }
  return page;
});

// Write merged file (overwrite pages.json or create new file)
fs.writeFileSync(pagesPath, JSON.stringify(updatedPages, null, 2), "utf-8");

console.log("Pages merged successfully!");