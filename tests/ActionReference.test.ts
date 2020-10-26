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
import { ActionReference, ReferenceFormType } from "../src/ActionReference"

beforeEach(() => {
	_registry = [];
})

it("can get typename", () => {
	var desc = new ActionReference();
	expect(desc.typename).toBe("ActionReference");
})

it("can convert toBatchPlay", () => {
	
})
it("can create fromBatchPlay", () => {
	
})
it("can get container", () => {
	
})
it("can getDesiredClass", () => {
	var ref = new ActionReference();
	ref.putClass(stringIDToTypeID("abc"));
	expect(typeIDToStringID(ref.getDesiredClass())).toBe("abc");
	expect(ref.toBatchPlay()).toEqual([{ _ref: "abc" }]);

})
it("can getEnumeratedType", () => {
	
})
it("can getEnumeratedValue", () => {
	
})
describe("can getForm", () => {
	var ref:ActionReference;
	beforeEach(() => {
		ref = new ActionReference();
	})
	it("can detect id", () => {
		ref.putIdentifier(stringIDToTypeID("abc"), 22);
		expect(ref.getForm()).toBe(ReferenceFormType.IDENTIFIER);
	})
	it("can detect index", () => {
		ref.putIndex(stringIDToTypeID("abc"), 22);
		expect(ref.getForm()).toBe(ReferenceFormType.INDEX);
	})
	it("can detect name", () => {
		ref.putName(stringIDToTypeID("abc"), "xyz");
		expect(ref.getForm()).toBe(ReferenceFormType.NAME);
	})
	it("can detect enum", () => {
		ref.putEnumerated(stringIDToTypeID("abc"), stringIDToTypeID("xyz"), stringIDToTypeID("opq"));
		expect(ref.getForm()).toBe(ReferenceFormType.ENUMERATED);
	})
	it("can detect property", () => {
		ref.putProperty(stringIDToTypeID("abc"), stringIDToTypeID("myProp"));
		expect(ref.getForm()).toBe(ReferenceFormType.PROPERTY);
	})
	it("can detect offset", () => {
		ref.putOffset(stringIDToTypeID("abc"), 22);
		expect(ref.getForm()).toBe(ReferenceFormType.OFFSET);
	})
	it("can detect class", () => {
		ref.putClass(stringIDToTypeID("abc"));
		expect(ref.getForm()).toBe(ReferenceFormType.CLASSTYPE);
	})
})
it("can putEnumerated", () => {
	var ref = new ActionReference();
	ref.putEnumerated(stringIDToTypeID("abc"), stringIDToTypeID("xyz"), stringIDToTypeID("opq"));

	expect(typeIDToStringID(ref.getEnumeratedType())).toBe("xyz");
	expect(typeIDToStringID(ref.getEnumeratedValue())).toBe("opq");
	expect(ref.toBatchPlay()).toEqual([{ _enum: "xyz", _ref: "abc", _value: "opq" }]);
})
it("can getIdentifier", () => {
	var ref = new ActionReference();
	ref.putIdentifier(stringIDToTypeID("abc"), 22);

	expect(ref.getIdentifier()).toBe(22);
	expect(ref.toBatchPlay()).toEqual([{ "_id": 22, _ref: "abc" }]);
})
it("can getIndex", () => {
	var ref = new ActionReference();
	ref.putIndex(stringIDToTypeID("abc"), 22);

	expect(ref.getIndex()).toBe(22);
	expect(ref.toBatchPlay()).toEqual([{ "_index": 22, _ref: "abc" }]);
})
it("can getName", () => {
	var ref = new ActionReference();
	ref.putName(stringIDToTypeID("abc"), "xyz");

	expect(ref.getName()).toBe("xyz");
	expect(ref.toBatchPlay()).toEqual([{ "_name": "xyz", _ref: "abc" }]);
})
it("can getOffset", () => {
	var ref = new ActionReference();
	ref.putOffset(stringIDToTypeID("abc"), 22);

	expect(ref.getOffset()).toBe(22);
	expect(ref.toBatchPlay()).toEqual([{ "_offset": 22, _ref: "abc" }]);
})
it("can getProperty", () => {
	var ref = new ActionReference();
	ref.putProperty(stringIDToTypeID("abc"), stringIDToTypeID("myProp"));

	expect(typeIDToStringID(ref.getProperty())).toBe("myProp");
	expect(ref.toBatchPlay()).toEqual([{ "_property": "myProp", _ref: "abc" }]);
})

it("can make ActionReference from batch play object", () => {
	var ref = ActionReference.fromBatchPlay([{ "_name": "xyz", _ref: "abc" }]);
	expect(ref.toBatchPlay()).toEqual([{ "_name": "xyz", _ref: "abc" }]);
})

it("can get container", () => {
	var ref = new ActionReference();
	ref.putName(stringIDToTypeID("abc"), "xyz");
	ref.putIndex(stringIDToTypeID("bcd"), 22);
	ref.putProperty(stringIDToTypeID("cde"), stringIDToTypeID("myProp"));

	expect(ref.getName()).toBe("xyz");
	var ref2 = ref.getContainer();
	expect(ref2.getIndex()).toBe(22);
	var ref3 = ref2.getContainer();
	expect(typeIDToStringID(ref3.getProperty())).toBe("myProp");
})