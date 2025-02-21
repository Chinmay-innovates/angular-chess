import {Piece} from './piece/piece';

export enum Color {
  WHITE,
  BLACK
}

export type Coordinates = {
  x: number;
  y: number;
}

export enum FENChar {
  WhitePawn = 'P',
  WhiteKnight = 'N',
  WhiteBishop = 'B',
  WhiteRook = 'R',
  WhiteQueen = 'Q',
  WhiteKing = 'K',
  BlackPawn = 'p',
  BlackKnight = 'n',
  BlackBishop = 'b',
  BlackRook = 'r',
  BlackQueen = 'q',
  BlackKing = 'k'
}

export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
  [FENChar.WhitePawn]: 'assets/pieces/white/pawn.png',
  [FENChar.WhiteKnight]: 'assets/pieces/white/knight.png',
  [FENChar.WhiteBishop]: 'assets/pieces/white/bishop.png',
  [FENChar.WhiteRook]: 'assets/pieces/white/rook.png',
  [FENChar.WhiteQueen]: 'assets/pieces/white/queen.png',
  [FENChar.WhiteKing]: 'assets/pieces/white/king.png',
  [FENChar.BlackPawn]: 'assets/pieces/black/pawn.png',
  [FENChar.BlackKnight]: 'assets/pieces/black/knight.png',
  [FENChar.BlackBishop]: 'assets/pieces/black/bishop.png',
  [FENChar.BlackRook]: 'assets/pieces/black/rook.png',
  [FENChar.BlackQueen]: 'assets/pieces/black/queen.png',
  [FENChar.BlackKing]: 'assets/pieces/black/king.png',
};

export type SafeSquares = Map<string, Coordinates[]>

export type LastMove = {
  piece: Piece;
  prevX: number; // prevX
  prevY: number; // prevY
  currX: number;
  currY: number;
}

type KingChecked = {
  isInCheck: true
  x: number
  y: number
}
type KingNotChecked = {
  isInCheck: false
}

export type CheckState = KingChecked | KingNotChecked;
