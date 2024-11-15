const SplitText = (translateText: string): string[] => {
  const wordsArray = translateText.trim().split(/,|、|，/);
  return wordsArray;
};

export default SplitText;
