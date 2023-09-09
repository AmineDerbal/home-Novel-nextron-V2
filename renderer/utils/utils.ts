const testUrl = (url: string) => {
  const urlRegex = /^(https?:\/\/www\.scribblehub\.com\/(read|series)\/(\w|\W))/;
  return urlRegex.test(url);
};

export default testUrl;
