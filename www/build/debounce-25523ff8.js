const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

export { debounce as d };

//# sourceMappingURL=debounce-25523ff8.js.map