import json 

a = json.load(open('graph.json'))
keys = list(a.keys())
for key in keys:
    if "-" in key:
        del a[key]

json.dump(a, open('public_graph.json', 'w'))