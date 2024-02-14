import Papa from 'papaparse';

export function readCSV() {
  return new Promise((resolve, reject) => {
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      complete: function(results) {
        resolve(results.data);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
}