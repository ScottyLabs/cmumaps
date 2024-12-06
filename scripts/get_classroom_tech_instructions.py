import requests
import json
import re
from bs4 import BeautifulSoup

def find_building_code_from_name(building_name: str, buildings_data: dict) -> str:
    #non-greedy matches the all-caps building code if it exsits between parentheses
    match = re.search(r'\((.*?)\)', building_name)
    if match:
        return match.group(1)
    else:
        #searches the json file to return the building code from the building name
        for building, building_info in buildings_data.items():
            if building_info['name'] == building_name:
                return building

def make_entries(buildings_with:list, buildings_data: dict, instructions:dict, room_type:str):
    for building in buildings_with:
        building_link:str = f"{main_link}{building["href"]}"
        html_building = requests.get(building_link)
        #Cooking building soup
        building_soup = BeautifulSoup(html_building.text, 'html.parser')
        building_content = building_soup.find('div', id="content")
        building_name:str = building_content.find_all('h1')[0].string
        #Getting building code from building name
        building_code:str = find_building_code_from_name(building_name, buildings_data)
        print(building_code)
        #Scraping all quick reference pdf links from the page
        quick_references = building_soup.find_all('a', string=re.compile("(?i)Quick"), href=re.compile(".pdf"))
        for quick_reference in quick_references:
            pdf_link:str = f"{main_link}{room_type}/{quick_reference["href"][3:]}"
            match = re.search(r'_(.+)(?=\.pdf)', pdf_link)
            if not match:
                match = re.search(r'([0-9]+[a-zA-Z]?)\.pdf', pdf_link)
            room_name:str
            if match:
                room_name = match.group(1).upper()
            #Loading entry to instructions dictionary
            instructions[f"{building_code}-{room_name}"] = pdf_link

#forgot to put main, but here is where the main should start
instructions = dict()

main_link:str = "https://www.cmu.edu/computing/services/teach-learn/tes/"

#Loading main html
html = requests.get(f"{main_link}locations.html")
soup = BeautifulSoup(html.text, 'html.parser')
content = soup.find('div', id="content")

#Loading buildings.json to generate dictionary keys
with open('../public/cmumaps-data/buildings.json', 'r') as buildings_json:
    buildings_data = json.load(buildings_json)

#Loading each building
buildings_with_classrooms = content.find_all('a', href=re.compile("classrooms/locations/(?!index)"))
make_entries(buildings_with_classrooms, buildings_data, instructions, "classrooms")
        

buildings_with_labs = content.find_all('a', string="Computer Labs")
print(buildings_with_labs)
make_entries(buildings_with_labs, buildings_data, instructions, "computer-labs")

for key,val in instructions.items():
    print(key, val)

# File path where you want to save the JSON file
file_path = "classroom_tech_instruction_links.json"

# Writing dictionary to JSON file
with open(file_path, 'w') as json_file:
    json.dump(instructions, json_file, indent=4)

print(f"Dictionary has been successfully exported to {file_path}")