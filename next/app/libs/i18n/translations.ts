export type Translations = {
  [key: string]: {
    selectedLanguage: string;
    inputPlaceholder: string;
    // 他に必要なテキストを追加
  };
};

export const translations: Translations = {
  'en-US': {
    selectedLanguage: 'Selected language: English (US)',
    inputPlaceholder: 'Enter text here...',
  },
  'en-GB': {
    selectedLanguage: 'Selected language: English (GB)',
    inputPlaceholder: 'Enter text here...',
  },
  'fr-FR': {
    selectedLanguage: 'Langue sélectionnée: Français',
    inputPlaceholder: 'Entrez le texte ici...',
  },
  'de-DE': {
    selectedLanguage: 'Ausgewählte Sprache: Deutsch',
    inputPlaceholder: 'Text hier eingeben...',
  },
  'es-ES': {
    selectedLanguage: 'Idioma seleccionado: Español',
    inputPlaceholder: 'Ingrese el texto aquí...',
  },
  'zh-CN': {
    selectedLanguage: '选择的语言: 中文（简体）',
    inputPlaceholder: '在这里输入文本...',
  },
  'ko-KR': {
    selectedLanguage: '선택한 언어: 한국어',
    inputPlaceholder: '여기에 텍스트를 입력하세요...',
  },
  'it-IT': {
    selectedLanguage: 'Lingua selezionata: Italiano',
    inputPlaceholder: 'Inserisci il testo qui...',
  },
  'ru-RU': {
    selectedLanguage: 'Выбранный язык: Русский',
    inputPlaceholder: 'Введите текст здесь...',
  },
};
