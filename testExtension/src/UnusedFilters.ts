//------------------------------------------------------------------------------
// File: "[M] Remove unused filters.js"
// Version: 1.0
// Release Date: 2. 3. 2018
// Copyright: © 2018 Jaroslav Bereza <http://bereza.cz>
/*
    LICENSE
    =======
    This code is provided as is without warranty. The author assumes no responsibility for any inconvenience.
    
    
    Allowed:
    - You may use for commercial and non-commercial purposes without limitations
    - You may copy and distribute the script without restrictions
    - You may include this code in your non-commercial software projects
    - You may modify this script and share if you keep this license
    
    Prohibited
    - You may NOT selling this script without author's permission
    - You may NOT without author's permission using this script as part of software which you want monetize
    - You may NOT distribute script WITHOUT this license informations

*/
//------------------------------------------------------------------------------
// Version History:
//  1.0: date: 3. 3. 2018
//  - Initial release.
//------------------------------------------------------------------------------

import photoshop from "../../src/imports";
import { charIDToTypeID, DialogModes, executeAction, executeActionGet, stringIDToTypeID } from "../../src";
import { ActionDescriptor } from "../../src/ActionDescriptor";
import { ActionReference } from "../../src/ActionReference";

export function removeUnused() {
	


	/*
	    TODO:
	*/

	/*
	<javascriptresource>
	<name>[M] Remove unused filters 1.0</name>
	<enableinfo>true</enableinfo>
	<category>Magic</category>
	</javascriptresource>
	*/

	//#target Photoshop
	//app.bringToFront();

	var cTID = charIDToTypeID;
	var sTID = stringIDToTypeID;
	var app = photoshop.app;

	var TID = {
		property: charIDToTypeID("Prpr"),
		bounds: stringIDToTypeID("bounds"),
		layer: charIDToTypeID("Lyr "),
		layerLocking: stringIDToTypeID("layerLocking"),
		protectAll: stringIDToTypeID("protectAll"),
		group: stringIDToTypeID("group"),
		idNull: charIDToTypeID("null"),
		idDelete: charIDToTypeID("Dlt "),
		document: charIDToTypeID("Dcmn"),
		ordinal: charIDToTypeID("Ordn"),
		target: charIDToTypeID("Trgt"),
		hide: charIDToTypeID("Hd  "),
		application: charIDToTypeID("capp"),
		set: charIDToTypeID("setd"),
		to: charIDToTypeID("T   "),
		playbackOptions: stringIDToTypeID("playbackOptions"),
		hasBackgroundLayer: stringIDToTypeID("hasBackgroundLayer"),
		performance: stringIDToTypeID("performance"),
		numberOfLayers: stringIDToTypeID("numberOfLayers"),
		accelerated: stringIDToTypeID("accelerated")
	};



	var useNewMethod = true;


	initialize();
	function initialize() {
    
		if (app.documents.length == 0) {
			alert("Please open some document");
			return;
		}
		main();
	}


	function main() {
		var numberOfLayers = getNumberOfLayers();
	
		acceleratePlayback();
    
		// We want to avoid DOM code here because it can be slow if document has a lot layers and nested layerSets. So we will use Action Manager code.
		for (var layerIndex = numberOfLayers; layerIndex > 0; layerIndex--) { // stepsInside = how deep I am in folder structure
			if (skipLayer(layerIndex)) { continue; }

			var filterFXwrapperDesc = useNewMethod ?
				getLayerPropertyDescriptor(layerIndex, sTID("smartObjectMore")).getObjectValue(sTID("smartObjectMore")).getObjectValue(sTID("filterFX")) :
				getLayerPropertyDescriptor(layerIndex, sTID("smartObject")).getObjectValue(sTID("smartObject"))
				;
			var filterFXlist = filterFXwrapperDesc.getList(sTID(useNewMethod ? "filterFXList" : "filterFX"));


			if (useNewMethod) {
				var isWholeFXVisible = filterFXwrapperDesc.getBoolean(sTID("enabled"));

				if (!isWholeFXVisible) {
					removeFilter(layerIndex);
				}
			}

			for (var filterIndex = filterFXlist.count - 1, remaining = filterFXlist.count - 1; filterIndex >= 0; filterIndex--) {
				var filterFXitem = filterFXlist.getObjectValue(filterIndex);
				var isFXvisible = filterFXitem.getBoolean(sTID("enabled"));
				var isBlendZero = filterFXitem.getObjectValue(sTID("blendOptions")).getUnitDoubleValue(sTID("opacity")) === 0;
				if (!isFXvisible || isBlendZero) {
					// condition to avoid Photoshop crash
					if (remaining === 0) {
						removeFilter(layerIndex);
					} else {
						removeFilter(layerIndex, filterIndex + 1);
					}
					remaining--;
				}
			}
		}
	}

	///////////////////
	// Helpers
	///////////////////
	function skipLayer(index) {
		// first we ask for layer type property only because whole layer descriptor is slower and we can skip a lot full layers descriptors
		// anyway layerKind is new property so we use different method for older PS versions
		var isSmartObject;
		if (useNewMethod) {
			isSmartObject = getLayerPropertyDescriptor(index, sTID("layerKind")).getInteger(sTID("layerKind")) === 5;
		} else {
			var ref = new ActionReference();
			ref.putIndex(TID.layer, index);
			var desc = executeActionGet(ref);
			isSmartObject = desc.hasKey(sTID("smartObject"));
		}

		if (!isSmartObject) {
			return true;
		}

		var smartObjectDesc = getLayerPropertyDescriptor(index, sTID("smartObject")).getObjectValue(sTID("smartObject"));
		var hasFx = smartObjectDesc.hasKey(sTID("filterFX"));
		var isLocked = getLayerPropertyDescriptor(index, sTID("layerLocking")).getObjectValue(sTID("layerLocking")).getBoolean(sTID("protectAll"));
	
		if (!hasFx || isLocked) {
			return true;
		}

		return false;
	}


	function removeFilter(layerIndex, filterIndex?: number) {
		var desc = new ActionDescriptor();
		var ref = new ActionReference();
		// filter on specific index or whole filter group
		if (filterIndex !== undefined) {
			ref.putIndex(sTID("filterFX"), filterIndex);
		} else {
			ref.putClass(sTID("filterFX"));
		}
		ref.putIndex(TID.layer, layerIndex);

		// flags for theoreticaly speed up
		desc.putBoolean(stringIDToTypeID("preventAbort"), true);
		desc.putBoolean(stringIDToTypeID("suppressForcedMenuRebuild"), true);
		desc.putBoolean(stringIDToTypeID("suppressLowPriorityEvents"), true);

		desc.putReference(cTID("null"), ref);

		executeAction(cTID("Dlt "), desc, DialogModes.NO);
	}


	///////////////////////////////////////////////////////////////////////////////
	// Function: getNumberOfLayers
	// Usage: returns number of all layers in document
	// Input: <none> Must have an open document
	// Return: Integer
	///////////////////////////////////////////////////////////////////////////////
	function getNumberOfLayers() {
		var desc = getDocumentPropertyDescriptor(TID.numberOfLayers);
		var numberOfLayers = desc.getInteger(TID.numberOfLayers);
		return numberOfLayers;
	}

	/////////////
	// UTILITY
	/////////////

	///////////////////////////////////////////////////////////////////////////////
	// Function: getLayerPropertyDescriptor
	// Usage: shortcut helper function which return info about layer property
	// Input: Index of desired layer, typeID of desired property
	// Return: ActionDescriptor
	///////////////////////////////////////////////////////////////////////////////
	function getLayerPropertyDescriptor(index, property) {
		var ref = new ActionReference();
		ref.putProperty(TID.property, property);
		ref.putIndex(TID.layer, index);
		var desc = executeActionGet(ref);
		return desc;
	}

	///////////////////////////////////////////////////////////////////////////////
	// Function: getDocumentPropertyDescriptor
	// Usage: shortcut helper function which return info about current document property
	// Input: TypeID of desired property
	// Return: ActionDescriptor
	///////////////////////////////////////////////////////////////////////////////
	function getDocumentPropertyDescriptor(property) {
		var ref = new ActionReference();
		ref.putProperty(TID.property, property);
		ref.putEnumerated(TID.document, TID.ordinal, TID.target);
		var desc = executeActionGet(ref);
		return desc;
	}


	///////////////////////////////////////////////////////////////////////////////
	// Function: acceleratePlayback
	// Usage: in action preferences can be set delay between each action so we make sure that there is no delay
	// Input: <none>
	// Return: undefined
	///////////////////////////////////////////////////////////////////////////////
	function acceleratePlayback() {
		var desc = new ActionDescriptor();
		var ref = new ActionReference();
		var desc2 = new ActionDescriptor();
		ref.putProperty(TID.property, TID.playbackOptions);
		ref.putEnumerated(TID.application, TID.ordinal, TID.target);
		desc.putReference(TID.idNull, ref);
		desc2.putEnumerated(TID.performance, TID.performance, TID.accelerated);
		desc.putObject(TID.to, TID.playbackOptions, desc2);
		executeAction(TID.set, desc, DialogModes.NO);
	}
}