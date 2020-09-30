import ClassEvent from '../utils/ClassEvent';
import Firebase from '../utils/Firebase';

export default class User extends ClassEvent{

	static getRef(){

		return Firebase.db().collection('/users');

	}

	static findByEmail(email){

		return User.getRef().doc(email);

	}

}