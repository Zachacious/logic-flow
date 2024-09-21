export const nextTick = async (callback: () => void) => {
  await new Promise(resolve => {
    setTimeout(resolve, 0);
  });
  callback();
};
