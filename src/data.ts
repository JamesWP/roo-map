import { Drawing } from "./drawing";

enum CellType {
    NOTHING = 0,
    FLOOR = 1,
    STICKEY = 2,
    PLAYER = 3,
    EXIT = 4,
    WEST_STAIR = 5,
    NORTH_STAIR = 6,
    EAST_STAIR = 7,
    SOUTH_STAIR = 8,
    TELEPORTER = 15,
    SLIDE = 16,
    SWITCH = 17,
    SLIPPY = 21,
    OBJECT = 22,
    DESTRUCTABLE = 23
};
enum CellItem { 
    NOTHING = 0, 
    GEM = 1, 
    FOE = 2, 
    FRIEND = 3, 
    SPEED = 7, 
    BOMB = 9 
};

export class Cell {
    constructor(private _data: Uint8Array) { }

    get height(): number { return this._data[0]; }
    get type(): number { return this._data[1]; }
    get thing(): number { return this._data[2]; }
    get item(): number { return this._data[3]; }

    get data(): Readonly<Uint8Array> { return this._data; }

    get text(): string {
        return `height=${this.height}, type=${CellType[this.type]}, item=${CellItem[this.item]}, data=${this.data}`;
    }
};

export class ParsedLevel {
    public xsize: number;
    public ysize: number;
    public cells: Cell[] = new Array();


    get numGems(): number {
        let total = 0;
        this.cells.forEach((c) => total += c.item == CellItem.GEM ? 1 : 0);
        return total;
    }

    renderTo(context: CanvasRenderingContext2D): (x: number, y: number) => [number, number] {
        let xscale = context.canvas.width / this.xsize;
        let yscale = context.canvas.height / this.ysize;

        let scale = Math.floor(Math.min(xscale, yscale)) / 4;

        context.scale(scale, scale);
        context.imageSmoothingEnabled = false;

        for (let x = 0; x < this.xsize; x++) {
            for (let y = 0; y < this.ysize; y++) {
                let d = new Drawing(context, x, y);
                let cell = this.cells[x + y * this.xsize];

                if (cell.type != CellType.NOTHING) {
                    let hugh = cell.height % 10 * 3;
                    let lum = Math.floor(cell.height / 10) * 5 + 50;
                    d.color(`hsl(${hugh}, 60%, ${lum}%)`);
                    d.tile();
                }

                if (cell.type == CellType.NORTH_STAIR) { d.color('grey'); d.vert(); }
                if (cell.type == CellType.SOUTH_STAIR) { d.color('grey'); d.vert(); }
                if (cell.type == CellType.WEST_STAIR) { d.color('grey'); d.horiz(); }
                if (cell.type == CellType.EAST_STAIR) { d.color('grey'); d.horiz(); }
                if (cell.type == CellType.EXIT) { d.color('red'); d.center(); }
                if (cell.type == CellType.OBJECT) { d.color('grey'); d.tile(); }
                if (cell.type == CellType.PLAYER) { d.color('white'); d.center(); }
                if (cell.type == CellType.SWITCH) { d.color('pink'); d.center(); }
                if (cell.type == CellType.SLIPPY) { d.color('lightblue'); d.center(); }
                if (cell.type == CellType.TELEPORTER) { d.color('purple'); d.center(); }
                if (cell.type == CellType.DESTRUCTABLE) { d.color('yellow'); d.center(); }

                if (cell.item == CellItem.GEM) { d.color('#00ff00'); d.cross(); }
                if (cell.item == CellItem.BOMB) { d.color('yellow'); d.cross(); }
                if (cell.item == CellItem.FOE) { d.color('blue'); d.cross(); }
                if (cell.item == CellItem.FRIEND) { d.color('lightblue'); d.cross(); }
                if (cell.item == CellItem.SPEED) { d.color('pink'); d.cross(); }
            }
        }

        let inverseTransform = (x: number, y: number): [number, number] =>
            [Math.floor(x / scale / 4), Math.floor(y / scale / 4)];

        return inverseTransform;
    }

    getCell(x: number, y: number): Readonly<Cell> {
        return this.cells[x + y * this.xsize];
    }
};