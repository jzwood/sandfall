const url = "/sandfall.wasm";
WebAssembly.instantiateStreaming(fetch(url), { console }).then(
  (obj) => {
    // Call an exported function:
    //obj.instance.exports.next();
    obj.instance.exports.init();
    //obj.instance.exports.set_bytes();

    // or access the buffer contents of an exported memory:
    //const grid = new DataView(obj.instance.exports.memory.buffer);

    const { memory: mem, set_bytes } = obj.instance.exports
    const memoryView = new DataView(mem.buffer);

    const values = Array(30).fill(0).map((_, i) => memoryView.getUint8(i))
    console.log("VALUES", values)

    const mem2 = new Uint8Array(mem.buffer);
    const values2 = mem2.slice(0, 30);
    console.log("V2", values2)
  },
);
