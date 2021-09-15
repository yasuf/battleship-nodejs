const Letters = require("./letters.js");

class LetterFinder {
  static getNextLetter(letter) {
    return Letters.get(Letters.get(letter).value + 1).key;
  }

  static getPreviousLetter(letter) {
    return Letters.get(Letters.get(letter).value - 1).key;
  }
}

module.exports = LetterFinder
