import { DescValueType } from "./ActionDescriptor";

export function _getType(value:any):DescValueType {
	if (typeof value === "number") {
		if (Number.isInteger(value)) {
			return DescValueType.INTEGERTYPE;
		} else if (Number.isFinite(value)) {
			return DescValueType.DOUBLETYPE;
		}
	} else if (typeof value === "boolean") {
		return DescValueType.BOOLEANTYPE;
	} else if (typeof value === "string") {
		return DescValueType.STRINGTYPE;
	} else if (typeof value === "object") {
		const typeName = Object().toString.call(value);
		if (typeName === "[object ArrayBuffer]") { 
			return DescValueType.RAWTYPE;
		} else if (typeName === "[object Array]") {
			const arr  = value as any[];
			if (arr.length && ("_ref" in arr[0])) {
				return DescValueType.REFERENCETYPE;
			}
			return DescValueType.LISTTYPE;
		} else if (typeName === "[object Object]") {
			if ("_path" in value) {
				return DescValueType.ALIASTYPE;
			} else if ("_enum" in value) {
				return DescValueType.ENUMERATEDTYPE;
			} else if ("_ref" in value) {
				return DescValueType.REFERENCETYPE;
			} else if ("_unit" in value) {
				return DescValueType.UNITDOUBLE;
			} else if ("_class" in value) {
				return DescValueType.CLASSTYPE;
			} else {
				return DescValueType.OBJECTTYPE;
			}
		}
	}
	throw new Error("Wrong data type: " + value.toString());
}

export function _stringToArrayBuffer(str: string):ArrayBuffer {
	console.warn("WARNING AM -> UXP: I have no idea whether this datatype will work");
	var array = new Uint8Array(str.length);
	for (var i = 0, len = str.length; i < len; i++) {
		array[i] = str.charCodeAt(i);
	}
	return array.buffer
}

export function _arrayBufferToString(buffer: ArrayBuffer):string {
	let bufView = new Uint8Array(buffer);
	let length = bufView.length;
	let result = '';
	let addition: number = Math.pow(2, 16) - 1;
  
	for (let i = 0; i < length; i += addition) {
  
		if (i + addition > length) {
			addition = length - i;
		}
		result += String.fromCharCode(...bufView.subarray(i, i + addition));
	}
  
	return result;
}