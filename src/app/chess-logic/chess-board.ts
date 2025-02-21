import {Knight} from './piece/knight';
import {Bishop} from './piece/bishop';
import {Queen} from './piece/queen';
import {King} from './piece/king';
import {Pawn} from './piece/pawn';
import {Rook} from './piece/rook';
import {Piece} from './piece/piece';
import {Color, Coordinates, FENChar, SafeSquares} from './models';

export class ChessBoard {
  protected chessBoard: (Piece | null)[][];
  private readonly _safeSquares: SafeSquares;
  private readonly boardSize = 8;
  private _playerColor = Color.WHITE;

  constructor() {
    this.chessBoard = [
      [
        new Rook(Color.WHITE), new Knight(Color.WHITE), new Bishop(Color.WHITE), new Queen(Color.WHITE),
        new King(Color.WHITE), new Bishop(Color.WHITE), new Knight(Color.WHITE), new Rook(Color.WHITE)
      ],
      [
        new Pawn(Color.WHITE), new Pawn(Color.WHITE), new Pawn(Color.WHITE), new Pawn(Color.WHITE),
        new Pawn(Color.WHITE), new Pawn(Color.WHITE), new Pawn(Color.WHITE), new Pawn(Color.WHITE),
      ],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [
        new Pawn(Color.BLACK), new Pawn(Color.BLACK), new Pawn(Color.BLACK), new Pawn(Color.BLACK),
        new Pawn(Color.BLACK), new Pawn(Color.BLACK), new Pawn(Color.BLACK), new Pawn(Color.BLACK),
      ],
      [
        new Rook(Color.BLACK), new Knight(Color.BLACK), new Bishop(Color.BLACK), new Queen(Color.BLACK),
        new King(Color.BLACK), new Bishop(Color.BLACK), new Knight(Color.BLACK), new Rook(Color.BLACK)
      ]
    ];
    this._safeSquares = this.findSafeSquares();
  }

  public get playerColor(): Color {
    return this._playerColor;
  }

  public get chessBoardView(): (FENChar | null)[][] {
    return this.chessBoard.map(row => {
      return row.map(piece => piece instanceof Piece ? piece.FENChar : null);
    })
  }

  public get safeSquares(): SafeSquares {
    return this._safeSquares;
  }

  public static isSquareDark(x: number, y: number): boolean {
    return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1
  }

  private areCoordinatesValid(x: number, y: number): boolean {
    return x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize;
  }

  public isInCheck(_color: Color): boolean {
    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        const piece: Piece | null = this.chessBoard[x][y];

        if (!piece || piece.color === _color) continue;

        for (const {x: dx, y: dy} of piece.directions) {
          let targetX: number = x + dx;
          let targetY: number = y + dy;

          if (!this.areCoordinatesValid(targetX, targetY)) continue;

          if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
            //Pawns are only attacking diagonally
            if (piece instanceof Pawn && dy === 0) continue;

            const targetPiece: Piece | null = this.chessBoard[targetX][targetY];
            if (targetPiece instanceof King && targetPiece.color === _color) return true;

          } else {
            while (this.areCoordinatesValid(targetX, targetY)) {
              const targetPiece: Piece | null = this.chessBoard[targetX][targetY];
              if (targetPiece instanceof King && targetPiece.color === _color) return true;

              if (targetPiece !== null) break;

              targetX += dx;
              targetY += dy;
            }
          }
        }
      }
    }
    return false;
  }

  private isPositionSafeAfterMove(piece: Piece, x: number, y: number, dx: number, dy: number): boolean {
    // x,y => previous coordinates  dx,dy => new coordinates
    const targetPiece: Piece | null = this.chessBoard[dx][dy];
    // Check if the new position is occupied by a friendly piece
    if (targetPiece && targetPiece.color === piece.color) return false;

    //simulate position
    this.chessBoard[x][y] = null;
    this.chessBoard[dx][dy] = piece;

    const isPositionSafe = !this.isInCheck(piece.color);

    //restore position
    this.chessBoard[x][y] = piece;
    this.chessBoard[dx][dy] = targetPiece;

    return isPositionSafe;
  }

  private findSafeSquares(): SafeSquares {
    const safeSquares: SafeSquares = new Map<string, Coordinates[]>();

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        const piece: Piece | null = this.chessBoard[x][y];

        if (!piece || piece.color !== this._playerColor) continue;

        const safeSquaresList: Coordinates[] = [];

        for (const {x: dx, y: dy} of piece.directions) {
          let targetX: number = x + dx;
          let targetY: number = y + dy;

          if (!this.areCoordinatesValid(targetX, targetY)) continue;

          let targetPiece: Piece | null = this.chessBoard[targetX][targetY];
          if (targetPiece && targetPiece.color === piece.color) continue;

          // need to restrict move in certain directions
          if (piece instanceof Pawn) {
            //Pawns cannot move 2 squares forward if any piece is in the way
            if (dx === 2 || dx === -2) {
              if (targetPiece) continue;
              if (this.chessBoard[targetX + (dx === 2 ? -1 : 1)][targetY]) continue;
            }
            //Pawns cannot move 1 square forward if any piece is in the way
            if ((dx === 1 || dx === -1) && dy === 0 && targetPiece) continue;

            //Pawns cannot diagonally if there is no piece ,or has same color
            if ((dy === 1 || dy === -1) && (!targetPiece || targetPiece.color === piece.color)) continue;
          }


          if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
            if (this.isPositionSafeAfterMove(piece, x, y, targetX, targetY)) {
              safeSquaresList.push({x: targetX, y: targetY});
            }
          } else {
            while (this.areCoordinatesValid(targetX, targetY)) {
              targetPiece = this.chessBoard[targetX][targetY];
              if (targetPiece && targetPiece.color === piece.color) break;

              if (this.isPositionSafeAfterMove(piece, x, y, targetX, targetY)) {
                safeSquaresList.push({x: targetX, y: targetY});
              }

              if (targetPiece !== null) break;

              targetX += dx;
              targetY += dy;
            }
          }
        }

        if (safeSquaresList.length > 0) {
          safeSquares.set(`${x}-${y}`, safeSquaresList);
        }
      }
    }
    return safeSquares
  }

}
