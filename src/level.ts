import { ParsedLevel, Cell } from "./data";

export function addFile(parentElement: HTMLElement, levelFile: File) {
    let ren = new LevelFileRenderer(levelFile);
    ren.createElement().then((el) => parentElement.appendChild(el));
}

class LevelFileRenderer {
    public name: string;
    public size: number;
    public level: Promise<ParsedLevel>;

    constructor(levelFile: File) {
        this.name = levelFile.name;
        this.size = levelFile.size;

        this.level = parseLevel(levelFile.stream());
    }

    async createElement(): Promise<HTMLElement> {
        let fileEl = document.createElement('div');
        fileEl.innerHTML = `<br/>File information: name <strong> ${this.name} </strong> `;
        fileEl.innerHTML += `size <strong> ${this.size} bytes</strong> `;

        let parsedLevel = await this.level;

        fileEl.innerHTML += `<strong>${parsedLevel.xsize}</strong> x `;
        fileEl.innerHTML += `<strong>${parsedLevel.ysize}</strong> `;


        fileEl.innerHTML += `<strong>${parsedLevel.numGems}</strong> gems`;

        let canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        canvas.style.border = '1px solid #111111';
        canvas.style.display = 'block';

        let context = canvas.getContext('2d');
        parsedLevel.renderTo(context);

        fileEl.appendChild(canvas);

        return fileEl;
    }
}

class LevelTransformStream {
    private loadingLevel: ParsedLevel;

    private numcells = 0;

    private buffer = new ArrayBuffer(0);
    public done = false;

    constructor() {
        let transformer = this;
        this.loadingLevel = new ParsedLevel();
    }

    addData(uint8array: Uint8Array) {
        let newbuffer = new ArrayBuffer(this.buffer.byteLength + uint8array.length);
        let newarray = new Uint8Array(newbuffer);

        newarray.set(new Uint8Array(this.buffer), 0);
        newarray.set(uint8array, this.buffer.byteLength);

        this.buffer = newbuffer;
    }

    complete() {
        let view = new DataView(this.buffer);
        let position = 0;

        this.done = true;
        this.level.xsize = view.getUint8(position);
        this.level.ysize = view.getUint8(position + 1);

        position += 2;

        for (let x = 0; x < this.level.xsize; x++) {
            for (let y = 0; y < this.level.ysize; y++) {
                this.level.cells[x + y * this.level.xsize] = new Cell(new Uint8Array(this.buffer).slice(position, position + 4));
                position += 4;
            }
        }
    }

    get level(): ParsedLevel { return this.loadingLevel; }
}

async function parseLevel(stream: ReadableStream): Promise<ParsedLevel> {
    let reader = stream.getReader();

    let loader = new LevelTransformStream();

    while (true) {
        let data = await reader.read();

        if (data.value) {
            loader.addData(data.value);
        }

        if (data.done || loader.done) {
            loader.complete();
            break;
        }
    }

    return loader.level;
}