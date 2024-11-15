import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import axios from 'axios';

import Select, {
  StylesConfig,
  components,
  OnChangeValue,
  MenuListProps,
  ClearIndicatorProps,
} from 'react-select';

interface OptionType {
  value: string;
  label: string;
}

interface WordStatsSearchProps {
  onSearch: (searchTerm: string) => void;
}

const isMobile = window.innerWidth <= 768; // モバイル用の画面幅の例
const button_pos_right = isMobile ? '8.5%' : '2.5%';
const button_pos_top = isMobile ? '3.5%' : '3.5%';

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

// Custom ClearIndicator componentのスタイルを調整
const CustomClearIndicator = (
  props: ClearIndicatorProps<OptionType, false>
) => {
  return (
    <components.ClearIndicator {...props}>
      <span
        style={{
          padding: '0 50px', // パディングを調整して「X」を左側に寄せる
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

// IndicatorSeparatorをnullに設定して「|」を削除
const IndicatorSeparator = () => null;

const WordStatsSearch: React.FC<WordStatsSearchProps> = ({ onSearch }) => {
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>(''); // Track input value
  const { userId } = useAuth();
  const selectRef = useRef<HTMLDivElement>(null);

  const customStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '50px',
      borderColor: '#CCC',
      minHeight: '40px',
      paddingRight: '7px',
      boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : provided.boxShadow,
      '&:hover': {
        borderColor: '#2684FF',
      },
      position: 'relative',
      zIndex: 1, // Ensure it's below any overlay elements
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
      zIndex: 10, // Increased to ensure dropdown appears above other elements
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
    const uniqueWords = Array.from(new Set(words));
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
    const sanitizedWord = word.replace(/["']/g, '');
    return {
      value: sanitizedWord,
      label: sanitizedWord,
    };
  });

  const handleSubmit = (search: string) => {
    const sanitizedSearch = search.replace(/["']/g, '');
    if (sanitizedSearch) {
      onSearch(sanitizedSearch);
    }
  };

  // Handler for Enter key press
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      handleSubmit(inputValue);
    }
  };

  // Handler for Select component's onChange
  const handleChange = (option: OnChangeValue<OptionType, false>) => {
    if (option) {
      const sanitizedValue = option.value.replace(/["']/g, '');
      setSearchTerm(sanitizedValue);
      setInputValue(sanitizedValue); // Update input value as well
      handleSubmit(sanitizedValue);
    } else {
      setSearchTerm('');
      setInputValue('');
    }
  };

  // Handler for Select component's onInputChange
  const handleInputChange = (newValue: string) => {
    const sanitizedValue = newValue.replace(/["']/g, '');
    setInputValue(sanitizedValue);
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* ユーザーボタンを固定位置に配置 */}
      <div
        style={{
          position: 'fixed', // 固定位置
          zIndex: '10000000', // マップよりも前面に表示
          top: button_pos_top,
          right: button_pos_right,
        }}
      >
        <UserButton
          userProfileMode="modal"
          afterSignOutUrl="/" // Optional: Redirect after sign out
          // You can pass additional props if needed
        />
      </div>

      {/* 検索バー */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(searchTerm);
        }}
        style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }} // 中央寄せなど調整
      >
        <div style={{ width: '100%', position: 'relative' }} ref={selectRef}>
          <Select
            options={options}
            placeholder="単語を検索..."
            isClearable
            styles={customStyles}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            inputValue={inputValue}
            components={{
              MenuList: CustomMenuList,
              ClearIndicator: CustomClearIndicator, // Use custom ClearIndicator
              DropdownIndicator: () => null, // Hide dropdown arrow
              IndicatorSeparator: IndicatorSeparator, // Remove the separator
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default WordStatsSearch;
