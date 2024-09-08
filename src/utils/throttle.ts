export const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  return (...args: any[]) => {
    if (!lastRan) {
      fn(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= delay) {
          fn(...args);
          lastRan = Date.now();
        }
      }, delay - (Date.now() - lastRan));
    }
  };
};
