const url = "/sandfall.wasm";

WebAssembly.instantiateStreaming(fetch(url), { console }).then(
  (obj) => {
    //obj.instance.exports.next();

    //const [width, height] = [128, 128]
    const [width, height, scale] = [300, 200, 3];
    const { memory, init, step, stamp, block_stamp: blockStamp } =
      obj.instance.exports;

    init(width, height);
    const length = width * height * 4;

    const arr = new Uint8ClampedArray(memory.buffer);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    // Fill the array with the same RGBA values
    let imageData = new ImageData(arr.subarray(0, length), width, height);

    canvas.width = width;
    canvas.height = height;
    canvas.style.transform = `scale(${scale})`
    canvas.style.border = `calc(1px / ${scale}) solid white`

    canvas.addEventListener("mousemove", (event) => {
      const bounding = canvas.getBoundingClientRect();
      const x = ~~((event.clientX - bounding.left) / scale);
      const y = ~~((event.clientY - bounding.top) / scale);
      const index = 4 * (y * width + x);
      blockStamp(index, 233, 80, 199);
    });

    const raf = () => {
      step()
      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(raf);
    }

    raf()

  },
);
