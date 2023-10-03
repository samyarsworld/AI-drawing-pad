from functions import readFeatureFile, classes
from sklearn.neural_network import MLPClassifier
import json

# hidden layers
hidden = (50, 20)

mlp = MLPClassifier(hidden, max_iter=10000)

X, y = readFeatureFile("../dataset/training.csv")

mlp.fit(X, y)

X, y = readFeatureFile("../dataset/testing.csv")

accuracy = mlp.score(X, y)

print(accuracy)

jsonObj = {
    "neuronCounts": [len(X[0]), hidden, len(classes)],
    "classes": classes,
    "network": {"levels": []}
}

for i in range(0, len(mlp.coefs_)):
    level = {
        "weights": mlp.coefs_[i].tolist(),
        "biases": mlp.intercepts_[i].tolist(),
        "inputs": [0]*len(mlp.coefs_[i]),
        "outputs": [0]*len(mlp.intercepts_[i])
    }
    jsonObj["network"]["levels"].append(level)

json_object = json.dumps(jsonObj, indent=2)

with open("../models/model.json", "w") as outfile:
    outfile.write(json_object)
with open("../models/model.js", "w") as outfile:
    outfile.write("const model = "+json_object+";")