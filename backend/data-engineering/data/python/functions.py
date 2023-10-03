classes = {
   "car": 0,
   "clock": 1,   
   "fish": 2,
   "house": 3,
   "pencil": 4,
   "tree": 5,
   "bicycle": 6,
   "guitar": 7,
}

def readFeatureFile(filePath):
   f = open(filePath, 'r')
   lines = f.readlines()

   X = []
   y = []
   for i in range(1, len(lines)):
      row = lines[i].split(",")
      X.append(
         [float(row[j]) for j in range(len(row)-1)]
      )
      y.append(classes[row[-1].strip()])

   return (X, y)