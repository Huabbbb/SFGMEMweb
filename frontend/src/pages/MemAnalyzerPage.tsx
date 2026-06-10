import { Layout, Typography, Row, Col, Empty, Spin } from 'antd'
import { useMemResult } from '../hooks/useMemResult'
import ErrorBoundary from '../components/ErrorBoundary'
import UploadPanel from '../components/UploadPanel'
import IntensityChart from '../components/IntensityChart'
import ComplexChart from '../components/ComplexChart'
import PhaseControl from '../components/PhaseControl'

const { Content, Footer } = Layout
const { Text } = Typography

function MemAnalyzerPage() {
  const { result, loading, error, phaseAngle, runMem, setPhase, resetPhase } = useMemResult()

  const hasResult = result !== null

  return (
    <>
      <ErrorBoundary>
        <UploadPanel onRun={runMem} loading={loading} error={error} />

        <Spin spinning={loading && !hasResult} style={{ display: 'block', marginTop: 16 }}>
          {hasResult && result ? (
            <>
              <Row gutter={16} style={{ marginTop: 0 }}>
                <Col xs={24} lg={12}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
                    <IntensityChart
                      wavenumbers={result.wavenumbers}
                      originalIntensity={result.original_intensity}
                    />
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
                    <ComplexChart
                      wavenumbers={result.wavenumbers}
                      realPart={result.real_part}
                      imagPart={result.imag_part}
                    />
                  </div>
                </Col>
              </Row>

              <div style={{ marginTop: 16 }}>
                <PhaseControl
                  phaseAngle={phaseAngle}
                  onPhaseChange={setPhase}
                  onReset={resetPhase}
                  wavenumbers={result.wavenumbers}
                  realPart={result.real_part}
                  imagPart={result.imag_part}
                />
              </div>
            </>
          ) : (
            !loading && (
              <div
                style={{
                  padding: 80,
                  textAlign: 'center',
                  background: '#fff',
                  borderRadius: 8,
                }}
              >
                <Empty
                  description="Upload a CSV file and click Run MEM to begin analysis"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )
          )}
        </Spin>
      </ErrorBoundary>

      {hasResult && result && (
        <Footer style={{ textAlign: 'center', padding: '8px 24px', background: '#f0f2f5' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Data points: {result.wavenumbers.length} | NN: {result.nn} | NNout: {result.wavenumbers.length} | Peak: {result.peak_intensity.toExponential(4)}
          </Text>
        </Footer>
      )}
    </>
  )
}

export default MemAnalyzerPage
