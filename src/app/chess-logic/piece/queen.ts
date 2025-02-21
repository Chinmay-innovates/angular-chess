import {Color, Coordinates, FENChar} from "../models";
import {Piece} from "./piece";

export class Queen extends Piece {
  protected override _FENChar: FENChar;
  protected override _directions: Coordinates[] = [
    {x: 0, y: 1},
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 1, y: -1},
    {x: 1, y: 1},
    {x: -1, y: 0},
    {x: -1, y: 1},
    {x: -1, y: -1}
  ];

  constructor(_color: Color) {
    super(_color);
    this._FENChar = _color === Color.WHITE ? FENChar.WhiteQueen : FENChar.BlackQueen;
  }
}
