import { Component, type ReactNode } from 'react'
import { Alert, Button } from 'antd'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Alert
            type="error"
            message="Something went wrong"
            description={this.state.error?.message || 'Unknown error'}
            showIcon
            style={{ maxWidth: 600, margin: '0 auto' }}
            action={
              <Button
                size="small"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
              >
                Reload Page
              </Button>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
