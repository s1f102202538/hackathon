const SplitText = (translateText: string): string[] => {
  return translateText.replace(/[.。]/g, '').split(/,|、|，/);
};

export default SplitText;
