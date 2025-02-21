import {Piece} from './piece';
import {Color, Coordinates, FENChar} from '../models';

export class Knight extends Piece {
  protected override _FENChar: FENChar;
  protected override _directions: Coordinates[] =
    [
      {x: 1, y: 2},
      {x: 1, y: -2},
      {x: -1, y: 2},
      {x: -1, y: -2},
      {x: 2, y: 1},
      {x: 2, y: -1},
      {x: -2, y: 1},
      {x: -2, y: -1}
    ]

  constructor(_color: Color) {
    super(_color);
    this._FENChar = _color === Color.WHITE ? FENChar.WhiteKnight : FENChar.BlackKnight;
  }
}
