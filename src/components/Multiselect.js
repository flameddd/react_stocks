import React from 'react';
import Select from 'react-select';

import '../styles/react-select.css'
import { selectSymbols } from '../unit/const'


var MultiSelectField = React.createClass({
	displayName: 'MultiSelectField',
	propTypes: {
		label: React.PropTypes.string,
	},
	getInitialState () {
		return {
			options: selectSymbols,
			value: [],
		};
	},
	handleSelectChange (value) {
		//console.log('You\'ve selected:', value);
		this.setState({ value });
		this.props.getSelected(value);
	},
	
	clearSelected(){
		this.setState({ value:[] });
	},

	render () {
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select multi simpleValue disabled={this.state.disabled} value={this.state.value} placeholder="選擇股票" options={this.state.options} onChange={this.handleSelectChange} />
			</div>
		);
	}
});

module.exports = MultiSelectField;
