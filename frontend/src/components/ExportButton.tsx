import { Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

interface ExportButtonProps {
  wavenumbers: number[]
  realPart: number[]
  imagPart: number[]
}

function exportToCsv(wavenumbers: number[], realPart: number[], imagPart: number[]) {
  const lines: string[] = ['Wavenumber,Re_Chi,Im_Chi']
  for (let i = 0; i < wavenumbers.length; i++) {
    lines.push(`${wavenumbers[i]},${realPart[i]},${imagPart[i]}`)
  }
  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'MEM_Export.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const ExportButton: React.FC<ExportButtonProps> = ({
  wavenumbers,
  realPart,
  imagPart,
}) => {
  const handleExport = () => {
    exportToCsv(wavenumbers, realPart, imagPart)
    message.success('Data exported')
  }

  const hasNoData = wavenumbers.length === 0

  return (
    <Button
      icon={<DownloadOutlined />}
      onClick={handleExport}
      disabled={hasNoData}
    >
      Export CSV
    </Button>
  )
}

export default ExportButton
