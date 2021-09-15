const LetterFinder = require('./letterFinder.js');

class Position {
    constructor(column, row) {
        this.column = column;
        this.row = row;
        this.isHit = false;
    }

    getNextPosition(direction) {
        switch(direction) {
            case 'up':
                return new Position(LetterFinder.getPreviousLetter(this.column), this.row)
                break;
            case 'down':
                return new Position(LetterFinder.getNextLetter(this.column), this.row)
                break;
            case 'left':
                return new Position(this.column, this.row - 1)
                break;
            case 'right':
                return new Position(this.column, this.row + 1)
                break;
            default:
                throw new Error('Please enter a valid direction (up, down, left or right)')
                break;
        }
    }
}

module.exports = Position;
