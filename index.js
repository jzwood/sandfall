function main() {
  const url = "sandfall.wasm";

  // this is an old version of loading wasm modules; however the new streaming API doesn't work with neocities or github pages
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, { console }))
    .then(
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
        const tutorial = document.getElementById("tutorial");
        const ctx = canvas.getContext("2d", { alpha: true });

        const imageData = new ImageData(arr.subarray(0, length), width, height);

        canvas.width = width;
        canvas.height = height;
        canvas.style.transform = `scale(${scale})`;

        const rgb = [0, 0, 0];
        const cursors = [];
        const cancel = () => {
          cursors.length = 0;
        };

        const move = (event, xys) => {
          tutorial.remove();
          const bounding = canvas.getBoundingClientRect();
          cursors.length = 0;
          cursors.push(...xys.map(([clientX, clientY]) => [
            clamp(~~((clientX - bounding.left) / scale), 0, width),
            clamp(~~((clientY - bounding.top) / scale), 0, height),
          ]));
        };

        canvas.addEventListener("mousemove", (event) => {
          const clientX = event.clientX;
          const clientY = event.clientY;
          move(event, [[clientX, clientY]]);
        });
        canvas.addEventListener("touchmove", (event) => {
          move(
            event,
            Array.from(event.touches).map((e) => [e.clientX, e.clientY]),
          );
        });

        canvas.addEventListener("touchcancel", cancel);
        canvas.addEventListener("touchend", cancel);
        canvas.addEventListener("mouseleave", cancel);
        canvas.classList.remove("loading");

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
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  main();
  const reload = debounce(() => {
    location.reload();
  }, 500);
  window.addEventListener("resize", reload);
});
