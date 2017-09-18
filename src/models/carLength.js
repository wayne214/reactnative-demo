import Immutable from 'immutable';

const CarLengthRecord = Immutable.Record({
	
	key: null,
	value: null,
	type: null,
	isChecked: false,
	// isCheckedAll: false,
});

export default class CarLength extends CarLengthRecord {
}