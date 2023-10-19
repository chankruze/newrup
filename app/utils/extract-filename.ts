export const extractFileNameFromUrl = (url: string) => {
  if (url) {
    const urlComponents = url.split("/");
    const fileName = urlComponents[urlComponents.length - 1];
    return fileName;
  }

  return url;
};
