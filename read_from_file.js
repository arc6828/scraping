//NIGHTMARE
const Nightmare = require('nightmare')
const nightmare = Nightmare({ 
    show: true,
    waitTimeout: 60000, // in ms or 1 minute 
    gotoTimeout: 60000, // in ms or 1 minute 
});

//READ FILES
var fs = require('fs');

//READ COUNTRIES
let filename_countries = "json/final-countries.json";
let content_countries = fs.readFileSync(filename_countries).toString('utf8');
let countries = JSON.parse(content_countries);
//console.log(content);

//READ PRODUCTS
let filename_products = "json/products.json";
let content_products = fs.readFileSync(filename_products).toString('utf8');
let products = JSON.parse(content_products);

//console.log(content);

//SAVE TO FILE HTML
(async function (){
    var count=0;
    var pages = [];
    for(let product of products){
        for(let country of countries){
            console.log(++count,product.name, product.code,country.name, country.code);
            
            await nightmare
                //TRADE MAP
                    //FETCH URL
                //.goto('https://www.trademap.org')
                .goto('file:///C:/Users/Chavalit/Documents/GitHub/scraping/Trade%20Map%20-%20List%20of%20supplying%20markets%20for%20a%20product%20imported%20by%20China.html')
                .evaluate(function(){
                    //console.log(hello);
                    return document.querySelector("#ctl00_PageContent_MyGridView1").parentNode.innerHTML;

                })
                .then(text => {
                    fs.writeFileSync("html/"+country.iso_code+"_"+product.code+".html", text);
                })
                .catch(error => {
                    console.error('Search failed:', error)
                })    
            
        }
        break;

    }
    
})();
