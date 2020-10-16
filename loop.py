import pandas as pd
import os
import json

paths = os.listdir("html")
# html_files

# paths
files = [ { "name" : path,  "size" : int (os.stat("html/"+path).st_size / 1024) } for path in paths]
# files

#http://localhost:8888/view/sample.html
#dfs = pd.read_html('html/E_BE_100610.html',header=[0])
for f in files : 

    if f["size"] > 0 : 
        if ".zip" in f["name"] :
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
                data_list.append({
                    "date" : head.replace("M","")+"-01" ,
                    "country" : cols[1],
                    "value" : col,
                    "unit" : "kg",
                })

        #WRITE FILE
        print('data/'+f["name"]+'.json')
        with open('data/'+f["name"]+'.json', 'w') as outfile:
            json.dump(data_list, outfile)
    else : 
        data_list = []
        with open('data/'+f["name"]+'.json', 'w') as outfile:
            json.dump(data_list, outfile)
                





