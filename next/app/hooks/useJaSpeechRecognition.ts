import { useState, useEffect } from 'react';

export function useJaSpeechRecognition() {
  const [isRecordingJ, setIsRecordingJ] = useState(false);
  const [textJ, setText] = useState<string>('');
  const [transcriptJ, setTranscript] = useState<string>('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recognitionInstance = new webkitSpeechRecognition();
      // 要検討
      recognitionInstance.lang = 'ja-JP';
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (!recognition) return;
    if (isRecordingJ) {
      recognition.start();
    } else {
      recognition.stop();
      setText('');
    }
  }, [isRecordingJ]);

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

  return { isRecordingJ, setIsRecordingJ, textJ, transcriptJ };
}
