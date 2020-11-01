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
import { ActionDescriptor, DescValueType } from "../src/ActionDescriptor"
import { ActionList } from "../src/ActionList";
import { ActionReference } from "../src/ActionReference";

beforeEach(() => {
	_registry = [];
})


describe("count", () => {
	it("can get ActionDescriptor count for empty descriptor", () => {
		var desc = new ActionDescriptor();
		expect(desc.count).toBe(0);
	})
	
	it("can get ActionDescriptor with two props", () => {
		var desc = new ActionDescriptor();
		desc.putBoolean(stringIDToTypeID("xyz"), true);
		desc.putBoolean(stringIDToTypeID("abc"), true);
		expect(desc.count).toBe(2);
	})

	it("can ignore ActionDescriptor type prop", () => {
		var desc = ActionDescriptor.fromBatchPlay({
			xyz: true, abc: true, _obj: "opq"
		});
		expect(desc.count).toBe(2);
	})
})

describe("list", () => {
	it("can put list", () => {
		var d = new ActionDescriptor();
		d.putList(stringIDToTypeID("abc"), new ActionList());
		expect(d.toBatchPlay()).toEqual({
			abc:[]
		})
	})

	it("can get list", () => {
		var d = ActionDescriptor.fromBatchPlay({ abc: [] });
		expect(d.getList(stringIDToTypeID("abc")).toBatchPlay()).toEqual([]);
	})
})

describe("reference", () => {
	it("can put reference", () => {
		var d = new ActionDescriptor();
		d.putReference(stringIDToTypeID("null"), new ActionReference());
		expect(d.toBatchPlay()).toEqual({
			_target:[]
		})

		var d2 = new ActionDescriptor();
		d2.putReference(stringIDToTypeID("abc"), new ActionReference());
		expect(d2.toBatchPlay()).toEqual({
			abc:[]
		})
	})

	it("can get reference", () => {
		var d = ActionDescriptor.fromBatchPlay({
			_target:[]
		})
		expect(d.getReference(stringIDToTypeID("null")).toBatchPlay()).toEqual([])
		expect(d.getReference(stringIDToTypeID("null")).typename).toEqual("ActionReference")

		var d2 = ActionDescriptor.fromBatchPlay({
			abc:[]
		})
		expect(d2.getReference(stringIDToTypeID("abc")).toBatchPlay()).toEqual([])
		expect(d2.getReference(stringIDToTypeID("abc")).typename).toEqual("ActionReference")
	})
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

describe("data", () => {

	it("can put data", () => {
		var d = new ActionDescriptor();
		d.putData(stringIDToTypeID("abc"), "\x00\x01\x02\x03");
		var data = d.toBatchPlay();
		data.abc = Array.from(new Uint8Array(data.abc as ArrayBuffer));
		expect(data).toEqual({abc:[0,1,2,3]});
	})

	it("can get data", () => {
		var d = ActionDescriptor.fromBatchPlay({abc:new Uint8Array([0,1,2,3]).buffer});
		var data = d.getData(stringIDToTypeID("abc"));
		expect(data).toEqual("\x00\x01\x02\x03");
	})
})

describe("getType", () => {

	var d: ActionDescriptor;
	var key = stringIDToTypeID("abc");
	beforeEach(() => {
		d = new ActionDescriptor();
	})

	it("ALIASTYPE",()=>{

	})
	it("BOOLEANTYPE",()=>{
		d.putBoolean(key, true);
		expect(d.getType(key)).toBe(DescValueType.BOOLEANTYPE);
	})
	it("CLASSTYPE",()=>{
		d.putClass(key, stringIDToTypeID("xyz"));
		expect(d.getType(key)).toBe(DescValueType.CLASSTYPE);
	})
	it("DOUBLETYPE",()=>{
		d.putDouble(key, 1.22);
		expect(d.getType(key)).toBe(DescValueType.DOUBLETYPE);
	})
	it("ENUMERATEDTYPE",()=>{
		d.putEnumerated(key, stringIDToTypeID("xxx"), stringIDToTypeID("yyy"));
		expect(d.getType(key)).toBe(DescValueType.ENUMERATEDTYPE);
	})
	it("INTEGERTYPE",()=>{
		d.putInteger(key, 1);
		expect(d.getType(key)).toBe(DescValueType.INTEGERTYPE);
	})
	it("LARGEINTEGERTYPE",()=>{
		d.putInteger(key, Number.MAX_SAFE_INTEGER);
		expect(d.getType(key)).toBe(DescValueType.INTEGERTYPE);
	})
	it("LISTTYPE",()=>{
		d.putList(key, new ActionList());
		expect(d.getType(key)).toBe(DescValueType.LISTTYPE);
	})
	it("OBJECTTYPE",()=>{
		d.putObject(key, stringIDToTypeID("xyz"), new ActionDescriptor());
		expect(d.getType(key)).toBe(DescValueType.OBJECTTYPE);
	})
	it("RAWTYPE",()=>{
		d.putData(key, "abc");
		expect(d.getType(key)).toBe(DescValueType.RAWTYPE);
	})
	it("REFERENCETYPE", () => {
		const ref = new ActionReference();
		ref.putIdentifier(key, 1);
		d.putReference(key, ref);
		expect(d.getType(key)).toBe(DescValueType.REFERENCETYPE);
	})
	it("STRINGTYPE",()=>{
		d.putString(key, "abc");
		expect(d.getType(key)).toBe(DescValueType.STRINGTYPE);
	})
	it("UNITDOUBLE",()=>{
		d.putUnitDouble(key, stringIDToTypeID("x"), 1.22);
		expect(d.getType(key)).toBe(DescValueType.UNITDOUBLE);
	})
})

describe("is equal", () => {
	it("will throw error on empty descriptor", () => {
		var d1 = new ActionDescriptor();
		var d2 = new ActionDescriptor();
		expect(() => { 
			d1.isEqual(d2);
		}).toThrowError("Unknown exception");
	})

	it("is order independent", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			a:true,
			z:"g",
			abc: "xyz",
			xyz: true,
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: true,
			z:"g",
			a:true,
			abc: "xyz",
		});

		expect(d1.isEqual(d2)).toBe(true);
	})

	it("returns false when number of keys is different", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			abc: "xyz",
			xyz: true,
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: true,
		});

		expect(d1.isEqual(d2)).toBe(false);
	})

	it("returns false when number of keys is same but names are different", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			abc: "xyz",
			xyz: true,
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			abc: "xyz",
			xxx: true,
		});

		expect(d1.isEqual(d2)).toBe(false);
	})

	it("returns false when values are different", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: true,
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: false,
		});
		expect(d1.isEqual(d2)).toBe(false);
	})

	it("can match array", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: [true,false],
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: [true, false],
		});
		expect(d1.isEqual(d2)).toBe(true);
	})

	it("won't match array based on length", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: [true,false],
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: [true],
		});
		expect(d1.isEqual(d2)).toBe(false);
	})

	it("won't match array based on value", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: [false],
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: [true],
		});
		expect(d1.isEqual(d2)).toBe(false);
	})

	it("won't match based on different types", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: {},
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: [],
		});
		expect(d1.isEqual(d2)).toBe(false);
	})

	it("will throw error on null value", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz:null,
		} as any);
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: null,
		} as any);
		expect(() => { 
			d1.isEqual(d2);
		}).toThrowError("Error null value is not allowed");
	})

	it("will throw error on undefined value", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz:undefined,
		} as any);
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: undefined,
		} as any);
		expect(() => { 
			d1.isEqual(d2);
		}).toThrowError("Error undefined value is not allowed");
	})

	it("can match complex descriptor", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: {
				a: 1,
				b: [
					{
						c: { d: false },
					},
					-1.1
				]
			},
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: {
				a: 1,
				b: [
					{
						c: { d: false },
					},
					-1.1
				]
			},
		});
		expect(d1.isEqual(d2)).toBe(true);
	})

	it("can match array buffer", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: new Uint8Array([1,2,3]).buffer,
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: new Uint8Array([1,2,3]).buffer,
		});
		expect(d1.isEqual(d2)).toBe(true);
	})

	it("won't match array buffer based on length", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: new Uint8Array([1,2]).buffer,
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: new Uint8Array([1,2,3]).buffer,
		});
		expect(d1.isEqual(d2)).toBe(false);
	})

	it("won't match array buffer based on content", () => {
		var d1 = ActionDescriptor.fromBatchPlay({
			xyz: new Uint8Array([1,2,3]).buffer,
		});
		var d2 = ActionDescriptor.fromBatchPlay({
			xyz: new Uint8Array([1,2,4]).buffer,
		});
		expect(d1.isEqual(d2)).toBe(false);
	})
})