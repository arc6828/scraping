//LOOP THROUGH COUNTRIES & PRODUCTS
var fs = require('fs');
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
            console.log("Before Extract");
            let statusNormal = await extract();
            scrapeRemain = ! statusNormal;
        }
        
    })    
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
        .then(function(){            
            console.log("Trade Map Page");
        })
        .catch(error => {
            console.error('Search failed:', error)
            statusNormal = false;
        });
    await nightmare
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
        .then(function(){            
            console.log("Target Page");
        })
        .catch(error => {
            console.error('Search failed:', error)
            statusNormal = false;
        });
    await nightmare
        //CHOOSE TIMEPEROIDS PER PAGE     
        .select('#ctl00_PageContent_GridViewPanelControl_DropDownList_NumTimePeriod', '20')        
        .then(function(){            
            console.log("Select time period 20 months");
        })
        .catch(error => {
            console.error('Search failed:', error)
            statusNormal = false;
        });
    await nightmare
        .wait(10000)
        .wait('#ctl00_PageContent_MyGridView1')
        //CHOOSE ROWS PER PAGE
        .select('#ctl00_PageContent_GridViewPanelControl_DropDownList_PageSize', '300')        
        .then(function(){            
            console.log("Select 300 rows per page");
        })
        .catch(error => {
            console.error('Search failed:', error)
            statusNormal = false;
        });
    await nightmare
        .wait(10000)
        .wait('#ctl00_PageContent_MyGridView1')
        .catch(error => {
            console.error('Search failed:', error)
            statusNormal = false;
        })
    //ACCESS THE TARGET
    

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
    //17680 LOOPS : MODE(2) x QV(2) x PRODUCT(40) x COUNTRY(221)
	//CHOOSE UNIT
	for(let unit of ["Q"]){//["Q","V"]
		//Q : kg
		//V : US Dollar thousand
		await nightmare         
			.select('#ctl00_NavigationControl_DropDownList_TS_Indicator', unit)
			.wait(10000)
			.wait('#ctl00_PageContent_MyGridView1')
			.then(function(){            
				console.log("Select Quantity or Values");
			})
			.catch(error => {
				console.error('Search failed:', error)
				statusNormal = false;
			}) 
		for(let mode of ["E","I"]){
			await nightmare         
				.select('#ctl00_NavigationControl_DropDownList_TradeType', mode)
				.wait(10000)
				.wait('#ctl00_PageContent_MyGridView1')
				.then(function(){            
					console.log("Select import or export");
				})
				.catch(error => {
					console.error('Search failed:', error)
					statusNormal = false;
				}) 
        
            //CHOOSE PRODUCT 
            for(let product of products){
                //CHECK IF FILES IS COMPLETED, then CONTINUE NEXT LOOP
                try {
                    
                    let partial_filename = mode+"_"+unit+"_"+product.code;
                    let file_count = 0;                    
                    const testFolder = './html/';
                    fs.readdirSync(testFolder).forEach(file => {
                        let splits = file.split("_");
                        if(splits.length == 5){
                            let newPath = splits[0]+"_"+splits[1]+"_"+splits[2];                            
                            if(partial_filename == newPath){
                                file_count++;
                            }
                            //console.log(newPath);
                        }
                    });
                    if( file_count == countries.length ){
                        count+=countries.length;
                        continue;
                    }
                    
                } catch(err) {
                    console.error(err)
                    statusNormal = false;
                }

                
                await nightmare         
                    .select('#ctl00_NavigationControl_DropDownList_Product', "TOTAL") 
                    .wait(10000)
                    .wait('#ctl00_PageContent_MyGridView1')                   
                    .then(function(){            
                        console.log("TOTAL");
                    })
                    .catch(error => {
                        console.error('Search failed:', error)
                        statusNormal = false;
                    });
                
                await nightmare         
                    .select('#ctl00_NavigationControl_DropDownList_Product', product.code.toString().substring(0,2)) 
                    .wait(10000)
                    .wait('#ctl00_PageContent_MyGridView1')                   
                    .then(function(){            
                        console.log("Plant 2 digits");
                    })
                    .catch(error => {
                        console.error('Search failed:', error)
                        statusNormal = false;
                    });
                await nightmare
                    .select('#ctl00_NavigationControl_DropDownList_Product', product.code.toString().substring(0,4))
                    .wait(10000)
                    .wait('#ctl00_PageContent_MyGridView1')            
                    .then(function(){            
                        console.log("Plant 4 digits");
                    })
                    .catch(error => {
                        console.error('Search failed:', error)
                        statusNormal = false;
                    });
                await nightmare
                    .select('#ctl00_NavigationControl_DropDownList_Product', product.code.toString())
                    .wait(10000)
                    .wait('#ctl00_PageContent_MyGridView1')
                    .then(function(){            
                        console.log("Plant 6 digits");
                    })
                    .catch(error => {
                        console.error('Search failed:', error)
                        statusNormal = false;
                    }) 
                //break;


                //CHOOSE COUNTRY
                for(let country of countries){
                    //IF FILE EXIST, CONTINUE
                    // let filename = "html/"+mode+"_"+unit+"_"+country.iso_code+"_"+product.code+"_.html";
                    let filename = "html/"+mode+"_"+unit+"_"+product.code+"_"+country.iso_code+"_.html";
                    try {
                        if(fs.existsSync(filename)){ 
                            //file exists
                            console.log(++count, Number(count*100 / (products.length * countries.length * 2)).toFixed(0) , product.name, product.code,country.name, country.code,"SKIPPED!!!");
                            continue; 
                        }else{                
                            console.log(++count, Number(count*100 / (products.length * countries.length * 2)).toFixed(0) , product.name, product.code,country.name, country.code);
                        } 
                    } catch(err) {
                        console.error(err)
                        statusNormal = false;
                    }
                    
                    
        
                    //156 means china
                    await nightmare 
                        .select('#ctl00_NavigationControl_DropDownList_Country', pad(country.code.toString(),3)  ) 
                        .wait(10000)
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
