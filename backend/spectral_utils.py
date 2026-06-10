import numpy as np
import pandas as pd
from io import BytesIO


def parse_csv_file(file_content: bytes) -> tuple:
    try:
        df = pd.read_csv(BytesIO(file_content))
    except Exception:
        raise ValueError("Unable to parse file as CSV")

    has_header = True
    try:
        float(df.columns[0])
        has_header = False
    except (ValueError, TypeError):
        has_header = True

    columns_info = []
    if has_header:
        for i, col in enumerate(df.columns):
            columns_info.append({"index": i, "name": str(col)})
    else:
        for i in range(df.shape[1]):
            columns_info.append({"index": i, "name": f"Column {i + 1}"})

    freq_col = df.columns[0]
    df[freq_col] = pd.to_numeric(df[freq_col], errors="coerce")
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna()
    df = df.sort_values(freq_col, ascending=True)
    df = df.astype(float)

    wavenumbers = df.iloc[:, 0].values.astype(np.float64)
    return wavenumbers, df.values.astype(np.float64), columns_info


def get_intensity_column(data: np.ndarray, column_index: int = 1) -> np.ndarray:
    intensities = data[:, column_index].copy()
    intensities = np.where(intensities <= 0, 1e-9, intensities)
    return intensities


def apply_phase_rotation(real_part: np.ndarray, imag_part: np.ndarray, phase_angle: float) -> tuple:
    chi = real_part + 1j * imag_part
    chi_rotated = chi * np.exp(1j * phase_angle)
    return np.real(chi_rotated).tolist(), np.imag(chi_rotated).tolist()


def format_export_csv(wavenumbers: np.ndarray, real_part: np.ndarray, imag_part: np.ndarray) -> str:
    lines = ["Wavenumber,Re_Chi,Im_Chi"]
    for w, r, i in zip(wavenumbers, real_part, imag_part):
        lines.append(f"{w:.6f},{r:.8e},{i:.8e}")
    return "\n".join(lines)
