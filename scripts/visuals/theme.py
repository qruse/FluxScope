"""FluxScope Visualization Theme Configuration.

Provides exact site color palettes (dark/light), typography, sketch styles,
and layout styling for programmatically generated technical blog graphics.
"""

from typing import Literal
import logging
import matplotlib.pyplot as plt

# Suppress harmless font fallback warnings when using sketch/xkcd style
logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)

THEMES = {
    "dark": {
        "bg": "#111a1e",
        "surface": "#192327",
        "ink": "#ecf0ea",
        "muted": "#a7b4b3",
        "line": "#334045",
        "accent": "#ff8669",
        "accent_secondary": "#5eead4",
        "accent_tertiary": "#facc15",
        "accent_quaternary": "#a78bfa",
        "grid": "#243238",
    },
    "light": {
        "bg": "#f6f5f1",
        "surface": "#fffefa",
        "ink": "#1b262b",
        "muted": "#627078",
        "line": "#d9ddda",
        "accent": "#e66043",
        "accent_secondary": "#0d9488",
        "accent_tertiary": "#d97706",
        "accent_quaternary": "#7c3aed",
        "grid": "#e2e6e3",
    },
}

PALETTE_SERIES = {
    "dark": ["#ff8669", "#5eead4", "#facc15", "#a78bfa", "#38bdf8", "#fb7185"],
    "light": ["#e66043", "#0d9488", "#d97706", "#7c3aed", "#0284c7", "#e11d48"],
}


def get_theme(mode: Literal["dark", "light"] = "dark") -> dict[str, str]:
    """Return color palette dictionary for given mode."""
    return THEMES.get(mode, THEMES["dark"])


def get_series_colors(mode: Literal["dark", "light"] = "dark") -> list[str]:
    """Return list of distinct categorical colors matching the theme."""
    return PALETTE_SERIES.get(mode, PALETTE_SERIES["dark"])


def apply_theme(
    fig: plt.Figure,
    ax: plt.Axes,
    mode: Literal["dark", "light"] = "dark",
    sketch: bool = False,
    grid: bool = True,
    kicker: str | None = "FLUXSCOPE // FIELD NOTES",
):
    """Apply FluxScope styling to figure and axes."""
    t = get_theme(mode)
    fig.patch.set_facecolor(t["bg"])
    ax.set_facecolor(t["surface"] if not sketch else t["bg"])

    # Spine styling
    for spine in ax.spines.values():
        spine.set_color(t["line"])
        spine.set_linewidth(1.2 if not sketch else 1.5)

    # Tick styling
    ax.tick_params(colors=t["muted"], which="both", labelsize=10)
    ax.xaxis.label.set_color(t["ink"])
    ax.yaxis.label.set_color(t["ink"])
    ax.xaxis.label.set_fontsize(11)
    ax.yaxis.label.set_fontsize(11)

    # Grid styling
    if grid:
        ax.grid(True, linestyle="--", linewidth=0.7, color=t["grid"], alpha=0.7)
        ax.set_axisbelow(True)

    # Brand kicker if specified
    if kicker:
        fig.text(
            0.08,
            0.94,
            kicker.upper(),
            fontsize=9,
            fontweight="bold",
            color=t["accent"],
            alpha=0.9,
        )
