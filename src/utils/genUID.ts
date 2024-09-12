export const genUID = () => {
  const uint32 = window.crypto.randomUUID();
  return uint32;
};
