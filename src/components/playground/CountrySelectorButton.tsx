import React from 'react';
import { Button } from 'antd';
import { EnvironmentOutlined, EnvironmentFilled } from '@ant-design/icons';

export interface Country {
  id: string;
  name: string;
  code: string;
  flagUrl: string;
}

interface CountrySelectorButtonProps {
  country?: Country; // Menyimpan data negara yang dipilih
  type: 'origin' | 'destination'; // Jenis selector (asal atau tujuan)
  onClick: () => void; // Function untuk handling modal open
  loading?: boolean;
}

const CountrySelectorButton: React.FC<CountrySelectorButtonProps> = ({
  country,
  type,
  onClick,
  loading,
}) => {
  // Ubah warna dan text berdasarkan tipe (origin/destination)
  const buttonStyle = {
    marginBottom: '16px',
    textAlign: 'left' as const,
    display: 'flex',
    alignItems: 'center',
    borderColor: type === 'origin' ? '#1890ff' : '#4CAF50',
  };

  return (
    <Button
      icon={type === 'origin' ? <EnvironmentOutlined /> : <EnvironmentFilled />}
      onClick={onClick}
      loading={loading}
      block
      type={country ? 'default' : 'dashed'}
      style={buttonStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {country && (
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
        )}
        <span>
          {country
            ? `${type === 'origin' ? 'Origin' : 'Destination'}: ${country.name}`
            : `Select ${type === 'origin' ? 'Origin' : 'Destination'} Country`}
        </span>
      </div>
    </Button>
  );
};

export default CountrySelectorButton;
