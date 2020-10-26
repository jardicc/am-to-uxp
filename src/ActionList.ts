
import { cloneDeep } from "lodash";
import { Descriptor } from "photoshop/dist/types/UXP";
import { stringIDToTypeID, typeIDToStringID } from ".";
import {ActionDescriptor, DescriptorValue } from "./ActionDescriptor";
import { ActionReference } from "./ActionReference";

export class ActionList {

	private _: any[] = [];

	constructor() {
		this._ = [];
	}

	public static fromBatchPlay(descriptor: Descriptor[]):ActionList {
		const desc = new ActionList();
		desc._ = descriptor;
		return desc;
	}

	/**
	 * The number of keys contained in the descriptor.
	 */
	public get count(): number {
		return this._.length;
	}

	/**
	 * The class name of the referenced ActionDescriptor object.
	 */
	public get typename(): string {
		return "ActionList";
	}

	/**
	 * Clears the list.
	 */
	public clear(): void {
		this._ = [];
	}

	/**
	 * Gets the value of list element of type boolean.
	 */
	public getBoolean(index: number): boolean {
		return this._[index];
	}

	/**
	 * Gets the value of list element of type class.
	 */
	public getClass(index: number): number {
		const item = this._[index] as any;
		return stringIDToTypeID(item._class);
	}

	/**
	 * Gets raw byte data as string value.
	 */
	public getData(index: number): string {
		throw new Error("Not implemented in am-for-uxp");
	}

	/**
	 * Gets the value of list element of type double.
	 */
	public getDouble(index: number): number {
		return this._[index];
	}

	/**
	 * Gets the enumeration type of list element.
	 */
	public getEnumerationType(index: number): number {
		const item = this._[index] as any;
		return stringIDToTypeID(item._enum);
	}

	/**
	 * Gets the enumeration value of list element.
	 */
	public getEnumerationValue(index: number): number {
		const item = this._[index] as any;
		return stringIDToTypeID(item._value);
	}

	/**
	 * Gets the value of list element of type integer.
	 */
	public getInteger(index: number): number {
		let value = this._[index] as number;
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		return value;
	}

	/**
	 * Gets the value of list element of type large integer.
	 */
	public getLargeInteger(index: number): number {
		let value = this._[index] as number;
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		return value;
	}

	/**
	 * Gets the value of list element of type list.
	 */
	public getList(index: number): ActionList {
		return ActionList.fromBatchPlay(this._[index]);
	}

	/**
	 * Gets the class ID of list element of type object.
	 */
	public getObjectType(index: number): number {
		const item = this._[index] as any;
		return stringIDToTypeID(item._obj);
	}

	/**
	 * Gets the value of list element of type object.
	 */
	public getObjectValue(index: number): ActionDescriptor {
		const item = ActionDescriptor.fromBatchPlay(this._[index] as any)
		return item;
	}

	/**
	 * Gets the value of list element of type File.
	 */
	public getPath(index: number): File {

	}

	/**
	 * Gets the value of list element of type ActionReference.
	 */
	public getReference(index: number): ActionReference {
		return ActionReference.fromBatchPlay(this._[index]);
	}

	/**
	 * Gets the value of list element of type string.
	 */
	public getString(index: number): string {
		return this._[index];
	}

	/**
	 * Gets the type of list element.
	 */
	public getType(index: number): DescValueType {

	}

	/**
	 * Gets the unit value type of list element of type double.
	 */
	public getUnitDoubleType(index: number): number {
		const item = this._[index] as any;
		return stringIDToTypeID(item._unit);
	}

	/**
	 * Gets the unit value of list element of type double.
	 */
	public getUnitDoubleValue(index: number): number {
		const item = this._[index] as any;
		return item._value;
	}

////////////////////

	/**
	 * Appends new value, true or false.
	 */
	public putBoolean(value: boolean): void {
		this._.push(value);
	}

	/**
	 * Appends new value, class or data type.
	 */
	public putClass(value: number): void {
		this._.push({ _class: typeIDToStringID(value) });
	}

	/**
	 * Appends new value, string containing raw byte data.
	 */
	public putData(value: string): void {
		throw new Error("Not implemented in am-for-uxp");
	}

	/**
	 * Appends new value, double.
	 */
	public putDouble(value: number): void {
		this._.push(value);
	}

	/**
	 * Appends new value, an enumerated (constant) value.
	 */
	public putEnumerated(enumType: number, value: number): void {
		this._.push({
			"_enum": typeIDToStringID(enumType),
			"_value": typeIDToStringID(value),
		});
	}

	/**
	 * Appends new value, an integer.
	 */
	public putInteger(value: number): void {
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		this._.push(value);
	}

	/**
	 * Appends new value, large integer.
	 */
	public putLargeInteger(value: number): void {
		if (value > 0) { value = Math.floor(value); }
		else { value = Math.ceil(value);}
		this._.push(value);
	}

	/**
	 * Appends new value, nested action list.
	 */
	public putList(value: ActionList): void {
		this._.push(value.toBatchPlay());
	}

	/**
	 * Appends new value, an object.
	 */
	public putObject(classID: number, value: ActionDescriptor): void {
		const desc = value.toBatchPlay();
		desc._obj = typeIDToStringID(classID);
		this._.push(desc);
	}

	/**
	 * Appends new value, path.
	 */
	public putPath(value: File): void {

	}

	/**
	 * Appends new value, reference to an object created in the script.
	 */
	public putReference(value: ActionReference): void {
		this._.push(value.toBatchPlay());
	}

	/**
	 * Appends new value, string.
	 */
	public putString(value: string): void {
		this._.push(value);
	}

	/**
	 * Appends new value, unit/value pair.
	 */
	public putUnitDouble(classID: number, value: number): void {
		this._.push({
			"_unit": typeIDToStringID(classID),
			"_value": value
		});
	}

	public toBatchPlay(): DescriptorValue[]{
		return this._;
	}


}