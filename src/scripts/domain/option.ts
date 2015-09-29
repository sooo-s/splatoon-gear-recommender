//参考: http://r-h.hatenablog.com/entry/2014/06/10/211927
export class OptionT<A> {
    isEmpty: boolean
    get: () => A
    map<B>(f: (a: A) => B): OptionT<B> {
        return this.isEmpty ? new None : new Some(f(this.get()));
    }
    flatMap<B>(f: (a: A) => OptionT<B>): OptionT<B> {
        return this.isEmpty ? new None : f(this.get());
    }
    getOrElse<B extends A>(d: B): A {
        return this.isEmpty ? d : this.get();
    }
    filter(f: (a: A) => boolean): OptionT<A> {
        return (this.isEmpty || f(this.get())) ? this : new None;
    }
    exists(f: (a: A) => boolean): boolean {
        return !this.isEmpty && f(this.get());
    }
}

export class Some<A> extends OptionT<A> {
    isEmpty = false;
    get = () => this.value;
    constructor(private value: A) { super() }
}

export class None extends OptionT<any> {
    isEmpty = true;
    get: () => any = () => { throw ""; "" }
}

export var Optional = <A>(value: A) => {
    return value ? new Some<A>(value) : new None;
}
