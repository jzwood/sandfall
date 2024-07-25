const url = "/sandfall.wasm";

WebAssembly.instantiateStreaming(fetch(url), { console }).then(
  (obj) => {
    const [width, height, scale] = [300, 200, 3];
    const { memory, init, step, stamp, block_stamp: blockStamp } =
      obj.instance.exports;

    init(width, height);
    const length = width * height * 4;

    const arr = new Uint8ClampedArray(memory.buffer);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    let imageData = new ImageData(arr.subarray(0, length), width, height);

    canvas.width = width;
    canvas.height = height;
    canvas.style.transform = `scale(${scale})`;
    canvas.style.border = `calc(1px / ${scale}) solid white`;

    const rgb = [0, 0, 0];
    const mouse = [-1, -1];
    const cancel = () => {
      mouse[0] = -1;
      mouse[1] = -1;
    }

    canvas.addEventListener("mousemove", (event) => {
      const bounding = canvas.getBoundingClientRect();
      const x = ~~((event.clientX - bounding.left) / scale);
      const y = ~~((event.clientY - bounding.top) / scale);
      mouse[0] = x;
      mouse[1] = y;
    });

    canvas.addEventListener("mouseleave", cancel)

    const twiddle = (x, delta = 15) => {
      const dx = Math.floor(Math.random() * delta - (0.5 * delta));
      return (x + dx + 256) % 256;
    };

    const raf = () => {
      const [r, g, b] = rgb;
      // slightly shift color
      rgb[0] = twiddle(r);
      rgb[1] = twiddle(g);
      rgb[2] = twiddle(b);

      // draw block of pixels
      const [x, y] = mouse;
      if (x > 0 && y > 0) {
        blockStamp(x, y, r, g, b);
      }

      // timestep
      step();
      ctx.putImageData(imageData, 0, 0);

      requestAnimationFrame(raf);
    };

    raf();
  },
);
