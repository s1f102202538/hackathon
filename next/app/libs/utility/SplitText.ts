const SplitText = (translateText: string): string[] => {
  return translateText.split(/,|、|，/);
};

export default SplitText;
