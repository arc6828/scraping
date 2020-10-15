const Nightmare = require('nightmare')
const nightmare = Nightmare({ 
    show: true,
    waitTimeout: 60000, // in ms or 1 minute 
    gotoTimeout: 60000, // in ms or 1 minute 
})

//1. ACCESS THE TARGET

nightmare
//TRADE MAP
    //FETCH URL
    .goto('https://www.trademap.org')
    //CLICK LOGIN
    .click('#ctl00_MenuControl_marmenu_login')
//LOGIN
    //WAIT UNTIL ELEMENT IS PRESENT
    .wait('#Username')
    //TYPE SPECIFIED INPUT
    .type('#Username', 'chavalit.kow@gmail.com')
    .type('#Password', 'goodmorning')
    //CLICK LOGIN
    .click('button[name="button"]')
    .then(async () => {        
        let scrapeRemain = true;
        while(scrapeRemain){
            //EXTRACT RETURN FALSE IF SOMETHING ERROR
            let statusNormal = await extract();
            scrapeRemain = ! statusNormal;
        }
        
    })
    //CHOOSE COUNTRY
    
    //CHOOSE PRODUCT

    //CHOOSE IMPORT
    //.click('#ctl00_PageContent_GridViewPanelControl_ImageButton_ExportExcel')
    //.type('#ctl00_PageContent_RadComboBox_Product_Input', ' rice')
    //.type('body', '\u000d')

    
    //CHOOSE MODE COUNTRY
    //SELECT DROP DOWN COUNTRIES



    // //TYPE SPECIFIED INPUT
    // .type('#search_form_input_homepage', 'github nightmare')
    // //CLICK SPECIFIED BUTTON
    // .click('#search_button_homepage')
    // //WAIT UNTIL ELEMENT IS PRESENT
    // .wait('a.result__a')

    // .evaluate(() => {
    //     let elements = document.querySelectorAll('a.result__a');
    //     let urls = Array.from(elements).map(el => el.href);
    //     return JSON.stringify(urls);

    // })
    //.end()
    // .then((text) => {
    //     text = JSON.parse(text);
    //     text.forEach((t)=>console.log(t))
    //     /*
    //     elements.forEach(function(el) {
    //         console.log(el.href);
    //     });*/

    // })
    .catch(error => {
        console.error('Search failed:', error)
    })
        

//https://stackoverflow.com/questions/43889284/reuse-electron-session-with-nightmare




//TEST
async function extract(){
    let statusNormal = true;
    await nightmare         
        //TRADEMAP AGAIN
        //.goto('https://www.trademap.org')
        //WAIT
        .wait('#ctl00_PageContent_RadComboBox_Product_Input')
        //TYPE RICE
        .type('#ctl00_PageContent_RadComboBox_Product_Input', ' rice')
        //CLICK TITLE 1006
        .wait('div[title="1006 - Rice"]')
        .click('div[title="1006 - Rice"]')
        //CLICK MONTHLY TIME SERIES
        .click('#ctl00_PageContent_Button_TimeSeries_M')
    //TARTGET PAGE
        //WAIT
        .wait('#ctl00_PageContent_MyGridView1')
        //CHOOSE TIMEPEROIDS PER PAGE     
        .select('#ctl00_PageContent_GridViewPanelControl_DropDownList_NumTimePeriod', '20')
        .wait(10000)
        .wait('#ctl00_PageContent_MyGridView1')
        //CHOOSE ROWS PER PAGE
        .select('#ctl00_PageContent_GridViewPanelControl_DropDownList_PageSize', '300')
        .wait(10000)
        .wait('#ctl00_PageContent_MyGridView1')
    //ACCESS THE TARGET
    
    //LOOP THROUGH COUNTRIES & PRODUCTS
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
    var count=0;

    //CHOOSE IMPORT OR EXPORT
    for(let mode of ["E","I"]){
        await nightmare         
            .select('#ctl00_NavigationControl_DropDownList_TradeType', mode)
            .wait(5000)
            .wait('#ctl00_PageContent_MyGridView1')
            .catch(error => {
                console.error('Search failed:', error)
                statusNormal = false;
            }) 
        //CHOOSE UNIT
        for(let unit of ["Q","V"]){
            //Q : kg
            //V : US Dollar thousand
            await nightmare         
                .select('#ctl00_NavigationControl_DropDownList_TS_Indicator', unit)
                .wait(5000)
                .wait('#ctl00_PageContent_MyGridView1')
                .catch(error => {
                    console.error('Search failed:', error)
                    statusNormal = false;
                }) 
            //CHOOSE PRODUCT 
            for(let product of products){
                
                //156 means china
                await nightmare         
                    .select('#ctl00_NavigationControl_DropDownList_Product', product.code.toString().substring(0,2))
                    .wait(5000)
                    .wait('#ctl00_PageContent_MyGridView1')
                    .wait(5000)            
                    .select('#ctl00_NavigationControl_DropDownList_Product', product.code.toString().substring(0,4))
                    .wait(5000)
                    .wait('#ctl00_PageContent_MyGridView1')            
                    .select('#ctl00_NavigationControl_DropDownList_Product', product.code.toString().substring(0,6))
                    .wait(5000)
                    .wait('#ctl00_PageContent_MyGridView1')
                    .catch(error => {
                        console.error('Search failed:', error)
                        statusNormal = false;
                    }) 
                //break;


                //CHOOSE COUNTRY
                for(let country of countries){
                    //IF FILE EXIST, CONTINUE
                    let filename = "html/"+mode+"_"+unit+"_"+country.iso_code+"_"+product.code+"_.html";
                    try {
                        if(fs.existsSync(filename)){ 
                            //file exists
                            console.log(++count,product.name, product.code,country.name, country.code,"SKIPPED!!!");
                            continue; 
                        }else{                
                            console.log(++count,product.name, product.code,country.name, country.code);
                        } 
                    } catch(err) {
                        console.error(err)
                        statusNormal = false;
                    }
                    
                    
        
                    //156 means china
                    await nightmare 
                        .select('#ctl00_NavigationControl_DropDownList_Country', pad(country.code.toString(),3)  ) 
                        .wait(5000)
                        .wait('#ctl00_PageContent_MyGridView1')
                        // pages.push({ "product" : product, "country" : country, });   
                        // await nightmare
                        //     //TRADE MAP
                        //         //FETCH URL
                        //     //.goto('https://www.trademap.org')
                        //     .goto('file:///C:/Users/Chavalit/Documents/GitHub/scraping/Trade%20Map%20-%20List%20of%20supplying%20markets%20for%20a%20product%20imported%20by%20China.html')
                        .evaluate(function(){
                            //console.log(hello);
                            let title = "<h1>"+document.querySelector("#ctl00_TitleContent").textContent+"</h1>";
                            let table = document.querySelector("#ctl00_PageContent_MyGridView1").parentNode.innerHTML 

                            return title + table;
                        })
                        .then(text => {
                            fs.writeFileSync(filename, text);
                        })
                        .catch(error => {
                            console.error('Search failed:', error)
                            statusNormal = false;
                        })  
                    //CHECK
                    if(!statusNormal){
                        return false;
                    }
                }//END OF COUNTRY LOOP
                //break;
                //CHECK
                if(!statusNormal){
                    return false;
                }
            }//END OF PRODUCT LOOP
            //CHECK
            if(!statusNormal){
                return false;
            }
        }//END OF UNIT LOOP
        //CHECK
        if(!statusNormal){
            return false;
        }
            
    }//END OF EXIM LOOP
    
    return true;    
    
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
