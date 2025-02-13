import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
}

const Combobox: React.FC<ComboboxProps> = ({ options, onChange, placeholder = 'Select an option' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [inputValue, setInputValue] = useState('');
    const comboboxRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsOpen(true);
    };

    const handleOptionClick = (option: Option) => {
        setSelectedValue(option.value);
        setInputValue(option.label);
        onChange(option.value);
        setIsOpen(false);
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleOutsideClick = (e: MouseEvent) => {
        if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="combobox-container" ref={comboboxRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <ul className="options-list">
                    {filteredOptions.map(option => (
                        <li key={option.value} onClick={() => handleOptionClick(option)}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Combobox;