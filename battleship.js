const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
var constants = require('./constants.js');

class Battleship {
    start() {
        console.log(cliColor.magenta("                                     |__"));
        console.log(cliColor.magenta("                                     |\\/"));
        console.log(cliColor.magenta("                                     ---"));
        console.log(cliColor.magenta("                                     / | ["));
        console.log(cliColor.magenta("                              !      | |||"));
        console.log(cliColor.magenta("                            _/|     _/|-++'"));
        console.log(cliColor.magenta("                        +  +--|    |--|--|_ |-"));
        console.log(cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"));
        console.log(cliColor.magenta("                    +---------------___[}-_===_.'____                 /\\"));
        console.log(cliColor.magenta("                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"));
        console.log(cliColor.magenta(" __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"));
        console.log(cliColor.magenta("|                        Welcome to Battleship                         BB-61/"));
        console.log(cliColor.magenta(" \\_________________________________________________________________________|"));
        console.log();

        gameController.InitializeCellsHit();
        this.InitializeGame();
        this.StartGame();
    }

    StartGame() {
        console.clear();
        console.log(cliColor.yellow("                  __"));
        console.log(cliColor.yellow("                 /  \\"));
        console.log(cliColor.yellow("           .-.  |    |"));
        console.log(cliColor.yellow("   *    _.-'  \\  \\__/"));
        console.log(cliColor.yellow("    \\.-'       \\"));
        console.log(cliColor.yellow("   /          _/"));
        console.log(cliColor.yellow("  |      _  /"));
        console.log(cliColor.yellow("  |     /_\\'"));
        console.log(cliColor.yellow("   \\    \\_/"));
        console.log(cliColor.yellow("    \"\"\"\""));
        var turnNumber = 1;
        var computerGuesses = [];
        this.noWinner = true;
        this.playerGuesses = [];
        do {
            console.log("-------------------------------------");
            console.log(cliColor.yellow("Turn: " + turnNumber));
            this.PrintEnemyFleetStatus();
            console.log(cliColor.yellow("Enter coordinates for your shot :"));
            var coordinates = readline.question()
            // if (coordinates === "") continue;
            var position = Battleship.ParsePosition(coordinates);

            var message = this.ValidatePosition(position);
            while (message.length > 0) {
                console.log(cliColor.red('Invalid input: ' + message));
                console.log(cliColor.yellow("Enter coordinates for your shot :"));
                coordinates = readline.question()
                position = Battleship.ParsePosition(coordinates);
                message = this.ValidatePosition(position);
            }
            this.playerGuesses.push(position);

            var isHit = gameController.CheckIsHit(this.enemyFleet, position);
            gameController.AddTurnToBoard(position, isHit);

            if (isHit) {
                console.log(cliColor.green("Hit!"));
            } else {
                console.log(cliColor.white("Miss."));
            }
            this.PrintHitsMisses(isHit);
            console.log();
            console.log("Board state:");
            gameController.PaintBoardState();
            var computerPos = this.GetRandomPosition();
            while(computerGuesses.find( guess => guess.row === computerPos.row && guess.column === computerPos.column)) {
                computerPos = this.GetRandomPosition();
            }
            computerGuesses.push(computerPos);

            var isHit = gameController.CheckIsHit(this.myFleet, computerPos);
            console.log(cliColor.yellow(`Computer shot in ${computerPos.column}${computerPos.row} and ` + (isHit ? `has hit your ship !` : `miss`)));
            this.PrintHitsMisses(isHit)
            this.CheckWinCondition();
            turnNumber += 1;
        }
        while (this.noWinner);
    }

    ValidatePosition(position) {
        var rawInput = `${position.column}${position.row}`
        const regex = new RegExp(/([A-H]|[a-h]){1}[1-8]/)
        var message = ''
        if (!regex.test(rawInput)) {
            message += 'Please input a position using A-H and numbered from 1-8. '
        }

        if (this.playerGuesses.find( guess => guess.row === position.row && guess.column === position.column)) {
            message += `${rawInput} has already been guessed; please input a new, valid position.`
        }

        return message;
    }

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        if (letter == undefined) {
            letter = '';
        }

        var number = parseInt(input.substring(1, 2), 10);
        return new position(letter, number);
    }

    PrintHitsMisses(isHit) {
        if (isHit) {
            beep();

            console.log(cliColor.red("                \\         .  ./"));
            console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
            console.log(cliColor.red("                  (M^^.^~~:.'\")."));
            console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
            console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
            console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
            console.log(cliColor.red("                 -\\  \\     /  /-"));
            console.log(cliColor.red("                   \\  \\   /  /"));
            console.log(cliColor.blue("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
            console.log(cliColor.blue("   ^^^^  ^^  ^^^ ^^ ^^ ^ ^^^ ^ ^^^ ^^^ ^^ ^^^^^"));
            console.log(cliColor.blue("     ^^^ ^^^ ^^ ^^^ ^ ^ ^^ ^ ^^ ^^^^ ^^ ^^^ ^^  "));
        }
    }

    PrintEnemyFleetStatus() {
        console.log(cliColor.yellow("Enemy Ships status: "));
        this.enemyFleet.forEach(ship => {
            console.log(`${ship.name} (${ship.size}): ${ship.isSunk() ? cliColor.green("Sunk") : cliColor.red("Not Sunk")}`)
        });
    }

    CheckWinCondition() {
        let cpuPlayerWon = this.myFleet.every(ship => ship.isSunk());
        let humanPlayerWon = this.enemyFleet.every(ship => ship.isSunk());

        if (humanPlayerWon || cpuPlayerWon) {
            this.noWinner = false;
        }

        if (humanPlayerWon) {
            console.log(cliColor.green("Congratulations!! You won the war against the evil Milton"));
        }
        if (cpuPlayerWon) {
            console.log(cliColor.red("You lost, Milton took over the world"));
        }
    }

    GetRandomPosition() {
        var rndColumn = Math.floor((Math.random() * constants.LINES));
        var letter = letters.get(rndColumn + 1);
        var number = Math.floor((Math.random() * constants.ROWS)) + 1;
        var result = new position(letter, number);
        return result;
    }

    InitializeGame() {
        this.InitializeMyFleetByLocationAndDirection();
        this.InitializeEnemyFleet();
    }

    InitializeMyFleetByLocationAndDirection() {
        this.myFleet = gameController.InitializeShips();

        console.log(
        cliColor.yellow(
            "Please position your fleet (Game board size is from A to H and 1 to 8) :"
        )
        );

        this.myFleet.forEach((ship) => {
            this.SetupShip(ship);
        });
    }

    SetupShip(ship) {
        try {
            console.log();
            console.log(
                cliColor.yellow(
                `Please enter the starting position for the ${ship.name} (size: ${ship.size}):`
                )
            );
            const startingPosition = readline.question();

            console.log(
                cliColor.yellow(
                `Enter ship orientation: Up (U), Down (D), Right (R), Left (L):`
                )
            );
            const direction = readline.question();

            let nextPosition = Battleship.ParsePosition(startingPosition);
            for (let i = 0; i < ship.size; i++) {
                ship.addPosition(nextPosition);
                nextPosition = nextPosition.getNextPosition(direction.toUpperCase());
            }
        } catch {
            console.log();
            console.log();
            console.log(cliColor.yellow(`Ship placement entered was invalid, please enter a different position or orientation for the ${ship.name} (size:${ship.size}):`));
            this.SetupShip(ship);
        }
    }

    InitializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));
        this.enemyFleet[1].addPosition(new position(letters.E, 9));

        this.enemyFleet[2].addPosition(new position(letters.A, 3));
        this.enemyFleet[2].addPosition(new position(letters.B, 3));
        this.enemyFleet[2].addPosition(new position(letters.C, 3));

        this.enemyFleet[3].addPosition(new position(letters.F, 8));
        this.enemyFleet[3].addPosition(new position(letters.G, 8));
        this.enemyFleet[3].addPosition(new position(letters.H, 8));

        this.enemyFleet[4].addPosition(new position(letters.C, 5));
        this.enemyFleet[4].addPosition(new position(letters.C, 6));
    }
}

module.exports = Battleship;
