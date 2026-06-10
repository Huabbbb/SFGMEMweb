"""
MEMNUM — Maximum Entropy Method (MEM) spectral reconstruction.

Faithful Python port of the Mathematica MEMNUM function from:
    Alex de Beer, Sylvie Roke (EPFL, 2011)
    Laboratory for fundamental BioPhotonics (LBP)
    École Polytechnique Fédérale Lausanne (EPFL)

Reference:
    Yang and Huang, J. Opt. Soc. Am. B, 2000, 17, 1216-1221
    De Beer et al., J. Chem. Phys., 2011, 135, 224701-1-9

The algorithm reconstructs the complex susceptibility χ(ω) from an
intensity-only spectrum |χ(ω)|² using the maximum entropy principle.
"""

import time
import numpy as np
from scipy.linalg import toeplitz, solve


def memnum(spec, NN, NNout):
    """
    Maximum Entropy Method for spectral phase retrieval.

    Steps (matching the Mathematica implementation exactly):
      1. Inverse Fourier Transform of the intensity spectrum
      2. Build unit constraint vector Bt1 = [1, 0, ..., 0]
      3. Build Hermitian Toeplitz autocorrelation matrix Rt1
      4. Solve linear system Rt1 · At1 = Bt1
      5. Normalize prediction-error filter coefficients
      6. Compute complex susceptibility χ(f) via the MEM formula

    Parameters
    ----------
    spec : ndarray of shape (N,)
        Input intensity spectrum. All values must be strictly positive.
        Non-positive values should be filtered before calling this function.
    NN : int
        Number of time-domain points (filter order).
        Typically NN = min(1024, N // 2).
    NNout : int
        Number of output frequency points.
        Typically NNout = N (the length of the input spectrum).

    Returns
    -------
    SS : ndarray of shape (NNout,)
        Reconstructed intensity spectrum |χ(ω)|².
    chiT : ndarray of shape (NNout,), dtype complex
        Complex susceptibility χ(ω). The absolute phase is not yet
        calibrated — use error phase rotation after this function.
    Ft1 : ndarray of shape (NN,), dtype complex
        Time-domain data from inverse FFT (first NN points).
    ASt1 : ndarray of shape (NN,), dtype complex
        Normalized MEM prediction-error filter coefficients.
    """
    N = len(spec)

    # Step 1: Inverse Fourier Transform
    #
    # Mathematica InverseFourier with default FourierParameters->{0,1}:
    #   (1/√n) · Σ Fₛ · exp(-2πi · (r-1)(s-1)/n)      NEGATIVE exponent
    #
    # NumPy fft with norm='ortho':
    #   (1/√n) · Σ aₖ · exp(-2πi · k · m / n)           NEGATIVE exponent → MATCH
    #
    # NumPy ifft with norm='ortho':
    #   (1/√n) · Σ aₖ · exp(+2πi · k · m / n)           POSITIVE exponent → WRONG
    print("Starting InverseFourier (np.fft.fft)...")
    t0 = time.time()
    Ft1 = np.fft.fft(spec, norm='ortho')
    Ft1 = Ft1[:NN]
    print(f"Finished ifft ({time.time() - t0:.3f}s)")

    # Step 2: Build constraint vector
    Bt1 = np.zeros(NN, dtype=complex)
    Bt1[0] = 1.0

    # Step 3: Build Hermitian Toeplitz autocorrelation matrix
    c = Ft1
    r = np.concatenate([[Ft1[0]], np.conj(Ft1[1:])])
    Rt1 = toeplitz(c, r)

    # Step 4: Solve linear system
    print("Starting linear solve...")
    t0 = time.time()
    At1 = solve(Rt1, Bt1)
    print(f"Finished linear solve ({time.time() - t0:.3f}s)")

    # Step 5-6: Normalize coefficients
    ASt1 = At1 / At1[0]
    BSt1 = np.real(1.0 / At1[0])

    # Step 7-10: Compute complex spectrum χ(f)
    freqs = np.arange(1, NNout + 1)
    m_vals = np.arange(1, NN)

    exp_matrix = 2j * np.pi * np.outer(freqs, m_vals) / NNout
    exp_terms = np.exp(exp_matrix)
    sum_part = np.sum(ASt1[1:NN] * exp_terms, axis=1)

    chiT = BSt1 / (np.sqrt(NNout) * (1.0 + sum_part))

    # Step 11: Compute intensity spectrum
    SS = np.abs(chiT) ** 2

    return SS, chiT, Ft1, ASt1
