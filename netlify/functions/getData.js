const fs = require('fs');
const path = require('path');

exports.handler = async function() {
  const dataFile = path.join("/tmp", "data.json");

  if (!fs.existsSync(dataFile)) {
    return { statusCode: 200, body: JSON.stringify([]) };
  }

  const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  return { statusCode: 200, body: JSON.stringify(data) };
};
