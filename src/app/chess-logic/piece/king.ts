import {Color, Coordinates, FENChar} from "../models";
import {Piece} from "./piece";

export class King extends Piece {
  private _hasMoved: boolean = false;
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
    this._FENChar = _color === Color.WHITE ? FENChar.WhiteKing : FENChar.BlackKing;
  }

  public get hasMoved(): boolean {
    return this._hasMoved;
  }

  public set hasMoved(_) {
    this._hasMoved = true;
  }
}
