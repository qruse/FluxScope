"""FluxScope Visualization CLI.

Rapidly generate technical charts and hand-drawn pipeline schematics from
the terminal or from automated AI agent actions without writing Python code.
"""

import argparse
import sys
from pathlib import Path

# Add project root to sys.path so scripts.visuals can be imported
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.visuals.charts import (
    plot_bar_comparison,
    plot_line_trend,
    plot_sketch_pipeline,
)


def handle_bar(args):
    labels = [s.strip() for s in args.labels.split(",") if s.strip()]
    values = [float(s.strip()) for s in args.values.split(",") if s.strip()]
    if len(labels) != len(values):
        print(f"Error: labels count ({len(labels)}) != values count ({len(values)})")
        sys.exit(1)

    highlights = (
        [int(s.strip()) for s in args.highlight.split(",") if s.strip()]
        if args.highlight
        else None
    )

    out = plot_bar_comparison(
        labels=labels,
        values=values,
        title=args.title,
        output_path=args.output,
        subtitle=args.subtitle,
        xlabel=args.xlabel or "",
        ylabel=args.ylabel or "",
        unit=args.unit or "",
        highlight_indices=highlights,
        mode=args.mode,
        sketch=args.sketch,
    )
    print(f"Successfully generated bar chart: {out}")


def handle_trend(args):
    x_data = [s.strip() for s in args.x.split(",") if s.strip()]
    series_dict = {}
    for part in args.series.split(";"):
        if ":" not in part:
            continue
        name, val_str = part.split(":", 1)
        vals = [float(v.strip()) for v in val_str.split(",") if v.strip()]
        series_dict[name.strip()] = vals

    out = plot_line_trend(
        x_data=x_data,
        series_dict=series_dict,
        title=args.title,
        output_path=args.output,
        subtitle=args.subtitle,
        xlabel=args.xlabel or "",
        ylabel=args.ylabel or "",
        mode=args.mode,
        sketch=args.sketch,
    )
    print(f"Successfully generated trend chart: {out}")


def handle_pipeline(args):
    # Steps format: "Name:Desc:Badge,Name2:Desc2:Badge2"
    steps = []
    for raw in args.steps.split(";"):
        parts = [p.strip() for p in raw.split(":")]
        if not parts or not parts[0]:
            continue
        step = {"name": parts[0]}
        if len(parts) > 1:
            step["desc"] = parts[1]
        if len(parts) > 2:
            step["badge"] = parts[2]
        steps.append(step)

    out = plot_sketch_pipeline(
        steps=steps,
        title=args.title,
        output_path=args.output,
        subtitle=args.subtitle,
        mode=args.mode,
    )
    print(f"Successfully generated sketch pipeline: {out}")


def main():
    parser = argparse.ArgumentParser(
        description="FluxScope Visuals Generator for Articles"
    )
    parser.add_argument(
        "--mode",
        choices=["dark", "light"],
        default="dark",
        help="Color theme (default: dark)",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Bar chart
    bar_parser = subparsers.add_parser("bar", help="Generate comparison bar chart")
    bar_parser.add_argument("--labels", required=True, help="Comma-separated labels")
    bar_parser.add_argument("--values", required=True, help="Comma-separated numbers")
    bar_parser.add_argument("--title", required=True, help="Chart title")
    bar_parser.add_argument("--subtitle", default=None, help="Optional subtitle")
    bar_parser.add_argument("--output", required=True, help="Output image file path")
    bar_parser.add_argument("--unit", default="", help="Unit suffix (e.g. ms, GB)")
    bar_parser.add_argument(
        "--highlight", default=None, help="Indices to highlight (e.g. 0 or 0,2)"
    )
    bar_parser.add_argument("--xlabel", default="", help="X-axis label")
    bar_parser.add_argument("--ylabel", default="", help="Y-axis label")
    bar_parser.add_argument(
        "--sketch", action="store_true", help="Enable hand-drawn sketch style"
    )

    # Trend line chart
    trend_parser = subparsers.add_parser("trend", help="Generate trend line chart")
    trend_parser.add_argument("--x", required=True, help="Comma-separated X labels/values")
    trend_parser.add_argument(
        "--series",
        required=True,
        help="Series format: 'Model A:10,20,30;Model B:15,25,35'",
    )
    trend_parser.add_argument("--title", required=True, help="Chart title")
    trend_parser.add_argument("--subtitle", default=None, help="Optional subtitle")
    trend_parser.add_argument("--output", required=True, help="Output image file path")
    trend_parser.add_argument("--xlabel", default="", help="X-axis label")
    trend_parser.add_argument("--ylabel", default="", help="Y-axis label")
    trend_parser.add_argument(
        "--sketch", action="store_true", help="Enable hand-drawn sketch style"
    )

    # Hand-drawn pipeline schematic
    pipe_parser = subparsers.add_parser(
        "pipeline", help="Generate hand-drawn sketch pipeline schematic"
    )
    pipe_parser.add_argument(
        "--steps",
        required=True,
        help="Steps format: 'Step1:Description:BADGE;Step2:Description:BADGE'",
    )
    pipe_parser.add_argument("--title", required=True, help="Pipeline diagram title")
    pipe_parser.add_argument("--subtitle", default=None, help="Optional subtitle")
    pipe_parser.add_argument("--output", required=True, help="Output image file path")

    args = parser.parse_args()

    if args.command == "bar":
        handle_bar(args)
    elif args.command == "trend":
        handle_trend(args)
    elif args.command == "pipeline":
        handle_pipeline(args)


if __name__ == "__main__":
    main()
