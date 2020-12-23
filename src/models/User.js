import Model from './Model';
import Firebase from '../utils/Firebase';

export default class User extends Model {

	constructor(id) {

		super();

		if (id) this.getById(id);

	}

	get name() {

		return this._data.name;

	}

	set name(value) {

		return this._data.name = value;

	}

	get email() {

		return this._data.email;

	}

	set email(value) {

		return this._data.email = value;

	}

	get photo() {

		return this._data.photo;

	}

	set photo(value) {

		return this._data.photo = value;

	}

	getById(id) {

		return new Promise((resolve, reject) => {

			User.findByEmail(id).onSnapshot(doc => {

				this.fromJSON(doc.data());

				resolve(doc);

			});

		});

	}

	save() {

		return User.findByEmail(this.email).set(this.toJSON());

	}

	static getRef() {

		return Firebase.db().collection('/users');

	}

	static getContactRef(id) {

		return User.getRef()
			.doc(id)
			.collection('contacts');

	}

	static findByEmail(email) {

		return User.getRef().doc(email);

	}

	addContact(contact) {

		return User.getContactRef(this.email)
			.doc(btoa(contact.email))
			.set(contact.toJSON());

	}

	getContacts() {

		return new Promise((resolve, reject) => {

			User.getContactRef(this.email).onSnapshot(docs => {

				let contacts = [];

				docs.forEach(doc => {

					let data = doc.data();

					data.id = doc.id;

					contacts.push(data);

				});

				this.trigger('contactsChange', docs);

				resolve(contacts);

			});

		});

	}

}