import { Layout, Typography, Row, Col, Empty, Spin } from 'antd'
import { useMemResult } from '../hooks/useMemResult'
import ErrorBoundary from '../components/ErrorBoundary'
import UploadPanel from '../components/UploadPanel'
import IntensityChart from '../components/IntensityChart'
import ComplexChart from '../components/ComplexChart'
import PhaseControl from '../components/PhaseControl'

const { Footer } = Layout
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
                      originalWavenumbers={result.original_wavenumbers}
                      originalIntensity={result.original_intensity}
                      memWavenumbers={result.mem_wavenumbers}
                      memInputIntensity={result.mem_input_intensity}
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
                  originalWavenumbers={result.original_wavenumbers}
                  originalIntensity={result.original_intensity}
                  memInputIntensity={result.mem_input_intensity}
                  nOriginal={result.n_original}
                  nMem={result.n_mem}
                  nn={result.nn}
                  originalFrequencyRange={result.original_frequency_range}
                  memFrequencyRange={result.mem_frequency_range}
                  resamplingMethod={result.resampling_method}
                  resamplingNote={result.resampling_note}
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
            N_original: {result.n_original} | N_MEM: {result.n_mem} | NN: {result.nn} | Original range: {result.original_frequency_range[0]} - {result.original_frequency_range[1]} | MEM range: {result.mem_frequency_range[0]} - {result.mem_frequency_range[1]} | {result.resampling_method} | Peak: {result.peak_intensity.toExponential(4)}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            通过插值增加 MEM 计算点数不会增加原始光谱信息。
          </Text>
        </Footer>
      )}
    </>
  )
}

export default MemAnalyzerPage
