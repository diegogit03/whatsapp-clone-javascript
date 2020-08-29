export default class ClassEvent{

	constructor(){

		this._events = {};

	}

	on(EventName, callback){

		if(!this._events[EventName]) this._events[EventName] = new Array();

		this._events[EventName].push(callback);

	}

	trigger(){

		let args = [...arguments];
		let eventName = args.shift();

		args.push(new Event(eventName));

		if(this._events[eventName] instanceof Array){

			this._events[eventName].forEach(callback => {

				callback.apply(null, args);

			});

		}

	}

}