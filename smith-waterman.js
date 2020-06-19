const match = 2;
const mismatch = -1;
const gap = -1;

const s1 = "GGTTGACTA"
const s2 = "TGTTACGG"

const rows = s1.length + 1;
const cols = s2.length + 1;

function calculate_score(matrix, x, y) {
    /* Calculates score for given coordinate in matrix. */

    // compute similarity score
    let similarity = (s1[x-1] == s2[y-1]) ? match : mismatch;

    // compute diagonal, above, and left scores
    let score_diag = matrix[x-1][y-1] + similarity;
    let score_above = matrix[x-1][y] + gap;
    let score_left = matrix[x][y-1] + gap;

    return Math.max(score_diag, score_above, score_left);
}

function create_matrix(rows, cols) {
    /* Create scoring matrix */

    // initialize matrix with 0s
    let score_matrix = [];
    for (let i = 0; i < rows; i++) {
        score_matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            score_matrix[i].push(0);
        }
    }

    // compute scores and fill matrix
    let max_score = 0;
    let max_coords = [0,0];

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            let score = calculate_score(score_matrix, i, j);
            if (score > max_score) {
                max_score = score;
                max_coords = [i,j];
            }
            score_matrix[i][j] = score;
        }
    }

    return [score_matrix, max_coords];
}

function next_move(score_matrix, x, y) {
    /* Determine next move during traceback */

    let diag = score_matrix[x - 1][y - 1];
    let up   = score_matrix[x - 1][y];
    let left = score_matrix[x][y - 1];

    if ((diag >= up) && (diag >= left)) {
        if (diag != 0) return 1;
        else return 0;
    } else if ((up > diag) && (up >= left)) {
        if (up != 0) return 2;
        else return 0;
    } else if ((left > diag) && (left > up)) {
        if (left != 0) return 3;
        else return 0;
    } else {
        return 0;
    }

}

function traceback(score_matrix, start_coord) {
    let end = 0;
    let diag = 1;
    let up = 2;
    let left = 3;
    let s1_aligned = [];
    let s2_aligned = [];
    let x = start_coord[0];
    let y = start_coord[1];
    let move = next_move(score_matrix, x, y);

    while (move != end) {
        if (move == diag) {
            s1_aligned.push(s1[x-1]);
            s2_aligned.push(s2[y-1]);
            x--;
            y--;
        } else if (move == up) {
            s1_aligned.push(s1[x-1]);
            s2_aligned.push('-');
            x--;
        } else {
            s1_aligned.push('-');
            s2_aligned.push(s2[y-1]);
            y--;
        }
        move = next_move(score_matrix, x, y);
    }

    s1_aligned.push(s1[x-1]);
    s2_aligned.push(s2[y-1]);

    return [s1_aligned.reverse(), s2_aligned.reverse()];
}
