const SplitText = (translateText: string): string[] => {
  const wordsArray = translateText.replace(/\s+/g, '').split(/,|、|，/);
  return wordsArray;
};

export default SplitText;
