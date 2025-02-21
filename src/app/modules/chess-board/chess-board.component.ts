import {Component} from '@angular/core';
import {ChessBoard} from '../../chess-logic/chess-board';
import {
  CheckState,
  Color,
  Coordinates,
  FENChar,
  LastMove,
  pieceImagePaths,
  SafeSquares
} from '../../chess-logic/models';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SelectedSquare} from './models';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css'
})
export class ChessBoardComponent {
  private chessBoard = new ChessBoard();
  public pieceImagePaths = pieceImagePaths;
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.chessBoardView;

  public get safeSquares(): SafeSquares {
    return this.chessBoard.safeSquares
  }

  public get gameOverMessage(): string | undefined {
    return this.chessBoard.gameOverMessage
  }

  private selectedSquare: SelectedSquare = {piece: null}
  private safeSquaresList: Coordinates[] = []
  private lastMove: LastMove | undefined = this.chessBoard.lastMove
  private checkState: CheckState = this.chessBoard.checkState

  // promotion properties
  public isPromotionActive: boolean = false
  private promotedPiece: FENChar | null = null
  private promotionCoordinates: Coordinates | null = null

  public promotionPieces(): FENChar[] {
    return this.playerColor === Color.WHITE ?
      [FENChar.WhiteKnight, FENChar.WhiteBishop, FENChar.WhiteRook, FENChar.WhiteQueen] :
      [FENChar.BlackKnight, FENChar.BlackBishop, FENChar.BlackRook, FENChar.BlackQueen]
  }


  public get playerColor(): Color {
    return this.chessBoard.playerColor
  }

  public isSquareDark(x: number, y: number): boolean {
    return ChessBoard.isSquareDark(x, y);
  }

  public isSquareSelected(x: number, y: number): boolean {
    if (!this.selectedSquare.piece) return false;
    return this.selectedSquare.x === x && this.selectedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
    return this.safeSquaresList.some(coordinate => coordinate.x === x && coordinate.y === y);
  }

  public isSquareLastMove(x: number, y: number): boolean {
    if (!this.lastMove) return false;
    const {prevX, prevY, currX, currY} = this.lastMove
    return x === prevX && y === prevY || x === currX && y === currY;
  }

  public isSquareChecked(x: number, y: number): boolean {
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  public isSquarePromotionSquare(x: number, y: number): boolean {
    if (!this.promotionCoordinates) return false;
    return this.promotionCoordinates.x === x && this.promotionCoordinates.y === y;
  }

  private unmarkingPreviouslySelectedAndSafeSquares(): void {
    this.selectedSquare = {piece: null}
    this.safeSquaresList = []

    if (this.isPromotionActive) {
      this.isPromotionActive = false
      this.promotedPiece = null
      this.promotionCoordinates = null
    }
  }

  public selectingPiece(x: number, y: number): void {
    if (this.gameOverMessage !== undefined) return
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return;
    if (this.isWrongPieceSelected(piece)) return;

    const isSameSquareClicked: boolean = !!this.selectedSquare.piece &&
      this.selectedSquare.x === x && this.selectedSquare.y === y
    this.unmarkingPreviouslySelectedAndSafeSquares();
    if (isSameSquareClicked) return;

    this.selectedSquare = {piece, x, y};
    this.safeSquaresList = this.chessBoard.safeSquares.get(`${x}-${y}`) || [];
  }

  private placingPiece(dx: number, dy: number): void {
    if (!this.selectedSquare.piece) return;
    if (!this.isSquareSafeForSelectedPiece(dx, dy)) return;

    // Pawn promotion
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.WhitePawn || this.selectedSquare.piece === FENChar.BlackPawn
    const isPawnOnLastRank: boolean = isPawnSelected && (dx === 7 || dx === 0)
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnLastRank

    if (shouldOpenPromotionDialog) {
      this.safeSquaresList = []
      this.isPromotionActive = true
      this.promotionCoordinates = {
        x: dx,
        y: dy,
      }
      return;
    }

    const {x, y} = this.selectedSquare;
    this.updateBoard(x, y, dx, dy);
  }

  private updateBoard(x: number, y: number, dx: number, dy: number): void {
    this.chessBoard.move(x, y, dx, dy, this.promotedPiece);
    this.chessBoardView = this.chessBoard.chessBoardView;
    this.checkState = this.chessBoard.checkState;
    this.lastMove = this.chessBoard.lastMove;
    this.unmarkingPreviouslySelectedAndSafeSquares();
  }

  public promotePiece(piece: FENChar): void {
    if (!this.promotionCoordinates || !this.selectedSquare.piece) return

    this.promotedPiece = piece
    const {x: newX, y: newY} = this.promotionCoordinates
    const {x: prevX, y: prevY} = this.selectedSquare
    this.updateBoard(prevX, prevY, newX, newY);
  }

  public closePawnPromotionDialog(): void {
    this.unmarkingPreviouslySelectedAndSafeSquares()
  }

  public move(x: number, y: number): void {
    this.selectingPiece(x, y)
    this.placingPiece(x, y)
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColor === Color.BLACK ||
      !isWhitePieceSelected && this.playerColor === Color.WHITE
  }
}
