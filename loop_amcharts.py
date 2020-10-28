import pandas as pd
import os
import json

json_files = os.listdir("data")
# json_files

files = [ { "filename" : path,  "size" : int (os.stat("data/"+path).st_size / 1024) } for path in json_files]
# files

results = list( filter(lambda item : item["size"] > 0, files)     )
# print(len(results), len(files) )


#READ COUNTRIES FOR CODE
with open('json/final-countries.json') as f:
    countries = json.load(f)    
country = [c for c in countries if c["name"] == "Pakistan"]
# code =  country[0]["iso_code"]  if len(country) > 0  else  "-"
# code

#LOOP FOR WRITE AMCHART DATA FILES
count = 0
for file in files :
    world_timeline = {}
    count += 1
    #print(count, file["filename"])
    filename = file['filename']        

    new_filename = filename[-17:]  #last 17 of string

    if filename[0:1] == "I" :
        continue
    if "null" in filename :
        continue
    if "null" in filename :
        print(count, new_filename)

    p = "dataexim/"+new_filename

    if os.path.exists(p) :            
        print(count, new_filename,  "SKIPPED", end="\r", flush=True)

        continue 

    import_filename = "I_"+new_filename
    export_filename = "E_"+new_filename


    with open('data/'+import_filename) as f:
        import_data= json.load(f)

    with open('data/'+export_filename) as f:
        export_data= json.load(f)

    #IMPORT
    if len(import_data)  > 0 :            
        for row in import_data :                
            date = row["date"]
            value = row["value"]
            unit = row["unit"]
            # c_name = row['country'] 
            #GET COUNTRY CODE 
            # country = [c for c in countries if c["name"] == c_name]
            # code =  country[0]["iso_code"]  if len(country) > 0  else  "-"
            #STILL PROBLEM
            code = row['country_to']

            #INSERT IF NO DATE KEY
            if date not in world_timeline : 
                world_timeline[date] = {
                    "date" : date,
                    "list" : {

                    },
                    "import" : 0 ,
                    "export" : 0 ,
                }

            #INSERT IF NO COUNTRY CODE KEY                    
            if code not in world_timeline[date]["list"]:
                world_timeline[date]["list"][code] = {
                    "import" : 0,
                    "export" : 0,
                    "id" : code,
                    #"unit" : unit
                }
            #INSERT DATA
            world_timeline[date]["list"][code]["import"] = int(value)
            world_timeline[date]["import"] += int(value)

    #EXPORT           
    if len(export_data)  > 0 :            
        for row in export_data : 
            date = row["date"]
            value = row["value"]
            unit = row["unit"]
            # c_name = row['country'] 
            #GET COUNTRY CODE 
            # country = [c for c in countries if c["name"] == c_name]
            # code =  country[0]["iso_code"]  if len(country) > 0  else  "-"            
            #STILL PROBLEM
            code = row['country_to']
            
            #INSERT IF NO DATE KEY
            if date not in world_timeline : 
                world_timeline[date] = {
                    "date" : date,
                    "list" : {

                    },
                    "import" : 0 ,
                    "export" : 0 ,
                }

            #INSERT IF NO COUNTRY CODE KEY                    
            if code not in world_timeline[date]["list"]:
                world_timeline[date]["list"][code] = {
                    "import" : 0,
                    "export" : 0,
                    "id" : code,
                    #"unit" : unit
                }
            #INSERT DATA
            world_timeline[date]["list"][code]["export"] = int(value)            
            world_timeline[date]["export"] += int(value)

    #WRITE JSON
    for date_key in world_timeline : 
        world_timeline[date_key]["list"] = list(world_timeline[date_key]["list"].values())
    new_world_timeline = list(world_timeline.values())
        
    
    print(count, new_filename, end="\r", flush=True)
    with open('dataexim/'+new_filename, 'w') as json_file:
        json.dump(new_world_timeline, json_file)

    #break

