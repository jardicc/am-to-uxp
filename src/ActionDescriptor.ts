import { cloneDeep } from "lodash";
import { Action } from "photoshop/dist/dom/Actions";
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
		return Object.keys(this._).length;
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
	 * Creates descriptor from stream of bytes; for reading from disk.
	 */
	public fromStream(value: string): void{
		throw new Error("Not implemented in am-for-uxp");
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
	public getData(key: number): string{
		throw new Error("Not implemented in am-for-uxp");
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
		return ActionReference.fromBatchPlay(this._[typeIDToStringID(key)] as Descriptor[]);
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
	/*public getType(key: number): DescValueType{

	}*/

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
	/*public isEqual(otherDesc: ActionDescriptor): boolean{

	}*/

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
	public putData(key: number, value: string): void{
		throw new Error("Not implemented in am-for-uxp");
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
	public putPath(key: number, value: File): void{

	}

	/**
	 * Sets the value for key whose type is an object reference.
	 */
	public putReference(key: number, value: ActionReference): void{
		this._[typeIDToStringID(key)] = value.toBatchPlay();
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
	 * Gets the entire descriptor as stream of bytes, for writing to disk.
	 */
	public toStream(): string{
		throw new Error("Not implemented in am-for-uxp");
	}

	public toBatchPlay(): Descriptor{		
		return cloneDeep(this._);
	}
}
