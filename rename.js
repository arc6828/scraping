//LOOP THROUGH COUNTRIES & PRODUCTS
const fs = require('fs');
const testFolder = './html/';

fs.readdirSync(testFolder).forEach(file => {
    let splits = file.split("_");
    if(splits.length == 5){
        //console.log();
        
        //let filename = "html/"+mode+"_"+unit+"_"+product.code+"_"+country.iso_code+"_.html";
        let newPath = "html/"+splits[0]+"_"+splits[1]+"_"+splits[3]+"_"+splits[2]+"_.html";
        let oldPath = "html/"+file;
        fs.renameSync(oldPath, newPath);
        console.log(newPath);
    }
});
