import { addFile } from "./level";

window.addEventListener('load', main);

let dropEl = document.createElement('div');
let dropInfoEl = document.createElement('div');

function main(): void {
    dropEl.addEventListener("dragover", FileDragHover, false);
    dropEl.addEventListener("dragleave", FileDragHover, false);
    dropEl.addEventListener("drop", FileSelectHandler, false);
    dropEl.style.backgroundColor = '#fafafa';
    dropEl.style.border = '1px solid #999999';
    dropEl.style.width = '100px';
    dropEl.style.height = '100px';
    document.body.appendChild(dropEl);

    document.body.appendChild(dropInfoEl);
}

function FileDragHover(e: UIEvent) {
    e.stopPropagation();
    e.preventDefault();
}

function FileSelectHandler(e: DragEvent) {

    // cancel event and hover styling
    FileDragHover(e);

    let target = e.target as HTMLElement;

    // fetch FileList object
    let files = e.dataTransfer.files;

    dropInfoEl.innerHTML = "";

    // process all File objects
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        ParseFile(f);
    }
}

function ParseFile(file: File) {
    let fileEl = document.createElement('div');
    addFile(fileEl, file);
    dropInfoEl.appendChild(fileEl);
}