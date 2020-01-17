import { Vector2 } from 'three';
import { clamp } from './util';

export function makeRenderScale(timePerFrame = 20) {
  let size = new Vector2(1, 1);
  let scale = new Vector2(1, 1);
  let maxSize = new Vector2(1, 1);

  let pixelsPerFrame = 0;

  let lastTime = 0;

  function reset() {
    lastTime = 0;
  }

  function calcSize() {
    const aspectRatio = maxSize.x / maxSize.y;
    size.x = Math.round(clamp(Math.sqrt(pixelsPerFrame * aspectRatio), 1, maxSize.x));
    size.y = Math.round(clamp(size.x / aspectRatio, 1, maxSize.y));
    scale.set(size.x / maxSize.x, size.y / maxSize.y);
  }

  function onFinished(time) {
    if (lastTime) {
      const pixelsPerTime = (size.x * size.y) / (time - lastTime);
      const expAvg = 0.5;
      pixelsPerFrame = expAvg * pixelsPerFrame + (1 - expAvg) * timePerFrame * pixelsPerTime;
    }

    lastTime = time;
  }

  function updatePerf() {
    requestAnimationFrame(onFinished);
    // pixelsPerFrame = 50000;
  }

  function setSize(width, height) {
    maxSize.set(width, height);

    if (pixelsPerFrame === 0) {
      pixelsPerFrame = width * height;
    } else {
      calcSize();
    }
  }

  return {
    calcSize,
    get scale() {
      return scale;
    },
    get size() {
      return size;
    },
    reset,
    setSize,
    updatePerf
  };
}
