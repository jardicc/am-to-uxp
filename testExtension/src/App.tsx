// App imports
import React from 'react'
import './App.css'
import {ActionDescriptor } from "../../src/ActionDescriptor"
import { stringIDToTypeID, executeAction, DialogModes } from '../../src';
import { ActionReference } from '../../src/ActionReference';

export default class App extends React.Component {
	constructor(props) {
		super(props)
	}

	public addLayer() {
		var idMk = stringIDToTypeID("make");
		var desc21 = new ActionDescriptor();
			var idnull = stringIDToTypeID("_target");
			var ref2 = new ActionReference();
				var idLyr = stringIDToTypeID("layer");
				ref2.putClass(idLyr);
			desc21.putReference(idnull, ref2);
			var idLyrI = stringIDToTypeID("layerID");
		desc21.putInteger(idLyrI, 3);
		executeAction(idMk, desc21, DialogModes.NO);
	}

	public render() {
		return (
			<div className="panel">
				<button onClick={() => this.addLayer()}>Add layer</button>
			</div>
		)
	}
}
