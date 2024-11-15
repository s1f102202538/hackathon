import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import Select, { StylesConfig, components, OnChangeValue, MenuListProps } from 'react-select';

interface OptionType {
  value: string;
  label: string;
}

interface WordStatsSearchProps {
  onSearch: (searchTerm: string) => void;
}

const CustomMenuList = (props: MenuListProps<OptionType, false>) => {
  return (
    <components.MenuList {...props}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {(Array.isArray(props.children) ? props.children : [props.children]).map(
          (child: React.ReactNode, index: number) => (
            <div
              key={index}
              style={{ width: '50%', boxSizing: 'border-box', padding: '5px' }}
            >
              {child}
            </div>
          )
        )}
      </div>
    </components.MenuList>
  );
};

const WordStatsSearch: React.FC<WordStatsSearchProps> = ({ onSearch }) => {
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>(''); // 入力値を追跡
  const { userId } = useAuth();
  const selectRef = useRef<HTMLDivElement>(null);

  const customStyles: StylesConfig<OptionType, false> = {
    control: (provided) => ({
      ...provided,
      borderRadius: '50px',
      borderColor: '#CCC',
      minHeight: '40px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      marginTop: '0px',
      padding: '0px',
      maxHeight: '250px',
      overflowY: 'auto',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0px',
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '10px 15px',
      borderBottom: '1px solid #EEE',
      cursor: 'pointer',
      backgroundColor: state.isFocused ? '#F0F8FF' : '#FFF',
      color: '#333',
      ':active': {
        backgroundColor: '#F0F8FF',
      },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: '12px',
      wordBreak: 'break-word',
    }),
  };

  const fetchWords = async () => {
    try {
      const response = await axios.post('/api/words-location/get-list', {
        clientId: userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching words location:', error);
      return null;
    }
  };

  const getRandomWords = (words: string[], count: number): string[] => {
    const uniqueWords = Array.from(new Set(words)); // 重複を排除
    console.log(uniqueWords);
    if (uniqueWords.length <= count) {
      return uniqueWords;
    }

    const shuffled = [...uniqueWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  };
  useEffect(() => {
    const getWordsData = async () => {
      const data = await fetchWords();
      if (data && data.wordsLocationList) {
        const allWords = data.wordsLocationList.flatMap(
          (location: {
            lat: number;
            lon: number;
            words: { userLang: string }[];
          }) => location.words.map((word) => word.userLang)
        );

        const selectedWords = getRandomWords(allWords, 10);
        setRandomWords(selectedWords);
      }
    };

    if (userId) {
      getWordsData();
    }
  }, [userId]);

  const options: OptionType[] = randomWords.map((word) => {
    // シングルクオーテーションとダブルクオーテーションを削除
    const sanitizedWord = word.replace(/["']/g, '');
    return {
      value: sanitizedWord,
      label: sanitizedWord,
    };
  });

  const handleSubmit = (search: string) => {
    // シングルクオーテーションとダブルクオーテーションを削除
    const sanitizedSearch = search.replace(/["']/g, '');
    if (sanitizedSearch) {
      onSearch(sanitizedSearch);
    }
  };

  // Enterキー押下時のハンドラー
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // フォームのデフォルト送信を防止
      handleSubmit(inputValue);
    }
  };

  // `Select` コンポーネントのonChangeハンドラー
  const handleChange = (option: OnChangeValue<OptionType, false>) => {
    if (option) {
      // シングルクオーテーションとダブルクオーテーションを削除
      const sanitizedValue = option.value.replace(/["']/g, '');
      setSearchTerm(sanitizedValue);
      setInputValue(sanitizedValue); // 入力値も更新
      handleSubmit(sanitizedValue);
    } else {
      setSearchTerm('');
      setInputValue('');
      // 必要に応じてクリア時の処理を追加
    }
  };

  // `Select` コンポーネントのonInputChangeハンドラー
  const handleInputChange = (newValue: string) => {
    // シングルクオーテーションとダブルクオーテーションを削除
    const sanitizedValue = newValue.replace(/["']/g, '');
    setInputValue(sanitizedValue);
  };

  return (
    <div style={{ padding: '20px' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(searchTerm);
        }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div style={{ width: '100%', position: 'relative', zIndex: '1' }} ref={selectRef}>
          <Select
            options={options}
            placeholder="単語を検索..."
            isClearable
            styles={customStyles}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown} // Enterキー押下をキャッチ
            inputValue={inputValue}
            components={{
              MenuList: CustomMenuList,
              DropdownIndicator: () => null, // ドロップダウン矢印を非表示にする
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default WordStatsSearch;
