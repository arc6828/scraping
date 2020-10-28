import pandas as pd
import os
import json

# import json

with open('json/final-countries.json') as f:
    countries = json.load(f)
    
# country = [c for c in countries if c["name"] == "Pakistan"]
# code =  country[0]["iso_code"]  if len(country) > 0  else  "-"
# code

paths = os.listdir("html")
# html_files

# paths
files = [ { "name" : path,  "size" : int (os.stat("html/"+path).st_size / 1024) , "n" : path.split(".")[0]} for path in paths]
# files

#http://localhost:8888/view/sample.html
#dfs = pd.read_html('html/E_BE_100610.html',header=[0])
dict_error = {}
count = 0 
for f in files : 

    if f["size"] > 0 : 
        # if f["name"][0:1] == "I" :
        #     continue
        if ".zip" in f["name"] :
            continue 
        #IF FILE EXIST, CONTINUE
        p = "data/"+f["n"]+".json"

        if os.path.exists(p) :
            count += 1
            print(p+' SKIPPED!!!')
            continue 
        
        

        #filename = html_files[1]
        dfs = pd.read_html('html/'+f["name"], header=[0])
        # dfs[0]
        df = dfs[0]
        result = df.to_json(orient="split")
        # print(result)
        result = json.loads(result)
        
        #ARRAY OF OBJECT
        data_list = []
        heads = result["columns"]
        data = result["data"]        
        for cols in data : 
            #print(cols)
            if len(cols) < 2 :
                continue
                
            for head ,  col in zip(heads ,  cols):
                if not str(col).isnumeric() :
                    continue
                if cols[1] == "World" :
                    continue
                #print(head.replace("M","")+"-01", cols[1], col, "kg" )

                c_name = cols[1]
                country = [c for c in countries if c["name"] == c_name]
                country_to_code =  country[0]["iso_code"]  if len(country) > 0  else  "-"
                #print(str(f["name"]))
                country_from_code = str(f["name"]).split("_")[3]

                if "name" in  head.replace("M","") :
                    dict_error[f["name"]] = True

                html = open("html/"+f["name"], "r")
                text = html.read()


                if "total" in  text :
                    dict_error[f["name"]] = True

                data_list.append({
                    "date" : head.replace("M","")+"-01" ,
                    "country_from" : country_from_code,
                    "country_to" : country_to_code,
                    "value" : col,
                    "unit" : "kg",
                })

        #WRITE FILE
        count += 1
        print(count, 'data/'+f["n"]+'.json')
        with open('data/'+f["n"]+'.json', 'w') as outfile:
            json.dump(data_list, outfile)
    else :         
        count += 1
        data_list = []
        with open('data/'+f["n"]+'.json', 'w') as outfile:
            json.dump(data_list, outfile)

#print('data/'+f["n"]+'.json')
with open('error.json', 'w') as outfile:
    json.dump(dict_error, outfile)
                





