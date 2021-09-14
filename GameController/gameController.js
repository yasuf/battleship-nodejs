const Letters = require("./letters.js");
const Battleship = require("../battleship.js");

class GameController {

    static availablePlayerCells = [];

    static InitializeShips() {
        var colors = require("cli-color");
        const Ship = require("./ship.js");
        var ships = [
            new Ship("Aircraft Carrier", 5, colors.CadetBlue),
            new Ship("Battleship", 4, colors.Red),
            new Ship("Submarine", 3, colors.Chartreuse),
            new Ship("Destroyer", 3, colors.Yellow),
            new Ship("Patrol Boat", 2, colors.Orange)
        ];
        return ships;
    }

    static InitializeCellsHit() {
        for (let i=0; i<8; i++) {
            this.availablePlayerCells[i] = [];
            for (let j=0; j<8; j++) {
                this.availablePlayerCells[i].push(`[ ]`)
            }
        }
    }

    static PaintBoardState() {
        var buffer = '';
        for(let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                buffer += this.availablePlayerCells[i][j];
            }
            buffer += '\n';
        }
        console.log(buffer);
    }

    static AddTurnToBoard(shot, isHit) {
        var column = Letters.get(shot.column).value;
        var cell = isHit ? '[x]' : '[o]';
        this.availablePlayerCells[column-1][shot.row-1] = cell;
    }

    static CheckIsHit(ships, shot) {
        if (shot == undefined)
            throw "The shooting position is not defined";
        if (ships == undefined)
            throw "No ships defined";
        var returnvalue = false;
        ships.forEach(function (ship) {
            ship.positions.forEach(position => {
                if (position.row == shot.row && position.column == shot.column)
                    returnvalue = true;
            });
        });
        return returnvalue;
    }

    static isShipValid(ship) {
        return ship.positions.length == ship.size;
    }
}

module.exports = GameController;
