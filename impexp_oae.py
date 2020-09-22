# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import urllib, json
import os

class ImpExp : 

    def __init__(self):
        print("Hello")

from bs4 import BeautifulSoup
import requests

url="http://impexp.oae.go.th/service/export.php?S_YEAR=2554&E_YEAR=2563&PRODUCT_GROUP=5247&PRODUCT_ID=3810&WF_SEARCH=Y"

# Make a GET request to fetch the raw HTML content
html_content = requests.get(url).text

# Parse the html content
soup = BeautifulSoup(html_content, "lxml")
#print(soup.prettify()) # print the parsed data of html

print(soup.title)

# table = {
#     "thead1" : [],
#     "thead2" : [],
#     "tbody" : [

#     ]
# }
# for table in soup.find_all("table"):
    
#     print("Inner Text: {}".format(link.text))
#     print("Title: {}".format(link.get("title")))
#     print("href: {}".format(link.get("href")))

data = {}
for table in soup.find_all("table"):
    # # Get headers of table i.e., Rank, Country, GDP.
    # t_headers = []
    # for th in table.find_all("th"):
    #     # remove any newlines and extra spaces from left and right
    #     t_headers.append(th.text.replace('\n', ' ').strip())
    # Get all the rows of table
    table_data = []
    for tr in table.tbody.find_all("tr"): # find all tr's from table's tbody
        t_row = {}
        # Each table row is stored in the form of
        # t_row = {'Rank': '', 'Country/Territory': '', 'GDP(US$million)': ''}

        # find all td's(3) in tr and zip it with t_header
        for td, th in zip(tr.find_all("td"), t_headers): 
            t_row[th] = td.text.replace('\n', '').strip()
        table_data.append(t_row)

    # Put the data for the table with his heading.
    data[heading] = table_data

print(data)