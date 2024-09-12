const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const importDataFromCsv = async function (filePath) {
  try {
    const fileData = await readFileAsync(filePath, 'utf8');
    let data = [];
    fileData
      .trim()
      .split('\n')
      .forEach((line) => {
        let row = line.split(',');
        // Assuming the CSV columns are in order: code, fullname, bus
        data.push({
          code: row[0],
          fullname: row[1],
          bus: row[2]
        });
      });
    return JSON.stringify(data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

module.exports = { importDataFromCsv }