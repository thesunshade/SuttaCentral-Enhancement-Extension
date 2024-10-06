export default function validateCSSColor(color: string): string | undefined {
  // Trim whitespace from the input
  color = color.trim().toLowerCase();

  // Hex color regex (3, 4, 6, or 8 digits)
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

  // RGB and RGBA regex (comma-separated and space-separated, with optional percentages)
  const rgbRegex = /^rgb\(\s*(\d{1,3}%?)\s*,?\s*(\d{1,3}%?)\s*,?\s*(\d{1,3}%?)\s*\)$/;
  const rgbaRegex = /^rgba\(\s*(\d{1,3}%?)\s*,?\s*(\d{1,3}%?)\s*,?\s*(\d{1,3}%?)\s*,?\s*(0|1|0?\.\d+)\s*\)$/;

  // HSL and HSLA regex
  const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
  const hslaRegex = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+)\s*\)$/;

  // List of valid CSS color names
  const colorNames = new Set(["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"]);

  if (hexRegex.test(color)) {
    return color;
  }

  if (rgbRegex.test(color) || rgbaRegex.test(color)) {
    const parts = color.match(/(\d{1,3}%?)/g);
    if (
      parts &&
      parts.every(part => {
        if (part.endsWith("%")) {
          return parseInt(part) <= 100;
        }
        return parseInt(part) <= 255;
      })
    ) {
      return color;
    }
  }

  if (hslRegex.test(color) || hslaRegex.test(color)) {
    const parts = color.match(/\d+/g);
    if (parts && parseInt(parts[0]) <= 360 && parts.slice(1, 3).every(part => parseInt(part) <= 100)) {
      return color;
    }
  }

  if (colorNames.has(color)) {
    return color;
  }

  return undefined;
}
