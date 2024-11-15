import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import axios from 'axios';
import Select, {
  StylesConfig,
  components,
  OnChangeValue,
  MenuListProps,
  IndicatorsContainerProps,
  ClearIndicatorProps,
} from 'react-select';

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

// カスタム IndicatorsContainer コンポーネントの定義
const CustomIndicatorsContainer = (
  props: IndicatorsContainerProps<OptionType, false>
) => {
  return (
    <components.IndicatorsContainer {...props}>
      {props.children}
      <div
        onMouseDown={(e) => e.stopPropagation()} // イベントの伝播を停止
        style={{
          marginLeft: '5px', // クリアボタンとの間隔を広げる
          marginTop: '1px',   // 少し下に配置
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            height: '30px',
            width: '30px',
            borderRadius: '50%',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '1000',
            overflow: 'hidden', // 円形にするため
            touchAction: 'auto' // タッチイベントを有効にする
          }}
        >
          <UserButton
            userProfileMode="modal"
          />
        </div>
      </div>
    </components.IndicatorsContainer>
  );
};

// カスタム ClearIndicator コンポーネントの定義
const CustomClearIndicator = (
  props: ClearIndicatorProps<OptionType, false>
) => {
  return (
    <components.ClearIndicator {...props}>
      <span
        style={{
          padding: '0 12px', // クリアボタンを少し左にシフト
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: '1',
        }}
      >
        X
      </span>
    </components.ClearIndicator>
  );
};

const WordStatsSearch: React.FC<WordStatsSearchProps> = ({ onSearch }) => {
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>(''); // 入力値を追跡
  const { userId } = useAuth();
  const selectRef = useRef<HTMLDivElement>(null);

  const customStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '50px',
      borderColor: '#CCC',
      minHeight: '40px',
      paddingRight: '7px', // UserButtonとクリアボタンのスペースを増やす
      boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : provided.boxShadow,
      '&:hover': {
        borderColor: '#2684FF',
      },
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
    indicatorsContainer: (provided) => ({
      ...provided,
      // 必要に応じて調整
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
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(searchTerm);
        }}
        style={{ display: 'flex', alignItems: 'center', width: '100%',}}
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
              IndicatorsContainer: CustomIndicatorsContainer, // カスタム IndicatorsContainer を使用
              ClearIndicator: CustomClearIndicator, // カスタム ClearIndicator を使用
              DropdownIndicator: () => null, // ドロップダウン矢印を非表示にする
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default WordStatsSearch;
