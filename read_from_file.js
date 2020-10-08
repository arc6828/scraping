var fs = require('fs');

//READ COUNTRIES
let filename_countries = "json/countries.json";
let content_countries = fs.readFileSync(filename_countries).toString('utf8');
let countries = JSON.parse(content_countries);
//console.log(content);
countries.forEach((country,index)=>{
    console.log(country.name, country.code);
});

//READ PRODUCTS
let filename_products = "json/products.json";
let content_products = fs.readFileSync(filename_products).toString('utf8');
let products = JSON.parse(content_products);
//console.log(content);
products.forEach((product,index)=>{
    console.log(product.name, product.code);
});