import { useRef, useEffect } from 'react'
import 'plotly.js/dist/plotly.min.js'

const Plotly = (window as any).Plotly

interface IntensityChartProps {
  wavenumbers: number[]
  originalIntensity: number[]
}

const layout = {
  title: 'Intensity Spectrum |chi|^2',
  xaxis: { title: 'Wavenumber (cm<sup>-1</sup>)' },
  yaxis: { title: '|chi|^2' },
  hovermode: 'x',
  margin: { l: 60, r: 20, t: 40, b: 50 },
  legend: { x: 0.01, y: 0.99, xanchor: 'left', yanchor: 'top' },
  font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
}

const config = {
  displayModeBar: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  displaylogo: false,
  toImageButtonOptions: { format: 'png', filename: 'intensity_spectrum' },
  scrollZoom: true,
}

export default function IntensityChart({
  wavenumbers,
  originalIntensity,
}: IntensityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || wavenumbers.length === 0) return

    function safeValues(arr: number[]): number[] {
      return arr.map((v) => (Number.isFinite(v) ? v : 0))
    }

    const safeWavenumbers = safeValues(wavenumbers)
    const safeOriginal = safeValues(originalIntensity)

    Plotly.newPlot(containerRef.current, [
      {
        x: safeWavenumbers,
        y: safeOriginal,
        type: 'scatter',
        mode: 'lines',
        name: 'Original |chi|^2',
        line: { color: '#1677ff', width: 1.5 },
      },
    ], layout, config)

    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current)
      }
    }
  }, [wavenumbers, originalIntensity])

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
