// Define the board size (9x9)
const BOARD_SIZE = 9;

// Define the board
let board = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Define the initial constraints
let constraints = [];

// Define the domain of values (1-9)
const DOMAIN = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Function to check if the value is valid in the given row and column
function isValid(value, row, col) {
    // Check row
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[row][i] === value) {
            return false;
        }
    }

    // Check column
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[i][col] === value) {
            return false;
        }
    }

    // Check sub-grid
    const subGridRow = Math.floor(row / 3) * 3;
    const subGridCol = Math.floor(col / 3) * 3;
    for (let i = subGridRow; i < subGridRow + 3; i++) {
        for (let j = subGridCol; j < subGridCol + 3; j++) {
            if (board[i][j] === value) {
                return false;
            }
        }
    }

    // Value is valid
    return true;
}

// Function to solve the Sudoku puzzle using CSP
function solveCSP() {
    // Define the variables and constraints
    let variables = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) {
                variables.push([i, j]);
            }
        }
    }
    constraints = variables.map(variable => {
        const [row, col] = variable;
        const validValues = DOMAIN.filter(value => isValid(value, row, col));
        return { variable, validValues };
    });

    // Solve the problem using backtracking
    const solution = backtrackSearch(constraints, {});

    // Update the board with the solution
    for (let [variable, value] of Object.entries(solution)) {
        const [row, col] = JSON.parse(variable);
        board[row][col] = value;
    }
}

// Function to perform backtracking search
function backtrackSearch(constraints, assignment) {
    // If all variables are assigned, return the assignment
    if (Object.keys(assignment).length === constraints.length) {
        return assignment;
    }

    // Choose an unassigned variable
    const unassigned = constraints.find(constraint => !assignment[JSON.stringify(constraint.variable)]);

    // Try all possible values for the variable
    for (let value of unassigned.validValues) {
        // Check if the value is consistent with the constraints
        const consistent = constraints.every(constraint => {
            const [row, col] = constraint.variable;
            if (assignment[JSON.stringify([row, col])]) {
                return true;
            }
            return !constraint.validValues.includes(value) || isValid(value, row, col);
        });
        // If the value is consistent, add it to the assignment and continue the search
        if (consistent) {
            assignment[JSON.stringify(unassigned.variable)] = value;
            const result = backtrackSearch(constraints, assignment);
            if (result) {
                return result;
            }
            delete assignment[JSON.stringify(unassigned.variable)];
        }
    }

    // No solution was found
    return null;
}

// Function to print the board
function printBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            process.stdout.write(board[i][j] + " ");
            if ((j + 1) % 3 === 0 && j !== 8) {
                process.stdout.write("| ");
            }
        }
        process.stdout.write("\n");
        if ((i + 1) % 3 === 0 && i !== 8) {
            process.stdout.write("---------------------\n");
        }
    }
}

// Test the implementation
board = [
    [7, 4, 3, 5, 0, 0, 0, 6, 2],
    [0, 5, 0, 1, 0, 0, 4, 0, 0],
    [0, 0, 0, 0, 6, 4, 5, 0, 0],
    [9, 6, 0, 0, 7, 0, 0, 0, 5],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [4, 0, 0, 0, 5, 0, 8, 0, 1],
    [5, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 2, 0, 0, 0, 0, 6, 0, 0],
    [0, 0, 9, 6, 8, 0, 0, 5, 0]
];

solveCSP();
printBoard();
