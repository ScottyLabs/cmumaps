import json


with open("public/json/buildings.json", "r") as file:
    buildings = json.loads(file.read())
    res = dict()
    for building in buildings:
        res[building["code"]] = building

    print(json.dumps(res))