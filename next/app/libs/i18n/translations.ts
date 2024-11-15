export type Translations = {
  [key: string]: {
    selectedLanguage: string;
    defaultInputText: string;
    inputPlaceholder: string;
    // 他に必要なテキストを追加
  };
};

export const translations: Translations = {
  'en-US': {
    selectedLanguage: 'Selected language: English (US)',
    defaultInputText: 'Where is the Hachikoumae?',
    inputPlaceholder: 'Enter text here...',
  },
  'en-GB': {
    selectedLanguage: 'Selected language: English (GB)',
    defaultInputText: 'Where is the Hachikoumae?',
    inputPlaceholder: 'Enter text here...',
  },
  'ja-JP': {
    selectedLanguage: '選択された言語: 日本語',
    defaultInputText: 'ハチ公前はどこですか？',
    inputPlaceholder: 'テキストを入力してください...',
  },
  'fr-FR': {
    selectedLanguage: 'Langue sélectionnée: Français',
    defaultInputText: 'Où est Hachikoumae?',
    inputPlaceholder: 'Entrez le texte ici...',
  },
  'de-DE': {
    selectedLanguage: 'Ausgewählte Sprache: Deutsch',
    defaultInputText: 'Wo ist der Hachikoumae?',
    inputPlaceholder: 'Text hier eingeben...',
  },
  'es-ES': {
    selectedLanguage: 'Idioma seleccionado: Español',
    defaultInputText: '¿Dónde está el Hachikoumae?',
    inputPlaceholder: 'Ingrese el texto aquí...',
  },
  'zh-CN': {
    selectedLanguage: '选择的语言: 中文（简体）',
    defaultInputText: '涉谷站在哪里？',
    inputPlaceholder: '在这里输入文本...',
  },
  'ko-KR': {
    selectedLanguage: '선택한 언어: 한국어',
    defaultInputText: '하치코우마에가 어디에 있나요?',
    inputPlaceholder: '여기에 텍스트를 입력하세요...',
  },
  'it-IT': {
    selectedLanguage: 'Lingua selezionata: Italiano',
    defaultInputText: 'Dove si trova Hachikoumae?',
    inputPlaceholder: 'Inserisci il testo qui...',
  },
  'ru-RU': {
    selectedLanguage: 'Выбранный язык: Русский',
    defaultInputText: 'Где находится Хатико-маэ?',
    inputPlaceholder: 'Введите текст здесь...',
  },
};
