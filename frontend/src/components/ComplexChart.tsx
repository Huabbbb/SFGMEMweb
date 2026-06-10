import { useRef, useEffect } from 'react'
import 'plotly.js/dist/plotly.min.js'

const Plotly = (window as any).Plotly

interface ComplexChartProps {
  wavenumbers: number[]
  realPart: number[]
  imagPart: number[]
}

const layout = {
  title: 'Complex Susceptibility chi(omega)',
  xaxis: { title: 'Wavenumber (cm<sup>-1</sup>)' },
  yaxis: { title: 'chi' },
  hovermode: 'x',
  margin: { l: 60, r: 20, t: 40, b: 50 },
  legend: { x: 0.01, y: 0.99, xanchor: 'left', yanchor: 'top' },
  font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
}

const config = {
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  displaylogo: false,
  toImageButtonOptions: { format: 'png', filename: 'complex_spectrum' },
  scrollZoom: true,
}

const ComplexChart: React.FC<ComplexChartProps> = ({
  wavenumbers,
  realPart,
  imagPart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || wavenumbers.length === 0) return

    function safeValues(arr: number[]): number[] {
      return arr.map((v) => (Number.isFinite(v) ? v : 0))
    }

    const safeWavenumbers = safeValues(wavenumbers)
    const safeReal = safeValues(realPart)
    const safeImag = safeValues(imagPart)

    Plotly.newPlot(containerRef.current, [
      {
        x: safeWavenumbers,
        y: safeReal,
        type: 'scatter',
        mode: 'lines',
        name: 'Re[chi]',
        line: { color: '#e74c3c', width: 2 },
      },
      {
        x: safeWavenumbers,
        y: safeImag,
        type: 'scatter',
        mode: 'lines',
        name: 'Im[chi]',
        line: { color: '#3498db', width: 2 },
      },
    ], layout, config)

    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current)
      }
    }
  }, [wavenumbers, realPart, imagPart])

  if (wavenumbers.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 16,
        }}
      >
        No data
      </div>
    )
  }

  return <div ref={containerRef} style={{ width: '100%', minHeight: 400 }} />
}

export default ComplexChart
