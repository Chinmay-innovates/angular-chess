import {Piece} from './piece/piece';
import {Color, LastMove} from './models';
import {King} from './piece/king';
import {Rook} from './piece/rook';
import {Pawn} from './piece/pawn';

export class FENConverter {
  public static readonly initialPosition: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  private static readonly columns = ["a", "b", "c", "d", "e", "f", "g", "h"];


  public convertBoardToFEN(
    board: (Piece | null)[][],
    playerColor: Color,
    lastMove: LastMove | undefined,
    fiftyMoveRuleCounter: number,
    fullMoveNumber: number
  ): string {
    let FEN = "";

    for (let i = 7; i >= 0; i--) {
      let FENRow = "";
      let emptyCount = 0;

      for (const piece of board[i]) {
        if (!piece) {
          emptyCount++;
          continue;
        }

        if (emptyCount > 0) {
          FENRow += emptyCount;
          emptyCount = 0;
        }

        FENRow += piece.FENChar;
      }

      if (emptyCount > 0) FENRow += emptyCount;

      FEN += i === 0 ? FENRow : FENRow + "/";
    }

    FEN += ` ${playerColor === Color.WHITE ? "w" : "b"}`;
    FEN += ` ${this.castlingAvailability(board)}`;
    FEN += ` ${this.enPassantPossibility(lastMove, playerColor)}`;
    FEN += ` ${fiftyMoveRuleCounter * 2}`;
    FEN += ` ${fullMoveNumber}`;

    return FEN;
  }

  private castlingAvailability(board: (Piece | null)[][]): string {
    let availability = "";

    [Color.WHITE, Color.BLACK].forEach((color) => {
      const row = color === Color.WHITE ? 0 : 7;
      const king = board[row][4];

      if (!(king instanceof King) || king.hasMoved) return;

      const kingSideRook = board[row][7];
      const queenSideRook = board[row][0];

      if (kingSideRook instanceof Rook && !kingSideRook.hasMoved) availability += color === Color.WHITE ? "K" : "k";
      if (queenSideRook instanceof Rook && !queenSideRook.hasMoved) availability += color === Color.WHITE ? "Q" : "q";
    });

    return availability || "-";
  }

  private enPassantPossibility(lastMove: LastMove | undefined, color: Color): string {
    if (!lastMove) return "-";

    const {piece, currX, prevX, prevY} = lastMove;
    if (!(piece instanceof Pawn) || Math.abs(currX - prevX) !== 2) return "-";

    const row = color === Color.WHITE ? 6 : 3;
    return FENConverter.columns[prevY] + row;
  }
}
