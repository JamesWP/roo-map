import { Drawing } from "./drawing";

enum CellType {
    NOTHING = 0,
    FLOOR = 1,
    STICKEY = 2,
    PLAYER = 3,
    EXIT = 4,
    EAST_STAIR = 5,
    NORTH_STAIR = 6,
    WEST_STAIR = 7,
    SOUTH_STAIR = 8,
    LIFT = 9, // uses data, target height
    LIFT_NS = 10,
    LIFT_EW = 11,
    BREAKABLE = 13, // 0==refresh, 1==forever
    JUMPER= 14, // uses data, target height
    TELEPORTER = 15,
    SLIDE = 16, // 0==north, 3==east, 4==south, 1==west
    SWITCH = 17,
    BRIDGE_NS = 18, // uses data, linked switch
    BRIDGE_EW = 19, // uses data, linked switch
    SLIPPY = 21,
    OBJECT = 22,
    DESTRUCTABLE = 23
};
enum CellItem { 
    NOTHING = 0, 
    GEM = 1, 
    FOE = 2, // uses data 4==clever, 3==greedy, 1==reaceexit
    THROE = 3, // uses data 5==friend
    PARACHUTE = 5,
    TIME = 6, 
    LIFE = 7, 
    FREEZE = 8, 
    BOMB = 9, 
    SPEED = 10, 
    PROTECTION = 13,
    SPAWNER = 100, // uses data somehow
    SURPRISE = 255 
};

export class Cell {
    constructor(private _data: Uint8Array) { }

    get height(): number { return this._data[0]; }
    get type(): number { return this._data[1]; }
    get thing(): number { return this._data[2]; }
    get item(): number { return this._data[3]; }

    get data(): Readonly<Uint8Array> { return this._data; }

    get text(): string {
        return `height=${this.height}, type=${CellType[this.type]}, item=${CellItem[this.item]}, thing=${this.thing}, data=${this.data}`;
    }
};

export class ParsedLevel {
    public xsize: number;
    public ysize: number;
    public cells: Cell[] = new Array();
    public timeGiven: number;
    public gemsRequired: number;


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
                if (cell.type == CellType.LIFT_EW) { d.color('blue'); d.horiz(); }
                if (cell.type == CellType.LIFT_NS) { d.color('blue'); d.vert(); }
                if (cell.type == CellType.EXIT) { d.color('red'); d.center(); }
                if (cell.type == CellType.OBJECT) { d.color('grey'); d.tile(); }
                if (cell.type == CellType.PLAYER) { d.color('orange'); d.center(); }
                if (cell.type == CellType.SWITCH) { d.color('pink'); d.center(); }
                if (cell.type == CellType.SLIPPY) { d.color('lightblue'); d.center(); }
                if (cell.type == CellType.TELEPORTER) { d.color('purple'); d.center(); }
                if (cell.type == CellType.DESTRUCTABLE) { d.color('yellow'); d.center(); }
                if (cell.type == CellType.BREAKABLE) { d.color('white'); d.center(); }
                if (cell.type == CellType.STICKEY) { d.color('orange'); d.hash(); }
                if (cell.type == CellType.BRIDGE_EW) { d.color('orange'); d.horiz(); }
                if (cell.type == CellType.BRIDGE_NS) { d.color('orange'); d.vert(); }
                if (cell.type == CellType.LIFT) { d.color('pink'); d.hash(); }
                if (cell.type == CellType.JUMPER) { d.color('pink'); d.hash(); }

                switch(cell.item) {
                    case CellItem.GEM: d.color('#00ff00'); break;
                    case CellItem.BOMB: d.color('yellow'); break;
                    case CellItem.FOE: d.color('blue'); break;
                    case CellItem.THROE: d.color('lightblue'); break;
                    case CellItem.LIFE: d.color('pink'); break;
                    case CellItem.TIME: d.color('lightyellow'); break;
                    case CellItem.FREEZE: d.color('lightyellow'); break;
                    case CellItem.SPEED: d.color('lightyellow'); break;
                    case CellItem.PARACHUTE: d.color('lightyellow'); break;
                    case CellItem.PROTECTION: d.color('lightyellow'); break;
                    case CellItem.SPAWNER: d.color('lightyellow'); break;
                    case CellItem.SURPRISE: d.color('lightyellow'); break;
                }
                
                switch(cell.item) {
                    case CellItem.GEM:
                    case CellItem.BOMB:
                    case CellItem.FOE:
                    case CellItem.THROE:
                    case CellItem.LIFE:
                    case CellItem.TIME:
                    case CellItem.FREEZE:
                    case CellItem.SPEED:
                    case CellItem.PARACHUTE:
                    case CellItem.PROTECTION:
                    case CellItem.SPAWNER:
                    case CellItem.SURPRISE:
                        d.cross();
                        break;
                    case CellItem.NOTHING:
                        break;
                    default:
                        if(cell.type != CellType.NOTHING) {
                            d.question();
                        }
                }  
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