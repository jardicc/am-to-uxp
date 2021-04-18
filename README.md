# Action Manager Code polyfill for UXP

Not yet recommended for use in production unless you are pretty sure what you do.

## Currently not fully supported
- raw data type sent into Photoshop - it is unclear how to make it work: https://forums.creativeclouddeveloper.com/t/how-to-use-raw-data-type-in-batchplay/2092/5
- file paths
- `toStream()`
- `fromStream()`

Allows you to run AM code in UXP. 

```ts
import { ActionDescriptor } from "../../src/ActionDescriptor"
import { stringIDToTypeID, executeAction, DialogModes } from '../../src';
import { ActionReference } from '../../src/ActionReference';

var idMk = stringIDToTypeID("make");
var desc21 = new ActionDescriptor();
	var idnull = stringIDToTypeID("_target");
	var ref2 = new ActionReference();
		var idLyr = stringIDToTypeID("layer");
		ref2.putClass(idLyr);
	desc21.putReference(idnull, ref2);
	var idLyrI = stringIDToTypeID("layerID");
desc21.putInteger(idLyrI, 3);
executeAction(idMk, desc21, DialogModes.NO);
```

This will be automatically internal translated into:
```ts
const batchPlay = require("photoshop").action.batchPlay;

batchPlay(
[
   {
      "_obj": "make",
      "_target": [
         {
            "_ref": "layer"
         }
      ],
      "layerID": 2,
      "_isCommand": true,
      "_options": {
         "dialogOptions": "dontDisplay"
      }
   }
]
,{
   "synchronousExecution": true
});
```
You can also do explicit conversion like this
```ts
import {ActionDescriptor } from "../../src/ActionDescriptor"
import { stringIDToTypeID, executeAction, DialogModes } from '../../src';
import { ActionReference } from '../../src/ActionReference';

var idMk = stringIDToTypeID("make");
var desc21 = new ActionDescriptor();
	var idnull = stringIDToTypeID("_target");
	var ref2 = new ActionReference();
		var idLyr = stringIDToTypeID("layer");
		ref2.putClass(idLyr);
	desc21.putReference(idnull, ref2);
	var idLyrI = stringIDToTypeID("layerID");
desc21.putInteger(idLyrI, 3);
console.log(desc21.toBatchPlay()); // converted
```
