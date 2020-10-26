import { Descriptor } from "photoshop/dist/types/UXP";
import { stringIDToTypeID, typeIDToStringID } from ".";
import { cloneDeep } from "lodash";

/**
 * The type of action reference object.
 */
export enum ReferenceFormType {
	/**
	 * Class.
	 */
	CLASSTYPE = 7,
    
	/**
	 * Enumerated.
	 */
	ENUMERATED = 5,
    
	/**
	 * Identifier.
	 */
	IDENTIFIER = 3,
    
	/**
	 * Index.
	 */
	INDEX = 2,
    
	/**
	 * Name.
	 */
	NAME = 1,
    
	/**
	 * Offset.
	 */
	OFFSET = 4,
    
	/**
	 * Property.
	 */
	PROPERTY = 6,
    }

export class ActionReference {

	private _: any[];

	constructor() {
		this._ = [];
	}

	/**
	 * The class name of the referenced ActionDescriptor object.
	 */
	public get typename(): string{
		return "ActionReference"
	}

	public toBatchPlay(): Descriptor{		
		return cloneDeep(this._);
	}

	public static fromBatchPlay(descriptor: Descriptor[]):ActionReference {
		const ref = new ActionReference();
		ref._ = descriptor;
		return ref;
	}

	/**
	 * Gets reference contained in this reference. Container references provide additional pieces to the reference. This looks like another reference, but it is actually part of the same reference.
	 */
	public getContainer(): ActionReference {
		// pop first item and make new reference from the rest?
		const obj = cloneDeep(this._);
		obj.shift();
		return ActionReference.fromBatchPlay(obj);
	}

	/**
	 * Gets number representing the class of the object.
	 */
	public getDesiredClass(): number {
		return stringIDToTypeID(this._[0]._ref);
	}

	/**
	 * Gets the enumeration type.
	 */
	public getEnumeratedType(): number {
		return stringIDToTypeID(this._[0]._enum);
	}

	/**
	 * Gets the enumeration value.
	 */
	public getEnumeratedValue(): number {
		return stringIDToTypeID(this._[0]._value);
	}

	/**
	 * Gets the form of this action reference.
	 */
	public getForm(): ReferenceFormType {
		const item = this._[0];
		const keys = Object.keys(item);
		if (keys.includes("_id")) {
			return ReferenceFormType.IDENTIFIER;
		} else if (keys.includes("_index")) {
			return ReferenceFormType.INDEX;
		} else if (keys.includes("_name")) {
			return ReferenceFormType.NAME;
		} else if (keys.includes("_enum")) {
			return ReferenceFormType.ENUMERATED
		} else if (keys.includes("_property")) {
			return ReferenceFormType.PROPERTY;
		} else if (keys.includes("_offset")) {
			return ReferenceFormType.OFFSET;
		} else if (keys.includes("_ref")) {
			return ReferenceFormType.CLASSTYPE;
		}
		throw new Error("Wrong reference type");
	}

	/**
	 * Gets the identifier value for reference whose form is identifier.
	 */
	public getIdentifier(): number {
		return this._[0]._id;
	}

	/**
	 * Gets the index value for reference in list or array.
	 */
	public getIndex(): number {
		return this._[0]._index;
	}

	/**
	 * Gets the name of reference.
	 */
	public getName(): string {
		return this._[0]._name;
	}

	/**
	 * Gets the offset of the object's index value.
	 */
	public getOffset(): number {
		return this._[0]._offset;
	}

	/**
	 * Gets the property ID value.
	 */
	public getProperty(): number {
		return stringIDToTypeID(this._[0]._property);
	}

	/**
	 * Puts new class form and class type into the reference.
	 */
	public putClass(desiredClass: number): void {
		this._.push({ _ref: typeIDToStringID(desiredClass) });
	}

	/**
	 * Puts an enumeration type and ID into reference along with the desired class for the reference.
	 */
	public putEnumerated(desiredClass: number, enumType: number, value: number): void {
		this._.push({
			"_ref": typeIDToStringID(desiredClass),
			"_enum": typeIDToStringID(enumType),
			"_value": typeIDToStringID(value)
		});
	}

	/**
	 * Puts new identifier and value into the reference.
	 */
	public putIdentifier(desiredClass: number, value: number): void {
		this._.push({
			"_ref": typeIDToStringID(desiredClass),
			"_id": value,
		});
	}

	/**
	 * Puts new index and value into the reference.
	 */
	public putIndex(desiredClass: number, value: number): void {
		this._.push({
			"_ref": typeIDToStringID(desiredClass),
			"_index": value,
		});
	}

	/**
	 * Puts new name and value into the reference.
	 */
	public putName(desiredClass: number, value: string): void {
		this._.push({
			"_ref": typeIDToStringID(desiredClass),
			"_name": value,
		});
	}

	/**
	 * Puts new offset and value into the reference.
	 */
	public putOffset(desiredClass: number, value: number): void {
		this._.push({
			"_ref": typeIDToStringID(desiredClass),
			"_offset": value,
		});
	}

	/**
	 * Puts new property and value into the reference.
	 */
	public putProperty(desiredClass: number, value: number): void {
		this._.push({
			"_ref": typeIDToStringID(desiredClass),
			"_property": typeIDToStringID(value),
		});
	}
}