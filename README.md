# Action Manager Code polyfill for UXP

Work in progress. Not yet recommended for use in production unless you are pretty sure what you do.

Allows you to run AM code in UXP. 

```
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
```
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
```
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
