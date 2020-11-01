let _registry: string[] = [];

jest.mock('../src/imports.ts', () => {
	return {
		action: {
			getIDFromString: (stringID: string) => {
				const index = _registry.indexOf(stringID);
				if (index !== -1) {
					return index;
				}
				_registry.push(stringID);
				return _registry.length - 1;
			},
			getStringFromID: (id:number) => {
				return _registry[id];
			},
			batchPlay: (commands: any[], options?: CommandOptions) => {
				console.log(commands[0]?._obj);
				if (commands[0]?._obj === "invert") {					
					return [{}]
				} else if (commands[0]?._obj === "make") {
					return [
						{
							"target": [
								{
									"_ref": "layer"
								}
							],
							"layerID": 4
						}
					];
				}
				return commands;
			}
		}
	}
})

import { CommandOptions } from "photoshop/dist/types/UXP";
import { charIDToTypeID, DialogModes, executeAction, stringIDToTypeID, typeIDToCharID, typeIDToStringID } from "../src"
import { ActionDescriptor } from "../src/ActionDescriptor";
import { ActionReference } from "../src/ActionReference";

it("can convert typeID to charID", () => {
	expect(typeIDToCharID(591487860)).toBe("#Act");
})

it("can convert charID to typeID", () => {
	expect(charIDToTypeID("#Act")).toBe(591487860);
})

// this is more like mock test
it("can convert string into id", () => {
	expect(stringIDToTypeID("abc")).toBe(0);
	expect(stringIDToTypeID("xyz")).toBe(1);
	expect(stringIDToTypeID("abc")).toBe(0);
	expect(typeIDToStringID(0)).toBe("abc");
	expect(typeIDToStringID(1)).toBe("xyz");
	expect(typeIDToStringID(0)).toBe("abc");
})

describe("executeAction", () => {
	it("can play simple invert", () => {
		var idInvr = stringIDToTypeID( "invert" );
		var result = executeAction(idInvr, undefined, DialogModes.NO);

		expect(result.toBatchPlay()).toEqual({});
	})	

	it("can make new layer", () => {
		var idMk = stringIDToTypeID("make");
		var desc21 = new ActionDescriptor();
			var idnull = stringIDToTypeID("target");
			var ref2 = new ActionReference();
				var idLyr = stringIDToTypeID("layer");
				ref2.putClass(idLyr);
			desc21.putReference(idnull, ref2);
			var idLyrI = stringIDToTypeID("layerID");
		desc21.putInteger(idLyrI, 3);
		executeAction(idMk, desc21, DialogModes.NO);
	});
})