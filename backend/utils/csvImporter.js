const fs = require("fs");
const csv = require("csv-parser");

/**
 * Parses a CSV file from disk into an array of row objects.
 * Expects the CSV's first row to be the header (column names must match
 * the keys used when mapping rows in the calling controller).
 * @param {string} filePath - path to the uploaded CSV file
 * @returns {Promise<Array<Object>>}
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => {
        fs.unlink(filePath, () => {}); // cleanup uploaded file
        resolve(results);
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
  });
};

module.exports = { parseCSV };
