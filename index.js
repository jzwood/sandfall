const url = "sandfall.wasm";

WebAssembly.instantiateStreaming(fetch(url), { console }).then(
  (obj) => {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const scale = 4;
    const width = Math.floor(vw / scale);
    const height = Math.floor(vh / scale);

    const { memory, init, step, stamp, block_stamp: blockStamp } =
      obj.instance.exports;

    init(width, height);
    const length = width * height * 4; // 4 bytes in 32 bit int

    const arr = new Uint8ClampedArray(memory.buffer);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    let imageData = new ImageData(arr.subarray(0, length), width, height);

    canvas.width = width;
    canvas.height = height;
    canvas.style.transform = `scale(${scale})`;

    const rgb = [0, 0, 0];
    const cursors = [];
    const cancel = () => {
      cursors.length = 0;
    };

    const move = (event, xys) => {
      const bounding = canvas.getBoundingClientRect();
      cursors.length = 0;
      cursors.push(...xys.map(([clientX, clientY]) => [
        Math.min(width, ~~((clientX - bounding.left) / scale)),
        Math.min(height, ~~((clientY - bounding.top) / scale)),
      ]));
    };

    canvas.addEventListener("mousemove", (event) => {
      const clientX = event.clientX;
      const clientY = event.clientY;
      move(event, [[clientX, clientY]]);
    });
    canvas.addEventListener("touchmove", (event) => {
      move(event, Array.from(event.touches).map((e) => [e.clientX, e.clientY]));
    });

    canvas.addEventListener("touchcancel", cancel);
    canvas.addEventListener("touchend", cancel);
    canvas.addEventListener("mouseleave", cancel);
    canvas.classList.remove("loading")

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
      cursors.forEach(([x, y]) => {
        blockStamp(x, y, r, g, b);
      });

      // time step
      step();
      ctx.putImageData(imageData, 0, 0);

      requestAnimationFrame(raf);
    };

    raf();
  },
);

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const reload = debounce(() => {
  window.location.reload();
}, 500);

window.addEventListener("resize", reload);
