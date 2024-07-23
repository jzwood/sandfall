
const url = "/sandfall.wasm";

WebAssembly.instantiateStreaming(fetch(url), { console }).then(
  (obj) => {
    //obj.instance.exports.next();

    //const [width, height] = [128, 128]
    const [width, height] = [300, 200]
    const { memory, init, step } = obj.instance.exports;

    init(width, height)
    const length = width * height * 4

    //const memoryView = new DataView(mem.buffer);
    //const values = Array(30).fill(0).map((_, i) => memoryView.getUint8(i));
    //console.log("VALUES", values);

    const arr = new Uint8ClampedArray(memory.buffer);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    // Fill the array with the same RGBA values
    let imageData = new ImageData(arr.subarray(0, length), width, height);

    canvas.width = width;
    canvas.height = height;

    ctx.putImageData(imageData, 0, 0);
    step()
    ctx.putImageData(imageData, 0, 0);
    setInterval(() => {
      step()
      ctx.putImageData(imageData, 0, 0);
    }, 500)
  },
);
