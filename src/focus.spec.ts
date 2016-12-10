import { expect } from "chai";

import { view } from "./lens";
import { focus } from "./focus";


describe("Focus", () => {

    let foo = {
        bar: 4,
        baz: 8,
        quux: {
            plugh: 15,
            thud: 16
        },
        norf: [23, 42]
    };

    it("should allow getting a value on a certain path", () => {
        expect(focus(foo).at("bar").get()).equals(4);
        expect(focus(foo).at("baz").get()).equals(8);
        expect(focus(foo).at("quux").get()).to.deep.equal({
            plugh: 15,
            thud: 16
        });
        expect(focus(foo).at("quux").at("plugh").get()).equals(15);
        expect(focus(foo).at("quux").at("thud").get()).equals(16);
        expect(focus(foo).at("norf").get()).to.deep.equal([23, 42]);
    });

    it("should allow setting deeply nested values", () => {
        expect(focus(foo).at("bar").set(1337)).to.deep.equal({
            bar: 1337,
            baz: 8,
            quux: {
                plugh: 15,
                thud: 16
            },
            norf: [23, 42]
        });
        expect(focus(foo).at("quux").set({ plugh: 0, thud: 7 })).to.deep.equal({
            bar: 4,
            baz: 8,
            quux: {
                plugh: 0,
                thud: 7
            },
            norf: [23, 42]
        });
        expect(focus(foo).at("quux").at("plugh").set(11)).to.deep.equal({
            bar: 4,
            baz: 8,
            quux: {
                plugh: 11,
                thud: 16
            },
            norf: [23, 42]
        });
        expect(focus(foo).at("norf").set([0, 0])).to.deep.equal({
            bar: 4,
            baz: 8,
            quux: {
                plugh: 15,
                thud: 16
            },
            norf: [0, 0]
        });
    });

    it("should allow mapping a function over deeply nested values", () => {
        let twice = (x: number) => x * 2;
        expect(focus(foo).at("bar").modify(twice)).to.deep.equal({
            bar: 8,
            baz: 8,
            quux: {
                plugh: 15,
                thud: 16
            },
            norf: [23, 42]
        });

        let inc = (x: number) => x + 1;
        expect(focus(foo).at("quux").at("thud").modify(inc)).to.deep.equal({
            bar: 4,
            baz: 8,
            quux: {
                plugh: 15,
                thud: 17
            },
            norf: [23, 42]
        });

        let append = (x: Array<number>) => x.concat([108]);
        expect(focus(foo).at("norf").modify(append)).to.deep.equal({
            bar: 4,
            baz: 8,
            quux: {
                plugh: 15,
                thud: 16
            },
            norf: [23, 42, 108]
        });
    });

    it("should allow fucusing using ordinary lenses", () => {
        let viewPlugh = view<{ plugh: number, thud: number }, "plugh">("plugh");
        expect(focus(foo).at("quux").with(viewPlugh).get()).equal(15);
    });
});
