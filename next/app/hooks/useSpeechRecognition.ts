import { useState, useEffect } from 'react';

export function useSpeechRecognition(selectedLang: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recognitionInstance = new webkitSpeechRecognition();
      // 要検討
      recognitionInstance.lang = selectedLang;
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      setRecognition(recognitionInstance);
    }
  }, [selectedLang]);

  useEffect(() => {
    if (!recognition) return;
    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
      setText('');
    }
  }, [isRecording, recognition]);

  useEffect(() => {
    if (!recognition) return;
    recognition.onresult = (event) => {
      const results = event.results;
      for (let i = event.resultIndex; i < results.length; i++) {
        if (results[i].isFinal) {
          setText((prevText) => prevText + results[i][0].transcript);
          setTranscript('');
        } else {
          setTranscript(results[i][0].transcript);
        }
      }
    };
  }, [recognition]);

  return { isRecording, setIsRecording, text, transcript };
}
