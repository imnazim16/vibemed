import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const PageHeader = ({ title, subtitle, extra }) => {
  return (
    <div className="vibemed-page-header">
      <div className="vibemed-page-header-text">
        <Title level={3} className="vibemed-page-header-title" style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle && (
          <Paragraph type="secondary" className="vibemed-page-header-subtitle" style={{ margin: '4px 0 0', marginBottom: 0 }}>
            {subtitle}
          </Paragraph>
        )}
      </div>

      {extra && (
        <div className="vibemed-page-header-actions">
          {Array.isArray(extra) ? (
            <div className="vibemed-actions-wrap">
              {extra.map((item, index) => (
                <div key={item?.key || index} className="vibemed-action-item">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="vibemed-actions-wrap">
              <div className="vibemed-action-item">{extra}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
