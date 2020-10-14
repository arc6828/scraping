const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const cheerio = require('cheerio');

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
//TRADEMAP AGAIN
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
    //CHOOSE ROWS PER PAGE
    .select('#ctl00_PageContent_GridViewPanelControl_DropDownList_PageSize', '300')
    //CHOOSE UNIT    
    .select('#ctl00_NavigationControl_DropDownList_TS_Indicator', 'Q')    
    //CHOOSE COUNTRY
    //156 means china
    .select('#ctl00_NavigationControl_DropDownList_Country', '156')

    .wait(10000)
    
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
    .evaluate(function(){

    //here is where I want to return the html body
    return document.body.innerHTML;

    })
    .then(function(body){
    //loading html body to cheerio
        // var $ = cheerio.load(body);
        // const scrapedData = [];
        // const tableHeaders = [];
        // $("#ctl00_PageContent_MyGridView1 > tbody > tr").each((index, element) => {
        // if (index === 0) {
        //     const ths = $(element).find("th");
        //     $(ths).each((i, element) => {
        //     tableHeaders.push(
        //         $(element)
        //         .text()
        //         .toLowerCase()
        //     );
        //     });
        //     return true;
        // }
        // const tds = $(element).find("td");
        // const tableRow = {};
        // $(tds).each((i, element) => {
        //     tableRow[tableHeaders[i]] = $(element).text();
        // });
        // scrapedData.push(tableRow);
        // });
        // console.log(scrapedData);

        var $ = cheerio.load(body);
        const objData = {
            country: '',
            detail: {
                month: '',
                unit: '',
                value: '',
            }
        }
        var dataArray = [];
        let data_country = '';
        let data_month = '';
        let data_unit = '';
        let data_value = '';

        // get month
        $("#ctl00_PageContent_MyGridView1 > tbody > tr:nth-child(1) > td").each((index, element) => {
            
            console.log("month ==> " , $(element).text());

            data_month = $(element).text();
            objData.detail.month = data_month;
            dataArray.push({objData: objData});
        })

        
        // get unit
        $("#ctl00_PageContent_MyGridView1 > tbody > tr:nth-child(2) > th").each((index, element) => {

            console.log("unit ==> " , $(element).text());

            data_unit = $(element).text();
            objData.detail.unit = data_unit;
            dataArray.push({objData: objData});
        })


        // get country EX.1
        $("#ctl00_PageContent_MyGridView1 > tbody > tr:nth-child(3) > td:nth-child(2)").each((index, element) => {
            console.log("country ==> " , $(element).text());
        })

        // get country EX.2
        $("#ctl00_PageContent_MyGridView1 > tbody > tr:nth-child(3)").each((index, element) => {

            console.log("country [2] ==> " , $($(element).find("td")[1]).text());

            data_country = $($(element).find("td")[1]).text();
            objData.country = data_country;
            dataArray.push({objData: objData});
        })
        
        // get value
        $("#ctl00_PageContent_MyGridView1 > tbody > tr:nth-child(3) > td").each((index, element) => {
            if ( index === 1 || index === 0 ) {
                return true;
            }
            
            console.log("value ==> " , $(element).text());

            data_value = $(element).text();
            objData.detail.value = data_value;
            dataArray.push({objData: objData});
            
        })
        console.log(objData)
        console.log(`dataArray ====> `, JSON.stringify(dataArray));
    })
    .catch(error => {
        console.error('Search failed:', error)
    })