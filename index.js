
const url = "/sandfall.wasm";

WebAssembly.instantiateStreaming(fetch(url), { console }).then(
  (obj) => {
    //obj.instance.exports.next();

    const { memory: mem, init, width: getWidth } = obj.instance.exports;
    init()

    const memoryView = new DataView(mem.buffer);

    //const values = Array(30).fill(0).map((_, i) => memoryView.getUint8(i));
    //console.log("VALUES", values);

    const arr = new Uint8ClampedArray(mem.buffer);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    // Fill the array with the same RGBA values
    const width = 256
    const height = 256
    let imageData = new ImageData(arr, width, height);

    canvas.width = width;
    canvas.height = height;

    //ctx.putImageData(imageData, 0, 0);
    //console.log(mem.buffer, width * height * 4)
    //setInterval(() => {
      //next()
      //ctx.putImageData(imageData, 0, 0);
    //}, 500)
  },
);
