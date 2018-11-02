// 去抖
export const shake = (handler, delay) => {
  let timer = null;
  return (...rest) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handler(...rest);
    }, delay);
  };
};
