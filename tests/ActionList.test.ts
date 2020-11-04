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
import { ActionDescriptor, DescValueType } from "../src/ActionDescriptor";
import { ActionList } from "../src/ActionList"
import { ActionReference } from "../src/ActionReference";

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

describe("getType", () => {

	var d: ActionList;
	var key = stringIDToTypeID("abc");
	beforeEach(() => {
		d = new ActionList();
	})

	it("ALIASTYPE",()=>{

	})
	it("BOOLEANTYPE",()=>{
		d.putBoolean(true);
		expect(d.getType(key)).toBe(DescValueType.BOOLEANTYPE);
	})
	it("CLASSTYPE",()=>{
		d.putClass(stringIDToTypeID("xyz"));
		expect(d.getType(key)).toBe(DescValueType.CLASSTYPE);
	})
	it("DOUBLETYPE",()=>{
		d.putDouble(1.22);
		expect(d.getType(key)).toBe(DescValueType.DOUBLETYPE);
	})
	it("ENUMERATEDTYPE",()=>{
		d.putEnumerated(stringIDToTypeID("xxx"), stringIDToTypeID("yyy"));
		expect(d.getType(key)).toBe(DescValueType.ENUMERATEDTYPE);
	})
	it("INTEGERTYPE",()=>{
		d.putInteger(1);
		expect(d.getType(key)).toBe(DescValueType.INTEGERTYPE);
	})
	it("LARGEINTEGERTYPE",()=>{
		d.putInteger(Number.MAX_SAFE_INTEGER);
		expect(d.getType(key)).toBe(DescValueType.INTEGERTYPE);
	})
	it("LISTTYPE",()=>{
		d.putList(new ActionList());
		expect(d.getType(key)).toBe(DescValueType.LISTTYPE);
	})
	it("OBJECTTYPE",()=>{
		d.putObject(stringIDToTypeID("xyz"), new ActionDescriptor());
		expect(d.getType(key)).toBe(DescValueType.OBJECTTYPE);
	})
	it("RAWTYPE",()=>{
		d.putData("abc");
		expect(d.getType(key)).toBe(DescValueType.RAWTYPE);
	})
	it("REFERENCETYPE", () => {
		const ref = new ActionReference();
		ref.putIdentifier(key,1);
		d.putReference(ref);
		expect(d.getType(key)).toBe(DescValueType.REFERENCETYPE);
	})
	it("STRINGTYPE",()=>{
		d.putString("abc");
		expect(d.getType(key)).toBe(DescValueType.STRINGTYPE);
	})
	it("UNITDOUBLE",()=>{
		d.putUnitDouble(stringIDToTypeID("x"), 1.22);
		expect(d.getType(key)).toBe(DescValueType.UNITDOUBLE);
	})
})

describe("data", () => {

	it("can put data", () => {
		var d = new ActionList();
		d.putData("\x00\x01\x02\x03");
		var data:any[] = d.toBatchPlay();
		data[0] = Array.from(new Uint8Array(data[0] as ArrayBuffer));
		expect(data[0]).toEqual([0,1,2,3]);
	})

	it("can get data", () => {
		var d = ActionList.fromBatchPlay([new Uint8Array([0,1,2,3]).buffer]);
		var data = d.getData(0);
		expect(data).toEqual("\x00\x01\x02\x03");
	})
})

describe("list", () => {
	it("can put list", () => {
		var d = new ActionList();
		d.putList(new ActionList());
		expect(d.toBatchPlay()).toEqual([[]]);
	})

	it("can get list", () => {
		var d = ActionList.fromBatchPlay([[]]);
		expect(d.getList(0).toBatchPlay()).toEqual([]);
	})
})

describe("reference", () => {
	it("can put reference", () => {
		var d = new ActionList();
		var ref = new ActionReference();
		ref.putClass(stringIDToTypeID("abc"));
		d.putReference(ref);
		expect(d.toBatchPlay()).toEqual([[{_ref:"abc"}]])
	})

	it("can get reference", () => {
		var d = ActionList.fromBatchPlay([[{_ref:"abc"}]])
		expect(d.getReference(0).toBatchPlay()).toEqual([{_ref:"abc"}])
		expect(d.getReference(0).typename).toEqual("ActionReference")
	})
})

it("can put/get object", () => {
	var list = new ActionList();
	var desc = new ActionDescriptor();
	desc.putBoolean( stringIDToTypeID("abc"),true );	
	list.putObject(stringIDToTypeID("layer"), desc);
	
	expect(list.toBatchPlay()).toEqual([{ abc: true, _obj: "layer" }]);
	expect(typeIDToStringID(list.getObjectType(0))).toBe("layer")
	expect(list.getObjectValue(0).toBatchPlay()).toEqual({ abc: true, _obj: "layer" });
})