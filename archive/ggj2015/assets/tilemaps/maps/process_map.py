import json
import copy
import sys

number_of_copies = 3

if len(sys.argv) != 3:
	print "python process_map.py <mapname.json> <output.json>"
	sys.exit()

f = open(sys.argv[1], "r")
content = json.loads(f.read())
llist = content["layers"]
f.close()

output = []
for l in llist:
	for i in range(number_of_copies):
		aux = copy.deepcopy(l)
		output.append(aux)

sorted(output, key=lambda n: n["name"])

counter = 0
for l in output:
	counter+=1
	l["name"] = l["name"]+str(counter)
	if counter % number_of_copies == 0:
		counter = 0

f = open(sys.argv[2], "w")
content["layers"] = output
f.write(json.dumps(content))
f.close()

