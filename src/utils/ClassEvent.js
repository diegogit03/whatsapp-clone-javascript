export default class ClassEvent{

	constructor(){

		this._events = {
			play: [
				() => {

					console.log('a');

				},
				() => {

					console.log('b');

				},
			]
		};

	}

	on(EventName, callback){

		if(!this._events[EventName]) this._events = new Array();

		this._events[EventName].push(callback)

	}

}