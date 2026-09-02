import React from 'react';
import { Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

export const PageHeader = ({ title, subtitle, extra }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
          {title}
        </Title>
        {subtitle && (
          <Paragraph type="secondary" style={{ margin: '4px 0 0', fontSize: 14 }}>
            {subtitle}
          </Paragraph>
        )}
      </div>

      {extra && <Space size="middle">{extra}</Space>}
    </div>
  );
};
