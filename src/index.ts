import { Descriptor } from "photoshop/dist/types/UXP";
import { ActionDescriptor } from "./ActionDescriptor";
import { ActionReference } from "./ActionReference";
import photoshop from "./imports";

const { action: { getIDFromString, getStringFromID,batchPlay } } = photoshop;
const { fromCharCode : fCode } = String;

/**
 * Controls whether Photoshop displays dialogs during scripts.
 */
export enum DialogModes {
	/**
	 * Show all dialogs.
	 */
	ALL = 1,
    
	/**
	 * Show only dialogs related to errors.
	 */
	ERROR = 2,
    
	/**
	 * Show no dialogs.
	 */
	NO = 3,
}

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

/**
   * Converts from a string ID to a runtime ID.
   * @param stringID The ID to convert.
   */
export function stringIDToTypeID(stringID: string): number{
	return getIDFromString(stringID);
}
  
  /**
   * Converts from a runtime ID to a character ID.
   * @param typeID The ID to convert.
   */
export function typeIDToCharID(typeID: number): string{
	return (fCode(typeID >> 24) + fCode((typeID >> 16) & 0xFF) + fCode((typeID >> 8) & 0xFF) + fCode(typeID & 0xFF));	
}

  /**
   * Converts from a runtime ID to a string ID.
   * @param typeID The ID to convert.
   */
export function typeIDToStringID(typeID: number): string{
	return getStringFromID(typeID);
}

  /**
   * Converts from a four character code to a runtime ID.
   * @param charID The ID to convert.
   */
export function charIDToTypeID(charID: string): number {
	return (charID.charCodeAt(0) * 0x1000000) +((charID.charCodeAt(1) << 16) |(charID.charCodeAt(2) << 8) |charID.charCodeAt(3))
}


  /**
   * Plays an ActionManager event.
   * @param eventID The event to play.
   * @param descriptor The action descriptor to play.
   * @param displayDialogs The display permissions for dialogs and alert messages.
   */
export function executeAction(eventID: number, descriptor?: ActionDescriptor, displayDialogs?: DialogModes): ActionDescriptor {
	let mode = "silent"
	switch (displayDialogs) {
		case DialogModes.ALL:
			mode = "display";
			break;
		case DialogModes.ERROR:
			mode = "silent"
			break;
		case DialogModes.NO:
			mode = "dontDisplay"
			break;
	}

	const obj = (!descriptor ? {} : descriptor.toBatchPlay());
	const descToPlay = [
		{
			"_obj": typeIDToStringID(eventID),
			...obj,
			"_options": {
				"dialogOptions": mode
			}
		}
	]
	console.log("Send",descToPlay);
	const result = batchPlay(descToPlay, {
		"synchronousExecution": true,
		"modalBehavior": "fail"
	}) as Descriptor[];
	const desc = ActionDescriptor.fromBatchPlay(result[0]);
	console.log("Reply", desc);
	return desc;
}
  
    /**
     * Obtains an action descriptor.
     * @param reference The reference specification of the property.
     */
/*export function executeActionGet(reference: ActionReference): ActionDescriptor {
	
}*/