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
			}
		}
	}
})

import { stringIDToTypeID, typeIDToStringID } from "../src";
import { ActionDescriptor } from "../src/ActionDescriptor";
import { ActionList } from "../src/ActionList"

beforeEach(() => {
	_registry = [];
})

it("can get ActionList count", () => {
	var desc = new ActionList();
	expect(desc.count).toBe(0);
})

it("can get typename", () => {
	var desc = new ActionList();
	expect(desc.typename).toBe("ActionList");
})

it("can put boolean value", () => {
	var desc = new ActionList();
	desc.putBoolean(true);
	expect(desc.toBatchPlay()).toEqual([true]);
	expect(desc.count).toBe(1);
})

it("can get boolean value", () => {
	var desc = new ActionList();
	desc.putBoolean(true);
	desc.putBoolean( false);
	expect(desc.getBoolean(0)).toBe(true);
	expect(desc.getBoolean(1)).toBe(false);
})

it("can clear content", () => {
	var desc = new ActionList();
	desc.putBoolean( true);
	expect(desc.count).toBe(1);
	desc.clear();
	expect(desc.count).toBe(0);
})

it("can put/get integer value", () => {
	var desc = new ActionList();
	desc.putInteger( 123);	
	expect(desc.getInteger(0)).toBe(123);
})

it("can floor integer value", () => {
	var desc = new ActionList();
	desc.putInteger( 1.99);	
	desc.putInteger( 1.01);	
	expect(desc.getInteger(0)).toBe(1);
	expect(desc.getInteger(1)).toBe(1);
})

it("can ceil integer value", () => {
	var desc = new ActionList();
	desc.putInteger( -1.99);	
	desc.putInteger( -1.01);	
	expect(desc.getInteger(0)).toBe(-1);
	expect(desc.getInteger(1)).toBe(-1);
})

it("can put/get large integer value", () => {
	var desc = new ActionList();
	desc.putLargeInteger( 123);	
	expect(desc.getLargeInteger(0)).toBe(123);
})

it("can floor large integer value", () => {
	var desc = new ActionList();
	desc.putLargeInteger( 1.99);	
	desc.putLargeInteger( 1.01);	
	expect(desc.getLargeInteger(0)).toBe(1);
	expect(desc.getLargeInteger(1)).toBe(1);
})

it("can ceil large integer value", () => {
	var desc = new ActionList();
	desc.putLargeInteger( -1.99);	
	desc.putLargeInteger( -1.01);	
	expect(desc.getLargeInteger(0)).toBe(-1);
	expect(desc.getLargeInteger(1)).toBe(-1);
})

it("can put/get double value", () => {
	var desc = new ActionList();
	desc.putDouble(11.22);	
	expect(desc.getDouble(0)).toBe(11.22);
})

it("can put/get string", () => {
	var desc = new ActionList();
	desc.putString("Příliš žluťoučký kůň");	
	expect(desc.getString(0)).toBe("Příliš žluťoučký kůň");
})

it("can put/get unit double", () => {
	var desc = new ActionList();
	var idVrtc = stringIDToTypeID( "vertical" );
	var idPxl = stringIDToTypeID( "pixelsUnit" );
	desc.putUnitDouble(idPxl, 18.5123);

	expect(desc.getUnitDoubleType(stringIDToTypeID("vertical"))).toBe(stringIDToTypeID("pixelsUnit"));
	expect(desc.getUnitDoubleValue(stringIDToTypeID("vertical"))).toBe(18.5123);
})

it("can put/get enum", () => {
	var desc = new ActionList();
	desc.putEnumerated(stringIDToTypeID("abc"),stringIDToTypeID("xyz"));
	expect(typeIDToStringID(desc.getEnumerationType(0))).toBe("abc");
	expect(typeIDToStringID(desc.getEnumerationValue(0))).toBe("xyz");
})

it("can put/get class", () => {
	var desc = new ActionList();
	desc.putClass(stringIDToTypeID("abc"));
	expect(typeIDToStringID(desc.getClass(0))).toBe("abc");
})

it("can put/get object", () => {
	var desc1 = new ActionList();
	var desc2 = new ActionDescriptor();
	desc2.putBoolean(stringIDToTypeID("abc"), true);
	desc1.putObject(stringIDToTypeID("layer"), desc2);
	
	expect(desc1.toBatchPlay()).toEqual([{ abc: true, _obj: "layer" }]);	
	expect(desc1.getObjectValue(0).toBatchPlay()).toEqual({ abc: true, _obj: "layer" });
})