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
        set: (item: A, part: A[K]) => Object.assign({}, item, { prop: part })
    };
}

function compose<A, B, C>(bc: Lens<B, C>, ab: Lens<A, B>): Lens<A, C> {
    return {
        get: (element: A) => bc.get(ab.get(element)),
        set: (item: A, part: C) => ab.set(item, bc.set(ab.get(item), part))
    };
}
