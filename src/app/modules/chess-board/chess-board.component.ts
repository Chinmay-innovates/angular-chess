import {Component} from '@angular/core';
import {ChessBoard} from '../../chess-logic/chess-board';
import {Color, Coordinates, FENChar, pieceImagePaths, SafeSquares} from '../../chess-logic/models';
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

  private selectedSquare: SelectedSquare = {piece: null}
  private safeSquaresList: Coordinates[] = []

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

  public selectingPiece(x: number, y: number): void {
    const piece: FENChar | null = this.chessBoardView[x][y];
    if (!piece) return;
    if(this.isWrongPieceSelected(piece)) return;

    this.selectedSquare = {piece, x, y};
    this.safeSquaresList = this.chessBoard.safeSquares.get(`${x}-${y}`) || [];
  }

  private isWrongPieceSelected(piece: FENChar): boolean {
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColor === Color.BLACK ||
      !isWhitePieceSelected && this.playerColor === Color.WHITE
  }
}
