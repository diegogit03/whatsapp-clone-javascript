const firebase = require('firebase');
require('firebase/firestore');

// config

import configuration from '../config';

export default class Firebase{

	constructor(){

		this._initialize = false;

		this._config = configuration.firebaseConfig;

		this.init();

	}

	init(){

		if(!this._initialize){
			firebase.initializeApp(this._config);

			firebase.firestore().settings({
				timestampsInSnapshots: true
			});

			this._initialize = true;	
		}

	}

	static db(){

		return firebase.firestore();

	}

	static hd(){

		return firebase.storage();

	}

	initAuth(){

		return new Promise((resolve, reject) => {

			let provider = new firebase.auth.GoogleAuthProvider();

			firebase.auth().signInWithPopup(provider)
			.then(result => {

				let token = result.credential.accessToken;
				let user = result.user;

				resolve({user, token});

			})
			.catch(error => {
				reject(error);
			});

		});

	}

}