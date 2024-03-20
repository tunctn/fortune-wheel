export const humanReadableNumbers = (
  number: number | `${number}` | undefined,
) => {
  if (number === undefined) {
    return "";
  }

  // Add dots to the number
  const numberString = number.toString();
  const numberStringArray = numberString.split("");
  const numberStringArrayReversed = numberStringArray.reverse();
  const numberStringArrayReversedWithDots = numberStringArrayReversed.map(
    (char, index) => {
      if (index % 3 === 0 && index !== 0) {
        return char + ".";
      }
      return char;
    },
  );
  const numberStringArrayWithDots = numberStringArrayReversedWithDots.reverse();
  const numberStringWithDots = numberStringArrayWithDots.join("");
  return numberStringWithDots;
};

export const shortenNumber = (number: number | `${number}` | undefined) => {
  if (number === undefined) {
    return "";
  }

  number = Number(number);

  if (number < 1000) {
    return number;
  }

  let num = `${number}`;
  let suffix = "";

  if (number >= 1000000000) {
    num = (number / 1000000000).toFixed(1);
    suffix = "B";
  } else if (number >= 1000000) {
    num = (number / 1000000).toFixed(1);
    suffix = "M";
  } else if (number >= 1000) {
    num = (number / 1000).toFixed(1);
    suffix = "K";
  }

  // Remove trailing zeros
  num = num.replace(/0+$/, "");
  if (num.endsWith(".")) {
    num = num.slice(0, -1);
  }

  return `${num}${suffix}`;
};
