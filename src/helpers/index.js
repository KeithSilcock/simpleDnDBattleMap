export function capitalizeFirstLetters(text, everyWord = false) {
  if (everyWord) {
    const words = text.split(" ");
    const newString = [];
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex];
      try {
        var newWord = `${word[0].toUpperCase()}${word.slice(1)}`;
      } catch (e) {
        if (e instanceof TypeError) {
          newWord = "";
        } else {
          throw e;
        }
      }

      newString.push(newWord);
    }
    return newString.join(" ");
  } else {
    return `${text[0].toUpperCase()}${text.slice(1)}`;
  }
}

export function formatToMiliSeconds(secs) {
  return Number(secs) * 1000;
}
export function formatFromMiliSeconds(ms) {
  return Number(ms) / 1000;
}

export function getFirstLetters(text) {
  const words = text.split(" ");
  let response = "";
  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    const word = words[wordIndex];
    response += word.slice(0, 1);
  }
  return response;
}

export function distanceBetweenTwoPoints(pos1, pos2) {
  return Math.sqrt(
    Math.pow(pos1.pos_x - pos2.pos_x, 2) + Math.pow(pos1.pos_y - pos2.pos_y, 2)
  );
}
