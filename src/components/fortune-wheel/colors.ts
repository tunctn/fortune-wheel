export const COLORS = [
  // // Pastel
  // "#fbf8cc",
  // "#fde4cf",
  // "#ffcfd2",
  // "#f1c0e8",
  // "#cfbaf0",
  // "#a3c4f3",
  // "#90dbf4",
  // "#8eecf5",
  // "#98f5e1",

  // // Bright
  // "#001219",
  // "#005f73",
  // "#0a9396",
  // "#94d2bd",
  // "#e9d8a6",
  // "#ee9b00",
  // "#ca6702",
  // "#bb3e03",
  // "#ae2012",
  // "#9b2226",

  // // Dark black colors
  // "#000000",
  // "#111111",
  // "#222222",
  // "#333333",
  // "#444444",
  // "#555555",
  // "#666666",
  // "#777777",
  // "#888888",
  // "#999999",

  // Light colors
  // "#e2e8f0",
  // "#e5e7eb",
  // "#e4e4e7",
  // "#e5e5e5",
  "#e7e5e4",
  "#fecaca",
  "#fed7aa",
  "#fde68a",
  "#fef08a",
  "#d9f99d",
  "#bbf7d0",
  "#a7f3d0",
  "#99f6e4",
  "#a5f3fc",
  "#bae6fd",
  "#bfdbfe",
  "#c7d2fe",
  "#ddd6fe",
  "#e9d5ff",
  "#f5d0fe",
  "#fbcfe8",
  "#fecdd3",
];
export const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};
