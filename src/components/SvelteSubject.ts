//@from : https://github.com/ReactiveX/rxjs/issues/4740
//TODO : submit to https://github.com/timdeschryver/svelte-utils

//const typeAhead = new BehaviorSubject('')
//typeAhead.set = typeAhead.next // cant do in typescript

import {Observable, Operator, BehaviorSubject} from 'rxjs';

export class SvelteSubject<T> extends BehaviorSubject<T> {

	constructor(initialValue?:T){
		super(initialValue);
	}

	set(value:T):void {
		super.next(value);
	}
	
	lift<R>(operator: Operator<T, R>): Observable<R> {
		const result = new SvelteSubject<R>();
		result.operator = operator;
		result.source = this;
		return result;
	}
}