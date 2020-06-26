
export class Cell {
    constructor(private data: Uint8Array) { }
    get isGem(): boolean {
        return this.data[3] == 1;
    }
    get isFloor(): boolean {
        return this.data[0] != 0;
    }
    get height(): number {
        return this.data[0];
    }
};

export class ParsedLevel {
    public xsize: number;
    public ysize: number;
    public cells: Cell[] = new Array();


    get numGems(): number {
        let total = 0;
        this.cells.forEach((c) => total += c.isGem ? 1 : 0);
        return total;
    }

    renderTo(context: CanvasRenderingContext2D): void {
        let xscale = context.canvas.width / this.xsize;
        let yscale = context.canvas.height / this.ysize;

        let scale = Math.min(xscale, yscale) / 4;

        context.scale(scale, scale);

        for (let x = 0; x < this.xsize; x++) {
            for (let y = 0; y < this.ysize; y++) {
                let cell = this.cells[x + y * this.xsize];
                if (cell.isFloor) {
                    let lum = 40 - cell.height;
                    context.fillStyle = `hsl(23, 60%, ${lum}%)`;
                    context.globalAlpha = 1.0;
                    context.fillRect(x * 4, y * 4, 4, 4);
                }
                if (cell.isGem) {
                    context.fillStyle = 'lightgreen';
                    context.globalAlpha = 1.0;
                    context.fillRect(x * 4 + 1, y * 4 + 1, 2, 2);
                }
            }
        }
    }

};