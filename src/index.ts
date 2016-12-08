type Lens<A, B> = {
    get: () => B;
    set: (element: A) => B;
    at: <K extends keyof B>(prop: K) => Lens<A, B[K]>;
};
