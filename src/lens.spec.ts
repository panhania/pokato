import { expect } from "chai";

import { pure } from "./lens";


describe("pure", () => {

    it("should have getter like the I combinator", () => {
        expect(pure().get(42)).equals(42);
        expect(pure().get("foo")).equals("foo");
        expect(pure().get({ foo: 42 })).to.deep.equal({ foo: 42 });
    });

    it("should have setter like the K combinator", () => {
        expect(pure().set(-1, 42)).equals(42);
        expect(pure().set(42, -1)).equals(-1);
        expect(pure().set("foo", "bar")).equals("bar");
        expect(pure().set({ foo: 0 }, { bar: 0 })).to.have.property("bar");
    });
});
