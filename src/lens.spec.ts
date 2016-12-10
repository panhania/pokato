import { expect } from "chai";

import { pure, view, compose } from "./lens";


describe("pure", () => {

    it("should have a getter like the I combinator", () => {
        expect(pure().get(42)).equals(42);
        expect(pure().get("foo")).equals("foo");
        expect(pure().get({ foo: 42 })).to.deep.equal({ foo: 42 });
    });

    it("should have a setter like the K combinator", () => {
        expect(pure().set(-1, 42)).equals(42);
        expect(pure().set(42, -1)).equals(-1);
        expect(pure().set("foo", "bar")).equals("bar");
        expect(pure().set({ foo: 0 }, { bar: 0 })).to.have.property("bar");
    });
});

describe("view", () => {

    let foo1 = { bar: 42, baz: "quux" };
    let foo2 = { bar: 1337, baz: "norf" };

    let viewBar = view<{ bar: number, baz: string }, "bar">("bar");
    let viewBaz = view<{ bar: number, baz: string }, "baz">("baz");

    it("should have a getter accessing given property", () => {
        expect(viewBar.get(foo1)).equals(42);
        expect(viewBar.get(foo2)).equals(1337);
        expect(viewBaz.get(foo1)).equals("quux");
        expect(viewBaz.get(foo2)).equals("norf");
    });

    it("should have a setter updating only a specific property", () => {
        expect(viewBar.set(foo1, 41)).to.deep.equal({
            bar: 41,
            baz: "quux",
        });
        expect(viewBar.set(foo2, -1)).to.deep.equal({
            bar: -1,
            baz: "norf",
        });
        expect(viewBaz.set(foo1, "xoxo")).to.deep.equal({
            bar: 42,
            baz: "xoxo",
        });
        expect(viewBaz.set(foo2, "yolo")).to.deep.equal({
            bar: 1337,
            baz: "yolo",
        });
    });
});

describe("compose", () => {

    it("should yield a pure lens when given two pure lenses", () => {
        let lens = <T>() => compose(pure<T>(), pure<T>());
        expect(lens().get(42)).equals(42);
        expect(lens().get("foo")).equals("foo");
        expect(lens().set(42, 0)).equals(0);
        expect(lens().set(0, 42)).equals(42);
        expect(lens().set("foo", "bar")).equals("bar");
    });

    it("should allow accessing nested properties", () => {
        let viewBar = view<{ bar: { baz: number } }, "bar">("bar");
        let viewBaz = view<{ baz: number }, "baz">("baz");
        let foo = { bar: { baz: 42 } };
        expect(compose(viewBaz, viewBar).get(foo)).equal(42);
        expect(compose(viewBaz, viewBar).set(foo, 1337)).to.deep.equal({
            bar: {
                baz: 1337,
            },
        });
    });
});
