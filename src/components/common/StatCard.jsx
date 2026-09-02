import React from 'react';
import { Card, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export const StatCard = ({
  title,
  value,
  icon,
  iconBg = '#f0fdfa',
  iconColor = '#0d9488',
  trend,
  trendLabel = 'vs last week',
  prefix,
  suffix,
}) => {
  const isPositive = trend > 0;

  return (
    <Card
      style={{
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        height: '100%',
      }}
      styles={{ body: { padding: 20 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
            {title}
          </Text>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {prefix && <span style={{ fontSize: 18, color: '#64748b' }}>{prefix}</span>}
            <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
              {value}
            </Title>
            {suffix && <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{suffix}</span>}
          </div>
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <Space orientation="horizontal" size={4} style={{ color: isPositive ? '#10b981' : '#ef4444', fontWeight: 600 }}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{Math.abs(trend)}%</span>
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {trendLabel}
          </Text>
        </div>
      )}
    </Card>
  );
};
