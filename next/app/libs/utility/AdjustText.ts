const AdjustText = (text: string) => {
  return text
    .replace(/"|'|’|”/g, '')
    .trim()
    .toLowerCase();
};

export default AdjustText;
