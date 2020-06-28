export class Drawing {
    constructor(private context: CanvasRenderingContext2D, private x: number, private y:number) {
    }
    color(c: string) {
        this.context.fillStyle = c;
        this.context.strokeStyle = c;
    }
    tile() {
        this.context.fillRect(this.x * 4, this.y * 4, 4, 4);
    }
    center() {
        this.context.fillRect(this.x * 4 + 1, this.y * 4 + 1, 2, 2);
    }
    cross() {
        this.context.lineWidth = 0.5;
        this.context.beginPath();
        this.context.moveTo(this.x * 4, this.y * 4);
        this.context.lineTo(this.x * 4 + 4, this.y * 4 + 4);
        this.context.moveTo(this.x * 4, this.y * 4 + 4);
        this.context.lineTo(this.x * 4 + 4, this.y * 4);
        this.context.stroke();
    }
    horiz() {
        this.context.lineWidth = 0.5;
        this.context.beginPath();
        this.context.moveTo(this.x * 4, this.y * 4 + 3);
        this.context.lineTo(this.x * 4 + 4, this.y * 4 + 3);
        this.context.moveTo(this.x * 4, this.y * 4 + 1);
        this.context.lineTo(this.x * 4 + 4, this.y * 4 + 1);
        this.context.stroke();
    }
    vert() {
        this.context.lineWidth = 0.5;
        this.context.beginPath();
        this.context.moveTo(this.x * 4 + 3, this.y * 4);
        this.context.lineTo(this.x * 4 + 3, this.y * 4 + 4);
        this.context.moveTo(this.x * 4 + 1, this.y * 4);
        this.context.lineTo(this.x * 4 + 1, this.y * 4 + 4);
        this.context.stroke();
    }
}