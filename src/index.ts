type Lens<A, B> = {
    get: (item: A) => B;
    set: (item: A, part: B) => A;
};

function pure<A>(): Lens<A, A> {
    return {
        get: (item: A) => item,
        set: (_item: A, part: A) => part
    };
}

function view<A, K extends keyof A>(prop: K): Lens<A, A[K]> {
    return {
        get: (item: A) => item[prop],
        set: (item: A, part: A[K]) => {
            let cloned = Object.assign({}, item);
            cloned[prop] = part;
            return cloned;
        }
    };
}

function compose<A, B, C>(bc: Lens<B, C>, ab: Lens<A, B>): Lens<A, C> {
    return {
        get: (element: A) => bc.get(ab.get(element)),
        set: (item: A, part: C) => ab.set(item, bc.set(ab.get(item), part))
    };
}


class PseudoLens<A, B> {

    constructor(private item: A, private lens: Lens<A, B>) {
    }

    get(): B {
        return this.lens.get(this.item);
    }

    set(part: B): A {
        return this.lens.set(this.item, part);
    }

    modify(f: (part: B) => B): A {
        return this.lens.set(this.item, f(this.lens.get(this.item)));
    }

    at<K extends keyof B>(prop: K): PseudoLens<A, B[K]> {
        let lens: Lens<A, B[K]> = compose(view<B, K>(prop), this.lens)
        return new PseudoLens(this.item, lens);
    }
}

function lens<A>(item: A): PseudoLens<A, A> {
    return new PseudoLens(item, pure<A>());
}
