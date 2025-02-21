import {FENChar, Coordinates, Color} from '../models';
import {Piece} from './piece';

export class Bishop extends Piece {
  protected override _FENChar: FENChar;
  protected override _directions: Coordinates[] =
    [
      {x: 1, y: 1},
      {x: 1, y: -1},
      {x: -1, y: 1},
      {x: -1, y: -1}
    ];

  constructor(_color: Color) {
    super(_color);
    this._FENChar = _color === Color.WHITE ? FENChar.WhiteBishop : FENChar.BlackBishop;
  }
}
