import { Lens, pure, view, compose } from "./lens";


export class PseudoLens<A, B> {

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

    focus<C>(lens: Lens<B, C>): PseudoLens<A, C> {
        return new PseudoLens(this.item, compose(lens, this.lens));
    }

    at<K extends keyof B>(prop: K): PseudoLens<A, B[K]> {
        return this.focus<B[K]>(view<B, K>(prop));
    }
}

export function lens<A>(item: A): PseudoLens<A, A> {
    return new PseudoLens(item, pure<A>());
}
