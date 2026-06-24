#!/usr/bin/env bash
# Render a resume HTML file to PDF using headless Chrome.
# Usage: render-resume.sh <input.html> [output.pdf]
set -euo pipefail

html="${1:?usage: render-resume.sh <input.html> [output.pdf]}"
pdf="${2:-${html%.html}.pdf}"

chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$chrome" ] || chrome="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
[ -n "$chrome" ] || { echo "ERROR: Chrome not found" >&2; exit 1; }

abs="$(cd "$(dirname "$html")" && pwd)/$(basename "$html")"
"$chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$pdf" "file://$abs" >/dev/null 2>&1
echo "Rendered $pdf ($(wc -c < "$pdf") bytes)"
