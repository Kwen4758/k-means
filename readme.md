command syntax:
```
node algorithm.js <number of clusters> <input file> <output file> <max iterations> 
```

All inputs are optional. Default values are:

> `<number of clusters>`: `1`


> `<input file>`: `input.txt`


> `<output file>`: `<input file name>_output.txt`


> `<max iterations>`: `1000`

This program is written in Typescript, and compiled into Javascript.

I am on Mac, meaning I couldn't run the `gen.exe` program, so I created a simple function that visualizes the output data instead. The output data is drawn onto a canvas, colored by cluster/label, and then saved to a png file.
