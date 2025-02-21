import {Color, Coordinates, FENChar} from '../models';
import {Piece} from './piece';

export class Pawn extends Piece {
  private _hasMoved: boolean = false;
  protected override _FENChar: FENChar;
  protected override _directions: Coordinates[] = [
    {x: 1, y: 0},
    {x: 2, y: 0},
    {x: 1, y: 1},
    {x: 1, y: -1},
  ]

  constructor(_color: Color) {
    super(_color);
    if (_color === Color.BLACK) this.setBlackPawnDirection();
    this._FENChar = _color === Color.WHITE ? FENChar.WhitePawn : FENChar.BlackPawn;
  }

  private setBlackPawnDirection(): void {
    this._directions = this._directions.map(({x, y}) => ({
      x: -1 * x, y
    }))
  }

  public get hasMoved(): boolean {
    return this._hasMoved;
  }

  public set hasMoved(_) {
    this._hasMoved = true;
    this._directions = [
      {x: 1, y: 0},
      {x: 1, y: 1},
      {x: 1, y: -1},
    ]
    if (this._color === Color.BLACK) this.setBlackPawnDirection();
  }
}
