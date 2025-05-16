import React from 'react';
import { Select } from 'antd';
import type { Country } from './CountrySelectorButton';

const { Option } = Select;

interface CountryDropdownProps {
  value?: string; // ID negara yang dipilih
  onChange: (countryId: string) => void; // Handler untuk perubahan pilihan
  type: 'origin' | 'destination'; // Jenis selector (asal atau tujuan)
  placeholder?: string;
  loading?: boolean;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  value,
  onChange,
  type,
  placeholder = 'Select a country',
  loading = false,
}) => {
  // Dummy data - ganti dengan data API asli nanti
  const countries: Country[] = [
    {
      id: 'id',
      name: 'Indonesia',
      code: 'ID',
      flagUrl: 'https://flagcdn.com/w80/id.png',
    },
    {
      id: 'my',
      name: 'Malaysia',
      code: 'MY',
      flagUrl: 'https://flagcdn.com/w80/my.png',
    },
    {
      id: 'sg',
      name: 'Singapore',
      code: 'SG',
      flagUrl: 'https://flagcdn.com/w80/sg.png',
    },
    {
      id: 'jp',
      name: 'Japan',
      code: 'JP',
      flagUrl: 'https://flagcdn.com/w80/jp.png',
    },
    {
      id: 'kr',
      name: 'South Korea',
      code: 'KR',
      flagUrl: 'https://flagcdn.com/w80/kr.png',
    },
    {
      id: 'de',
      name: 'Germany',
      code: 'DE',
      flagUrl: 'https://flagcdn.com/w80/de.png',
    },
    {
      id: 'us',
      name: 'United States',
      code: 'US',
      flagUrl: 'https://flagcdn.com/w80/us.png',
    },
    {
      id: 'cn',
      name: 'China',
      code: 'CN',
      flagUrl: 'https://flagcdn.com/w80/cn.png',
    },
    {
      id: 'au',
      name: 'Australia',
      code: 'AU',
      flagUrl: 'https://flagcdn.com/w80/au.png',
    },
    {
      id: 'ca',
      name: 'Canada',
      code: 'CA',
      flagUrl: 'https://flagcdn.com/w80/ca.png',
    },
  ];

  // Styling berdasarkan tipe (origin/destination)
  const borderColor = type === 'origin' ? '#1890ff' : '#4CAF50';

  return (
    <>
      <Select
        showSearch
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        loading={loading}
        style={{
          width: '100%',
          marginBottom: 16,
        }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        dropdownMatchSelectWidth={false}
        className={
          type === 'origin' ? 'origin-dropdown' : 'destination-dropdown'
        }
      >
        {countries.map((country) => (
          <Option key={country.id} value={country.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={country.flagUrl}
                alt={country.code}
                style={{
                  width: 20,
                  height: 'auto',
                  marginRight: 8,
                  border: '1px solid #f0f0f0',
                }}
              />
              <span>{country.name}</span>
            </div>
          </Option>
        ))}
      </Select>

      {/* Styling berbeda untuk origin dan destination */}
      <style>
        {`
          .origin-dropdown .ant-select-selector {
            border-color: #1890ff !important;
          }
          .origin-dropdown.ant-select-focused .ant-select-selector {
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
          }
          
          .destination-dropdown .ant-select-selector {
            border-color: #4CAF50 !important;
          }
          .destination-dropdown.ant-select-focused .ant-select-selector {
            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2) !important;
          }
        `}
      </style>
    </>
  );
};

export default CountryDropdown;
