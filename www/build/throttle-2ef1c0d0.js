const throttle = (fn, delay) => {
    let lastFunc;
    let lastRan;
    return (...args) => {
        if (!lastRan) {
            fn(...args);
            lastRan = Date.now();
        }
        else {
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

export { throttle as t };

//# sourceMappingURL=throttle-2ef1c0d0.js.map