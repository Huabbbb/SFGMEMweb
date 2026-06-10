import { Slider, InputNumber, Button, Space, Card, Row, Col, Typography } from 'antd'
import { UndoOutlined } from '@ant-design/icons'
import ExportButton from './ExportButton'

const { Text } = Typography

interface PhaseControlProps {
  phaseAngle: number
  onPhaseChange: (angle: number) => void
  onReset: () => void
  wavenumbers: number[]
  realPart: number[]
  imagPart: number[]
}

const marks: Record<number, string> = {
  0: '0',
  1.57: 'pi/2',
  3.14: 'pi',
  4.71: '3pi/2',
  6.28: '2pi',
}

const PhaseControl: React.FC<PhaseControlProps> = ({
  phaseAngle,
  onPhaseChange,
  onReset,
  wavenumbers,
  realPart,
  imagPart,
}) => {
  return (
    <Card
      title="Error Phase Adjustment"
      size="small"
      extra={
        <ExportButton
          wavenumbers={wavenumbers}
          realPart={realPart}
          imagPart={imagPart}
        />
      }
    >
      <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
        Drag slider or enter value to adjust error phase phi (0-2pi).
        The imaginary part should approach zero in non-resonant regions for the physically correct solution.
      </Text>
      <Row gutter={16} align="middle">
        <Col flex="auto">
          <Slider
            min={0}
            max={2 * Math.PI}
            step={0.01}
            value={phaseAngle}
            onChange={(value) => onPhaseChange(value as number)}
            marks={marks}
          />
        </Col>
        <Col>
          <Space>
            <Text style={{ whiteSpace: 'nowrap' }}>phi =</Text>
            <InputNumber
              min={0}
              max={2 * Math.PI}
              step={0.01}
              value={phaseAngle}
              precision={4}
              onChange={(value) => {
                if (value !== null) onPhaseChange(value)
              }}
              style={{ width: 100 }}
            />
            <Text style={{ whiteSpace: 'nowrap' }}>rad</Text>
            <Text type="secondary" style={{ whiteSpace: 'nowrap', width: 55 }}>
              {(phaseAngle * 180 / Math.PI).toFixed(1)} deg
            </Text>
            <Button icon={<UndoOutlined />} onClick={onReset} size="small">
              Reset
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default PhaseControl
