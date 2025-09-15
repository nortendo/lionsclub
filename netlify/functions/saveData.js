const fs = require('fs');
const path = require('path');

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  const dataFile = path.join("/tmp", "data.json");
  let data = [];

  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  }

  try {
    const body = JSON.parse(event.body);
    data.push(body);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return { statusCode: 200, body: JSON.stringify({ message: "Données sauvegardées ✅", data }) };
  } catch (err) {
    return { statusCode: 400, body: "Erreur dans les données envoyées" };
  }
};
