import { cloneDeep } from "lodash";
import { stringIDToTypeID, typeIDToStringID } from ".";
import { ActionList } from "./ActionList";
import { ActionReference } from "./ActionReference";

export type DescriptorValue = boolean | string | number | ArrayBuffer | Descriptor;

/**
 * The value type of an object.
 */
export enum DescValueType {
	/**
	 * Alias.
	 */
	ALIASTYPE = 11,
    
	/**
	 * Boolean.
	 */
	BOOLEANTYPE = 5,
    
	/**
	 * Class.
	 */
	CLASSTYPE = 10,
    
	/**
	 * Double.
	 */
	DOUBLETYPE = 2,
    
	/**
	 * Enumeration.
	 */
	ENUMERATEDTYPE = 8,
    
	/**
	 * Integer.
	 */
	INTEGERTYPE = 1,
    
	/**
	 *
	 */
	LARGEINTEGERTYPE = 13,
    
	/**
	 * Action list.
	 */
	LISTTYPE = 6,
    
	/**
	 * Object.
	 */
	OBJECTTYPE = 7,
    
	/**
	 * Raw.
	 */
	RAWTYPE = 12,
    
	/**
	 * Reference.
	 */
	REFERENCETYPE = 9,
    
	/**
	 * String.
	 */
	STRINGTYPE = 4,
    
	/**
	 * Unit value of type double.
	 */
	UNITDOUBLE = 3,
}

export interface Descriptor {
	[prop: string]: DescriptorValue|DescriptorValue[];
}

export class ActionDescriptor {

	private _ :Descriptor= {};

	constructor() {
		this._ = {};
	}

	public static fromBatchPlay(descriptor: Descriptor):ActionDescriptor {
		const desc = new ActionDescriptor();
		desc._ = descriptor;
		return desc;
	}

	/**
	 * The number of keys contained in the descriptor.
	 */
	public get count(): number {
		const keys = Object.keys(this._);
		return keys.includes("_obj") ? keys.length - 1 : keys.length;
	}

	/**
	 * The class name of the referenced ActionDescriptor object.
	 */
	public get typename(): string {
		return "ActionDescriptor";
	}

	/**
	 * Clears the descriptor.
	 */
	public clear(): void{
		this._ = {};
	}

	/**
	 * Erases key from the descriptor.
	 */
	public erase(key: number): void{
		console.log(this._);
		console.log(typeIDToStringID(key));
		console.log((key));

		delete this._[typeIDToStringID(key)];
		console.log(this._);
	}

	/**
	 * Gets the value of key of type boolean.
	 */
	public getBoolean(key: number): boolean{
		return this._[typeIDToStringID(key)] as boolean;
	}

	/**
	 * Gets the value of key of type class.
	 */
	public getClass(key: number): number{
		const item = this._[typeIDToStringID(key)] as any;
		return stringIDToTypeID(item._class);
	}

	/**
	 * Gets raw byte data as string value.
	 */
	public getData(key: number): string {

		function arrayBufferToString(buffer: ArrayBuffer):string {
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

		const data = this._[typeIDToStringID(key)] as ArrayBuffer;
		const str = arrayBufferToString(data);
		return str;
	}

	/**
	 * Gets the value of key of type double.
	 */
	public getDouble(key: number): number{
		return this._[typeIDToStringID(key)] as number;
	}

	/**
	 * Gets the enumeration type of key.
	 */
	public getEnumerationType(key: number): number{
		const item = this._[typeIDToStringID(key)] as any;
		return stringIDToTypeID(item._enum);
	}

	/**
	 * Gets the enumeration value of key.
	 */
	public getEnumerationValue(key: number): number{
		const item = this._[typeIDToStringID(key)] as any;
		return stringIDToTypeID(item._value);
	}

	/**
	 * Gets the value of key of type integer.
	 */
	public getInteger(key: number): number{
		let value = this._[typeIDToStringID(key)] as number;
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		return value;
	}

	/**
	 * Gets the ID of the Nth key, provided by index.
	 */
	public getKey(index: number): number{
		return stringIDToTypeID(Object.keys(this._)[index]);
	}

	/**
	 * Gets the value of key of type large integer.
	 */
	public getLargeInteger(key: number): number{
		let value = this._[typeIDToStringID(key)] as number;
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		return value;
	}

	/**
	 * Gets the value of key of type list.
	 */
	public getList(key: number): ActionList{
		return ActionList.fromBatchPlay(this._[typeIDToStringID(key)] as any);
	}

	/**
	 * Gets the class ID of an object in key of type object.
	 */
	public getObjectType(key: number): number{
		const item = this._[typeIDToStringID(key)] as any;
		return stringIDToTypeID(item._obj);
	}

	/**
	 * Gets the value of key of type object.
	 */
	public getObjectValue(key: number): ActionDescriptor{
		const item = ActionDescriptor.fromBatchPlay(this._[typeIDToStringID(key)] as any)
		return item;
	}

	/**
	 * Gets the value of key of type File.
	 */
	/*public getPath(key: number): File{

	}*/

	/**
	 * Gets the value of key of type ActionReference.
	 */
	public getReference(key: number): ActionReference{
		const newKey = (typeIDToStringID(key) === "null") ? "_target" : typeIDToStringID(key);
		return ActionReference.fromBatchPlay(this._[newKey] as Descriptor[]);
	}

	/**
	 * Gets the value of key of type string.
	 */
	public getString(key: number): string{
		return this._[typeIDToStringID(key)] as string;
	}

	/**
	 * Gets the type of key.
	 */
	public getType(key: number): DescValueType{
		const value = this._[typeIDToStringID(key)];
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

	/**
	 * Gets the unit type of key of type UnitDouble.
	 */
	public getUnitDoubleType(key: number): number{
		const item = this._[typeIDToStringID(key)] as any;
		return stringIDToTypeID(item._unit);
	}

	/**
	 * Gets the value of key of type UnitDouble.
	 */
	public getUnitDoubleValue(key: number): number{
		const item = this._[typeIDToStringID(key)] as any;
		return item._value;
	}

	/**
	 * Checks whether the descriptor contains the provided key.
	 */
	public hasKey(key: number): boolean{
		return Object.keys(this._).includes(typeIDToStringID(key));
	}

	/**
	 * Determines whether the descriptor is the same as another descriptor.
	 */
	public isEqual(otherDesc: ActionDescriptor): boolean{
		if (!this.count) {
			throw new Error("Unknown exception");
		}

		function recur(d1: any, d2: any): boolean {
			if (d1 === undefined || d2===undefined) { // custom error
				throw new Error("Error undefined value is not allowed"); 
			}
			if (d1 === null || d2===null) { // custom error
				throw new Error("Error null value is not allowed"); 
			}

			if (Object().toString.call(d1) !== Object().toString.call(d2)) {
				return false;
			}

			else if (Array.isArray(d1)) {
				if (d1.length !== d2.length) {
					return false;
				}
				for (let i = 0, len = d1.length; i < len; i++){
					const res = recur(d1[i], d2[i]);
					if (!res) {
						return false
					}
				}				
			} else if (typeof d1 === "object") {
				if (Object().toString.call(d1) === "[object ArrayBuffer]") {
					if (d1.byteLength !== d2.byteLength) {
						return false;
					}
					const dUint1 = new Uint8Array(d1);
					const dUint2 = new Uint8Array(d2);
					for (let i = 0, len = d1.byteLength; i < len; i++){
						if (dUint1[i] !== dUint2[i]) {
							return false;
						}
					}
					return true;
				} else {
					const keys1 = Object.keys(d1);
					const keys2 = Object.keys(d2);
					if (keys1.length !== keys2.length) {
						return false
					}
					const mappedKeys1:[number,string][] = keys1.map((k, i)=> ([i, stringIDToTypeID(k).toString()]));
					const mappedKeys2:[number,string][] = keys2.map((k, i) => ([i, stringIDToTypeID(k).toString()]));
					mappedKeys1.sort((a, b) => (a[1] > b[1]) ? -1 : 1);
					mappedKeys2.sort((a, b) => (a[1] > b[1]) ? -1 : 1);
					if (mappedKeys1.map(i => i[1]).join() !== mappedKeys2.map(i => i[1]).join()) {
						return false;
					}
					for (let i = 0, len = mappedKeys1.length; i < len; i++){
						const index1 = mappedKeys1[i][0];
						const index2 = mappedKeys2[i][0];
						const res = recur(d1[keys1[index1]], d2[keys2[index2]]);
						if (!res) {
							return false
						}
					}
					return true;
				}
			} else {
				return d1 === d2;
			}
			return true;
		}

		return recur(this.toBatchPlay(), otherDesc.toBatchPlay());
	}

	/**
	 * Sets the value for key whose type is boolean.
	 */
	public putBoolean(key: number, value: boolean): void{
		this._[typeIDToStringID(key)] = value;
	}

	/**
	 * Sets the value for key whose type is class.
	 */
	public putClass(key: number, value: number): void{
		this._[typeIDToStringID(key)] = { _class: typeIDToStringID(value) };
	}

	/**
	 * Puts raw byte data as string value.
	 */
	public putData(key: number, value: string): void {
		console.warn("WARNING AM -> UXP: I have no idea whether this datatype will work")
		function stringToArrayBuffer(str: string):ArrayBuffer {
			var array = new Uint8Array(str.length);
			for (var i = 0, len = str.length; i < len; i++) {
				array[i] = str.charCodeAt(i);
			}
			return array.buffer
		}
		this._[typeIDToStringID(key)] = stringToArrayBuffer(value);
	}

	/**
	 * Sets the value for key whose type is double.
	 */
	public putDouble(key: number, value: number): void{
		this._[typeIDToStringID(key)] = value;
	}

	/**
	 * Sets the enumeration type and value for key.
	 */
	public putEnumerated(key: number, enumType: number, value: number): void{
		this._[typeIDToStringID(key)] = {
			"_enum": typeIDToStringID(enumType),
			"_value": typeIDToStringID(value),
		}
	}

	/**
	 * Sets the value for key whose type is integer.
	 */
	public putInteger(key: number, value: number): void{
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		this._[typeIDToStringID(key)] = value;
	}

	/**
	 * Sets the value for key whose type is large integer.
	 */
	public putLargeInteger(key: number, value: number): void{
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		this._[typeIDToStringID(key)] = value;
	}

	/**
	 * Sets the value for key whose type is an ActionList object.
	 */
	public putList(key: number, value: ActionList): void{
		this._[typeIDToStringID(key)] = value.toBatchPlay();
	}

	/**
	 * Sets the value for key whose type is an object, represented by an ActionDescriptor.
	 */
	public putObject(key: number, classID: number, value: ActionDescriptor): void{
		const desc = value.toBatchPlay();
		desc._obj = typeIDToStringID(classID);
		this._[typeIDToStringID(key)] = desc;
	}

	/**
	 * Sets the value for key whose type is path.
	 */
	/*public putPath(key: number, value: File): void{

	}*/

	/**
	 * Sets the value for key whose type is an object reference.
	 */
	public putReference(key: number, value: ActionReference): void{
		const newKey = (typeIDToStringID(key) === "null") ? "_target" : typeIDToStringID(key);
		this._[newKey] = value.toBatchPlay();
	}

	/**
	 * Sets the value for key whose type is string.
	 */
	public putString(key: number, value: string): void{
		this._[typeIDToStringID(key)] = value;
	}

	/**
	 * Sets the value for key whose type is unit value formatted as double.
	 */
	public putUnitDouble(key: number, unitID: number, value: number): void{
		this._[typeIDToStringID(key)] = {
			"_unit": typeIDToStringID(unitID),
			"_value": value
		}
	}

	/**
	 * Creates descriptor from stream of bytes; for reading from disk.
	 */
	public fromStream(value: string): void{
		throw new Error("Not implemented in am-for-uxp");
	}

	/**
	 * Gets the entire descriptor as stream of bytes, for writing to disk.
	 */
	public toStream(): string{
		throw new Error("Not implemented in am-for-uxp");
	}

	public toBatchPlay(): Descriptor{		
		return cloneDeep(this._);
	}
}
