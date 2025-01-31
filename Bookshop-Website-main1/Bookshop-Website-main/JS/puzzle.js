class Board {
    static instance = null;

    constructor(imgNWIDTH, imgNHeight, rowCols) {
        if (Board.instance) {
            throw new Error("There can be only one board per puzzle");
        }
        Board.instance = this;

        this.rowCols = rowCols;
        this.width = 600;
        this.height = 600;
        this.widthIP = Math.floor(imgNWIDTH / this.rowCols);
        this.heightIP = Math.floor(imgNHeight / this.rowCols);
        this.tileWidth = Math.floor(this.width / this.rowCols);
        this.tileHeight = Math.floor(this.height / this.rowCols);
    }
}

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let board;
let tileImgs = [];
let tileIds = [];
let shuffledIds = [];
const img = new Image();
img.onload = cutImageIntoPieces;
img.src = "/Bookshop-Website-main/puzzleImages/puzzleimg.jpg";

function cutImageIntoPieces() {
    board = new Board(this.naturalWidth, this.naturalHeight, 3);
    canvas.width = board.width;
    canvas.height = board.height;
    canvas.style.position = "absolute";
    canvas.style.top = "12%";
    canvas.style.left = "25%";
    canvas.addEventListener("click", move);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = board.tileWidth;
    tmpCanvas.height = board.tileHeight;
    let tmpCtx = tmpCanvas.getContext("2d");

    for (let row = 0; row < board.rowCols; row++) {
        for (let col = 0; col < board.rowCols; col++) {
            tmpCtx.drawImage(
                this,
                col * board.widthIP,
                row * board.heightIP,
                board.widthIP,
                board.heightIP,
                0,
                0,
                tmpCanvas.width,
                tmpCanvas.height
            );

            tileImgs.push(tmpCanvas.toDataURL());
            let id = row * board.rowCols + col;
            tileIds.push(id);
        }
    }

    shuffleIds();
    drawAllTiles();
}

function shuffleIds() {
    shuffledIds = [...tileIds];
    do {
        shuffledIds.sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffledIds));

    let blank = Math.floor(Math.random() * (board.rowCols * board.rowCols));
    shuffledIds[blank] = -1;
}

function isSolvable(arr) {
    let inversions = 0;
    let tempArr = arr.filter((n) => n !== -1);
    for (let i = 0; i < tempArr.length; i++) {
        for (let j = i + 1; j < tempArr.length; j++) {
            if (tempArr[i] > tempArr[j]) inversions++;
        }
    }
    return inversions % 2 === 0;
}

function drawAllTiles() {
    for (let index = 0; index < shuffledIds.length; index++) {
        if (shuffledIds[index] === -1) continue;
        let coord = getRowColFromIndex(index);
        let x = coord.x;
        let y = coord.y;
        let imgURL = tileImgs[shuffledIds[index]];
        let imgObj = new Image();
        imgObj.onload = function () {
            ctx.drawImage(
                this,
                0,
                0,
                this.width,
                this.height,
                x * board.tileWidth,
                y * board.tileHeight,
                board.tileWidth,
                board.tileHeight
            );
        };
        imgObj.src = imgURL;
    }
}

function getRowColFromIndex(i) {
    let row = Math.floor(i / board.rowCols);
    let col = i % board.rowCols;
    return { x: col, y: row };
}

function move(e) {
    e.preventDefault();
    let coords = getMouseCoords(e.clientX, e.clientY);
    let tileX = coords.x;
    let tileY = coords.y;
    let blankCoords = getRowColFromIndex(findBlankIndex());
    let blankX = blankCoords.x;
    let blankY = blankCoords.y;

    if (!hasBlankNeighbor(tileX, tileY, blankX, blankY)) return;

    const swapDataImage = ctx.getImageData(
        tileX * board.tileWidth,
        tileY * board.tileHeight,
        board.tileWidth,
        board.tileHeight
    );
    ctx.fillRect(
        tileX * board.tileWidth,
        tileY * board.tileHeight,
        board.tileWidth,
        board.tileHeight
    );
    ctx.putImageData(
        swapDataImage,
        blankX * board.tileWidth,
        blankY * board.tileHeight
    );

    const imgIdx = getIndexFromCoords(tileX, tileY);
    const blankIdx = getIndexFromCoords(blankX, blankY);
    swapIndex(imgIdx, blankIdx);

    if (isSolved()) {
        canvas.removeEventListener("click", move);
    }
}

function getMouseCoords(x, y) {
    let offset = canvas.getBoundingClientRect();
    let left = Math.floor(offset.left);
    let top = Math.floor(offset.top);
    let row = Math.floor((x - left) / board.tileWidth);
    let col = Math.floor((y - top) / board.tileHeight);
    return { x: row, y: col };
}

function findBlankIndex() {
    return shuffledIds.indexOf(-1);
}

function hasBlankNeighbor(tileX, tileY, blankX, blankY) {
    return (
        (tileX === blankX && Math.abs(tileY - blankY) === 1) ||
        (tileY === blankY && Math.abs(tileX - blankX) === 1)
    );
}

function getIndexFromCoords(x, y) {
    return y * board.rowCols + x;
}

function swapIndex(imgIdx, blankIdx) {
    shuffledIds[blankIdx] = shuffledIds[imgIdx];
    shuffledIds[imgIdx] = -1;
}

function isSolved() {
    for (let i = 0; i < shuffledIds.length; i++) {
        if (shuffledIds[i] === -1) continue;
        if (shuffledIds[i] !== tileIds[i]) return false;
    }
    showModal();
    return true;
}

// Function to show the modal dynamically
function showModal() {
    // Create modal elements
    const modal = document.createElement("div");
    modal.id = "completion-modal";
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    modalHeader.innerHTML = "<span>Congratulations!</span>";

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    const modalImage = document.createElement("img");
    modalImage.classList.add("modal-image");
    modalImage.src = img.src; // Set the full image source
    modalImage.style.width = "100%"; // Adjust the image width to fit

    const modalMessage = document.createElement("p");
    modalMessage.classList.add("modal-message");
    modalMessage.innerText = "Congratulations! You have completed the puzzle!";

    const closeModalButton = document.createElement("button");
    closeModalButton.classList.add("modal-close-btn");
    closeModalButton.innerText = "Go to Homepage";
    
    // Append elements
    modalBody.appendChild(modalImage);
    modalBody.appendChild(modalMessage);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(closeModalButton);
    modal.appendChild(modalContent);
    
    // Append the modal to the body
    document.body.appendChild(modal);

    // Show the modal
    modal.style.display = "block";

    // Close the modal and redirect to homepage when button is clicked
    closeModalButton.addEventListener("click", () => {
        window.location.href = "homepage_index.html"; // Redirect to homepage
    });
}

function drawLastTile() {
    let blank = findBlankIndex();
    let coords = getRowColFromIndex(blank);
    let x = coords.x;
    let y = coords.y;
    let imgUrl = tileImgs[tileIds[blank]];
    const imgObj = new Image();
    imgObj.onload = function () {
        ctx.drawImage(
            this,
            0,
            0,
            this.width,
            this.height,
            x * board.tileWidth,
            y * board.tileHeight,
            board.tileWidth,
            board.tileHeight
        );
    };
    imgObj.src = imgUrl;
}
