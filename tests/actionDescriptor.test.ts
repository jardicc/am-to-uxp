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

import { charIDToTypeID, stringIDToTypeID, typeIDToStringID } from "../src";
import { ActionDescriptor } from "../src/ActionDescriptor"

beforeEach(() => {
	_registry = [];
})

it("can get ActionDescriptor count", () => {
	var desc = new ActionDescriptor();
	expect(desc.count).toBe(0);
})

it("can get typename", () => {
	var desc = new ActionDescriptor();
	expect(desc.typename).toBe("ActionDescriptor");
})

it("can put boolean value", () => {
	var desc = new ActionDescriptor();
	desc.putBoolean(stringIDToTypeID("abc"), true);
	expect(desc.toBatchPlay()).toEqual({
		"abc": true
	});
	expect(desc.count).toBe(1);
})

it("can get boolean value", () => {
	var desc = new ActionDescriptor();
	desc.putBoolean(stringIDToTypeID("abc"), true);
	desc.putBoolean(stringIDToTypeID("xyz"), false);
	expect(desc.getBoolean(stringIDToTypeID("abc"))).toBe(true);
	expect(desc.getBoolean(stringIDToTypeID("xyz"))).toBe(false);
})

it("can clear content", () => {
	var desc = new ActionDescriptor();
	desc.putBoolean(stringIDToTypeID("abc"), true);
	expect(desc.count).toBe(1);
	desc.clear();
	expect(desc.count).toBe(0);
})

it("can erase key", () => {
	var desc = new ActionDescriptor();
	console.log(_registry);
	desc.putBoolean(stringIDToTypeID("abc"), true);
	console.log(_registry);
	desc.putBoolean(stringIDToTypeID("xyz"), true);
	console.log(_registry);
	desc.erase(stringIDToTypeID("abc"));
	expect(desc.toBatchPlay()).toEqual({
		"xyz":true
	})
})

it("can get key", () => {
	var desc = new ActionDescriptor();
	desc.putBoolean(stringIDToTypeID("abc"), true);
	desc.putBoolean(stringIDToTypeID("xyz"), false);
	desc.putBoolean(stringIDToTypeID("efg"), true);
	expect(typeIDToStringID(desc.getKey(1))).toBe("xyz");
})

it("can put/get integer value", () => {
	var desc = new ActionDescriptor();
	desc.putInteger(stringIDToTypeID("abc"), 123);	
	expect(desc.getInteger(stringIDToTypeID("abc"))).toBe(123);
})

it("can floor integer value", () => {
	var desc = new ActionDescriptor();
	desc.putInteger(stringIDToTypeID("abc"), 1.99);	
	desc.putInteger(stringIDToTypeID("xyz"), 1.01);	
	expect(desc.getInteger(stringIDToTypeID("abc"))).toBe(1);
	expect(desc.getInteger(stringIDToTypeID("xyz"))).toBe(1);
})

it("can ceil integer value", () => {
	var desc = new ActionDescriptor();
	desc.putInteger(stringIDToTypeID("abc"), -1.99);	
	desc.putInteger(stringIDToTypeID("xyz"), -1.01);	
	expect(desc.getInteger(stringIDToTypeID("abc"))).toBe(-1);
	expect(desc.getInteger(stringIDToTypeID("xyz"))).toBe(-1);
})

it("can put/get large integer value", () => {
	var desc = new ActionDescriptor();
	desc.putLargeInteger(stringIDToTypeID("abc"), 123);	
	expect(desc.getLargeInteger(stringIDToTypeID("abc"))).toBe(123);
})

it("can floor large integer value", () => {
	var desc = new ActionDescriptor();
	desc.putLargeInteger(stringIDToTypeID("abc"), 1.99);	
	desc.putLargeInteger(stringIDToTypeID("xyz"), 1.01);	
	expect(desc.getLargeInteger(stringIDToTypeID("abc"))).toBe(1);
	expect(desc.getLargeInteger(stringIDToTypeID("xyz"))).toBe(1);
})

it("can ceil large integer value", () => {
	var desc = new ActionDescriptor();
	desc.putLargeInteger(stringIDToTypeID("abc"), -1.99);	
	desc.putLargeInteger(stringIDToTypeID("xyz"), -1.01);	
	expect(desc.getLargeInteger(stringIDToTypeID("abc"))).toBe(-1);
	expect(desc.getLargeInteger(stringIDToTypeID("xyz"))).toBe(-1);
})

it("can put/get double value", () => {
	var desc = new ActionDescriptor();
	desc.putDouble(stringIDToTypeID("abc"), 11.22);	
	expect(desc.getDouble(stringIDToTypeID("abc"))).toBe(11.22);
})

it("can put/get string", () => {
	var desc = new ActionDescriptor();
	desc.putString(stringIDToTypeID("abc"), "Příliš žluťoučký kůň");	
	expect(desc.getString(stringIDToTypeID("abc"))).toBe("Příliš žluťoučký kůň");
})

it("has key", () => {
	var desc = new ActionDescriptor();
	desc.putBoolean(stringIDToTypeID("abc"), true);
	expect(desc.hasKey(stringIDToTypeID("abc"))).toBe(true);
	expect(desc.hasKey(stringIDToTypeID("xyz"))).toBe(false);
})

it("can put/get unit double", () => {
	var desc = new ActionDescriptor();
	var idVrtc = stringIDToTypeID( "vertical" );
	var idPxl = stringIDToTypeID( "pixelsUnit" );
	desc.putUnitDouble(idVrtc, idPxl, 18.5123);

	expect(desc.getUnitDoubleType(stringIDToTypeID("vertical"))).toBe(stringIDToTypeID("pixelsUnit"));
	expect(desc.getUnitDoubleValue(stringIDToTypeID("vertical"))).toBe(18.5123);
})

it("can put/get enum", () => {
	var desc = new ActionDescriptor();
	desc.putEnumerated(stringIDToTypeID("myProps"), stringIDToTypeID("abc"),stringIDToTypeID("xyz"));
	expect(typeIDToStringID(desc.getEnumerationType(stringIDToTypeID("myProps")))).toBe("abc");
	expect(typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID("myProps")))).toBe("xyz");
})

it("can put/get class", () => {
	var desc = new ActionDescriptor();
	desc.putClass(stringIDToTypeID("myProps"), stringIDToTypeID("abc"));
	expect(typeIDToStringID(desc.getClass(stringIDToTypeID("myProps")))).toBe("abc");
})

it("can put/get object", () => {
	var desc1 = new ActionDescriptor();
	var desc2 = new ActionDescriptor();
	desc2.putBoolean( stringIDToTypeID("abc"),true );	
	desc1.putObject(stringIDToTypeID("to"), stringIDToTypeID("layer"), desc2);
	
	expect(desc1.toBatchPlay()).toEqual({ "to": { abc: true, _obj: "layer" } });
	expect(typeIDToStringID(desc1.getObjectType(stringIDToTypeID("to")))).toBe("layer")
	expect(desc1.getObjectValue(stringIDToTypeID("to")).toBatchPlay()).toEqual({ abc: true, _obj: "layer" });
})