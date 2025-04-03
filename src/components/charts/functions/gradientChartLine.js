import rgba from "./rgba";

function gradientChartLine(chart, color, opacity = 0.2) {
  const ctx = chart?.getContext("2d");
  const gradientStroke = ctx?.createLinearGradient(0, 230, 0, 50);
  const primary = rgba(color, opacity).toString();

  gradientStroke?.addColorStop(1, primary);
  gradientStroke?.addColorStop(0.2, "rgba(72, 72, 176, 0.0)");
  gradientStroke?.addColorStop(0, "rgba(203, 12, 159, 0)");

  return gradientStroke;
}

export default gradientChartLine;
