var fs = require('fs');
let filename = "Trade Map - List of supplying markets for a product imported by China.html";
fs.readFile(filename, (err, data) => {
    if (err) throw err;
    console.log(data.toString('utf8'));
});
