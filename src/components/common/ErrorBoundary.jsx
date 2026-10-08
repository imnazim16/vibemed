import React from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('VibeMed ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: '#f8fafc',
          }}
        >
          <Result
            status="error"
            title="Something went wrong in this section"
            subTitle={
              this.state.error?.message ||
              'An unexpected error occurred while rendering this page.'
            }
            extra={[
              <Button
                key="retry"
                type="primary"
                icon={<ReloadOutlined />}
                style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
                onClick={this.handleReset}
              >
                Reload Page
              </Button>,
              <Button
                key="home"
                icon={<HomeOutlined />}
                style={{ borderRadius: 8 }}
                onClick={this.handleGoHome}
              >
                Go to Dashboard
              </Button>,
            ]}
          >
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre
                style={{
                  background: '#f1f5f9',
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 11,
                  textAlign: 'left',
                  maxHeight: 200,
                  overflow: 'auto',
                  color: '#dc2626',
                }}
              >
                {this.state.error.stack}
              </pre>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
