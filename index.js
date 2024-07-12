const url = "/sandfall.wasm";
WebAssembly.instantiateStreaming(fetch(url), { console }).then(
  (obj) => {
    // Call an exported function:
    //obj.instance.exports.next();
    obj.instance.exports.init();

    // or access the buffer contents of an exported memory:
    const grid = new DataView(obj.instance.exports.memory.buffer);
    debugger;
  },
);
