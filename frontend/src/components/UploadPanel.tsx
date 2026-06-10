import { useState, useRef } from 'react'
import { Upload, Button, InputNumber, Select, Typography, Alert, message, Row, Col, Card } from 'antd'
import { InboxOutlined, PlayCircleOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import type { ColumnInfo } from '../types/mem'

const { Text } = Typography

interface UploadPanelProps {
  onRun: (file: File, nn: number | undefined, nNout: number | undefined, column: number) => void
  loading: boolean
  error: string | null
}

function UploadPanel({ onRun, loading, error }: UploadPanelProps) {
  const fileRef = useRef<File | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [columns, setColumns] = useState<ColumnInfo[]>([])
  const [selectedColumn, setSelectedColumn] = useState<number>(1)
  const [nn, setNn] = useState<number | null>(null)
  const [nNout, setNNout] = useState<number | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleBeforeUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const firstLine = text.split('\n')[0]?.trim()
      if (!firstLine) {
        message.warning('File is empty or unreadable')
        return
      }
      const tokens = firstLine.split(',')
      const isHeader = isNaN(Number(tokens[0].trim()))
      const cols: ColumnInfo[] = tokens.map((token, i) => ({
        index: i,
        name: isHeader ? token.trim() : `Column ${i + 1}`,
      }))
      setColumns(cols)
      setSelectedColumn(1)
      message.success(`Parsed ${cols.length} columns${isHeader ? ' (with header)' : ''}`)
    }
    reader.readAsText(file)
    fileRef.current = file
    setFileName(file.name)
    setFileList([{ uid: '-1', name: file.name, status: 'done' } as UploadFile])
    return false
  }

  const handleRemove = () => {
    fileRef.current = null
    setColumns([])
    setFileList([])
    setFileName('')
  }

  const handleRun = () => {
    if (!fileRef.current) {
      message.warning('Please upload a CSV file first')
      return
    }
    onRun(fileRef.current, nn ?? undefined, nNout ?? undefined, selectedColumn)
  }

  const hasFile = fileRef.current !== null

  return (
    <Card title="Data Setup" size="small">
      {error && <Alert type="error" message={error} closable showIcon style={{ marginBottom: 12 }} />}
      <Row gutter={[16, 12]} align="middle">
        <Col xs={24} sm={24} md={10} lg={10}>
          <Upload
            accept=".csv"
            maxCount={1}
            fileList={fileList}
            beforeUpload={handleBeforeUpload}
            onRemove={handleRemove}
            showUploadList={{ showPreviewIcon: false }}
          >
            <Button icon={<InboxOutlined />} disabled={loading}>
              {fileName || 'Select CSV File...'}
            </Button>
          </Upload>
        </Col>

        <Col xs={24} sm={12} md={5} lg={4}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
            <Text type="secondary">Column:</Text>
            <Select
              value={selectedColumn}
              onChange={(v) => setSelectedColumn(v)}
              style={{ width: 140 }}
              options={columns.map((col) => ({
                value: col.index,
                label: `${col.index}: ${col.name}`,
              }))}
              disabled={columns.length === 0}
              size="small"
            />
          </span>
        </Col>

        <Col xs={24} sm={12} md={5} lg={3}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
            <Text type="secondary">NN:</Text>
            <InputNumber
              min={2}
              max={9999}
              size="small"
              placeholder="auto"
              value={nn}
              onChange={(v) => setNn(v)}
              style={{ width: 80 }}
            />
          </span>
        </Col>

        <Col xs={24} sm={12} md={5} lg={3}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
            <Text type="secondary">NNout:</Text>
            <InputNumber
              min={2}
              max={99999}
              size="small"
              placeholder="auto"
              value={nNout}
              onChange={(v) => setNNout(v)}
              style={{ width: 80 }}
            />
          </span>
        </Col>

        <Col xs={24} sm={12} md={9} lg={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={loading}
            disabled={loading || !hasFile}
            onClick={handleRun}
          >
            Run MEM
          </Button>
        </Col>
      </Row>
      {columns.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {fileName} — {columns.length} columns
          </Text>
        </div>
      )}
    </Card>
  )
}

export default UploadPanel
