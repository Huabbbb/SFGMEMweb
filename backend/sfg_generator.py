import numpy as np


def compute_sfg_spectrum(wavenumbers, params, phases=None):
    """
    Compute SFG spectrum from Lorentzian parameters.

    Formula:
        chi(omega) = A_NR + sum_q (A_q * e^(i*phi_q) / (omega_q - omega - i*Gamma_q))

    params: [NR_Real, NR_Imag, A1, omega1, Gamma1, A2, omega2, Gamma2, ...]
    phases: [phi1, phi2, ...]  — one per peak. If None, all default to 0.
    """
    if len(params) < 2:
        raise ValueError("Need at least NR_Real and NR_Imag")
    if (len(params) - 2) % 3 != 0:
        raise ValueError(f"Parameter count must be 3n+2, got {len(params)}")

    n_peaks = (len(params) - 2) // 3

    if phases is None:
        phases = [0.0] * n_peaks
    elif len(phases) != n_peaks:
        raise ValueError(f"phases length ({len(phases)}) != n_peaks ({n_peaks})")

    a_nr = complex(params[0], params[1])
    chi = np.full_like(wavenumbers, a_nr, dtype=complex)

    chi_peaks = []
    for q in range(n_peaks):
        a_q = params[2 + 3 * q]
        omega_q = params[2 + 3 * q + 1]
        gamma_q = params[2 + 3 * q + 2]
        phi_q = phases[q]
        numerator = a_q * np.exp(1j * phi_q)
        chi_q = numerator / (omega_q - wavenumbers - 1j * gamma_q)
        chi += chi_q
        chi_peaks.append(chi_q)

    intensity = np.abs(chi) ** 2
    real_part = np.real(chi)
    imag_part = np.imag(chi)

    sub_components = []

    nr_intensity = params[0]**2 + params[1]**2
    sub_components.append({
        "label": "NR",
        "intensity": nr_intensity,
        "real": params[0],
        "imag": params[1],
    })

    for q, chi_q in enumerate(chi_peaks):
        sub_q_intensity = np.abs(chi_q) ** 2
        sub_components.append({
            "label": f"Peak {q + 1}",
            "intensity": sub_q_intensity.tolist(),
            "real": np.real(chi_q).tolist(),
            "imag": np.imag(chi_q).tolist(),
        })

    return intensity, real_part, imag_part, chi, sub_components
