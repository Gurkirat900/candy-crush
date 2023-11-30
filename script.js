console.log('hello');
let candies= ['Red', 'Blue','Green','Purple','Yellow','Orange'];
let rows =9;
let columns =9;
let board=[];
let currTile;
let otherTile;
let score=0;
let Audiosound= new Audio("crushsound.mp3");

window.onload= function(){
    startgame();
    window.setInterval(function(){
        crushCandy();
        slidecandy();
        genratecandy();
    }, 100);
}

function randomCandy(){
    return candies[Math.floor(Math.random() * candies.length)];   // returns a random no. between 0 and 5 and index it to candies
}

function startgame(){
     for(r=0; r<rows; r++){
        let row=[];
        for(c=0; c<columns; c++){
            let tile= document.createElement("img");      // <img>
            tile.id= r.toString() + "-" + c.toString();    // <img id="0-0"> or 0-1...(loop)
            tile.src= "./images/"+ randomCandy() + ".png";

            // DRAGing candies
            tile.addEventListener('dragstart',Dragstart);  // when click  on candy/initialise drag
            tile.addEventListener('dragover', Dragover);   // when we move mouse
            tile.addEventListener('dragenter', Dragenter);  // when we enter in other candy
            tile.addEventListener('dragleave', Dragleave);  // when we are about to leave
            tile.addEventListener('drop', Dragdrop);       // when we drove the candy/release mouse
            tile.addEventListener('dragend', Dragend);    // end result of drag/by default crush the candy
            
            document.getElementById('board').append(tile);
            row.push(tile);
        }
        board.push(row);
     }
}

function Dragstart(){
    currTile=this;        // this is the candy img/tile that we clicked on
}

function Dragover(e){
    e.preventDefault();
}

function Dragenter(e){
    e.preventDefault();
}

function Dragleave(e){
    e.preventDefault();
}

function Dragdrop(){
    otherTile=this;       // this is the target candy we dropped candy on
}

function Dragend(){
    if(currTile.src.includes('blank') || otherTile.src.includes('blank')){
        return;
    }

    let currCods= currTile.id.split('-');   // splits the id= 1-2 in array["1","2"]
    let r= parseInt(currCods[0]);
    let c= parseInt(currCods[1]);

    let otherCods= otherTile.id.split('-');
    let r2= parseInt(otherCods[0]);
    let c2= parseInt(otherCods[1]);

    let moveleft= c2== c-1 && r==r2;
    let moveright= c2== c+1 && r==r2;
    let moveup= r2==r-1 && c2==c;
    let movedown= r2==r+1 && c2==c;
    
    if(moveup || movedown || moveleft || moveright){
        let currImage= currTile.src;
        let otherImage= otherTile.src;
        currTile.src=otherImage;
        otherTile.src=currImage;
        let validity=checkvalid();
        if(!validity){
            let currImage= currTile.src;
            let otherImage= otherTile.src;
            currTile.src=otherImage;
            otherTile.src=currImage;
        }
    }
    
}


function crushCandy(){
    crushfour();
    crushthree();
    crushstriped();
    document.getElementById("score").innerText=score;
   
}


function crushthree(){
    for(r=0; r<rows; r++){              // for 3 candies in a row
        for(c=0; c<columns-2; c++){
            let candy1= board[r][c];
            let candy2= board[r][c+1];
            let candy3= board[r][c+2];
            if(candy1.src==candy2.src && candy2.src==candy3.src && !candy1.src.includes('blank')){
                candy1.src= "./images/blank.png";
                candy2.src= "./images/blank.png";
                candy3.src= "./images/blank.png";
                score+=10;
                Audiosound.play();
               


            }
        }
    }
    for(c=0; c<columns; c++){
        for(r=0; r<rows-2; r++){               // for 3 candies in a column
            let candy1= board[r][c];
            let candy2= board[r+1][c];
            let candy3= board[r+2][c];
            if(candy1.src==candy2.src && candy2.src==candy3.src && !candy1.src.includes('blank')){
                candy1.src= "./images/blank.png";
                candy2.src= "./images/blank.png";
                candy3.src= "./images/blank.png";
                score=score+10;
                Audiosound.play();
            }
        }
    }
  }


  // Helper function to check if three candies form a valid match
function isValidMatch(candy4, candy5, candy6) {
    const color1 = candy4.src.split("/").pop().split(".")[0];
    const color2 = candy5.src.split("/").pop().split(".")[0];
    const color3 = candy6.src.split("/").pop().split(".")[0];

    // Check if three candies have the same color or if one of them is striped
    return (color1 === color2 && color2 === color3) || (color1.includes('-Striped') || color2.includes('-Striped') || color3.includes('-Striped'));
}


function checkvalid(){
    for(r=0; r<rows; r++){              
        for(c=0; c<columns-2; c++){
            let candy1= board[r][c];
            let candy2= board[r][c+1];
            let candy3= board[r][c+2];
            if(candy1.src==candy2.src && candy2.src==candy3.src && !candy1.src.includes('blank')){
                return true;
            }
        }
    }
    for(c=0; c<columns; c++){
        for(r=0; r<rows-2; r++){               
            let candy1= board[r][c];
            let candy2= board[r+1][c];
            let candy3= board[r+2][c];
            if(candy1.src==candy2.src && candy2.src==candy3.src && !candy1.src.includes('blank')){
              return true;
            }
        }
    }
    for (let r = 0; r < rows; r++) {               // check for candies in a row
        for (let c = 0; c < columns - 2; c++) {
            let candy4 = board[r][c];
            let candy5 = board[r][c + 1];
            let candy6 = board[r][c + 2];
            if (isValidMatch(candy4, candy5, candy6)) {
                return true;
            }
        }
    }
    for (let c = 0; c < columns; c++) {                // Check for three candies in a column
        for (let r = 0; r < rows - 2; r++) {
            let candy4 = board[r][c];
            let candy5 = board[r + 1][c];
            let candy6 = board[r + 2][c];
            if (isValidMatch(candy4, candy5, candy6)) {
                return true;
            }
        }
    }
    return false;
}


function slidecandy(){
    for(c=0; c<columns; c++){
        let ind=rows-1;
        for(r=columns-1; r>=0; r--){
            if(!board[r][c].src.includes('blank')){
                board[ind][c].src=board[r][c].src;
                ind=ind-1;
            }
        }
        for(r=ind; r>=0; r--){
            board[r][c].src='./images/blank.png';
        }
    }
}


function genratecandy(){
    for(c=0; c<columns; c++){
        if(board[0][c].src.includes('blank')){
            board[0][c].src= "./images/"+ randomCandy()+ ".png";
        }
    }
}


function crushfour(){
    for(r=0; r<rows; r++){              // for 4 candies in a row replace one by stripped
        for(c=0; c<columns-3; c++){
            let candy1= board[r][c];
            let candy2= board[r][c+1];
            let candy3= board[r][c+2];
            let candy4= board[r][c+3];
            for(let i=0; i<candies.length; i++){
                if(candy1.src==candy2.src && candy2.src==candy3.src && candy3.src==candy4.src && candy1.src.endsWith(candies[i]+".png") && !candy1.src.includes('blank')){
                    candy1.src= "./images/blank.png";
                    candy2.src= "./images/blank.png";
                    candy3.src= "./images/"+candies[i]+"-Vertical-Horizontal.png";
                    candy4.src=  "./images/blank.png";
                    score+=20;
                    Audiosound.play();
                    break;
                }
            }
            
        }
    }
    for(c=0; c<columns; c++){
        for(r=0; r<rows-3; r++){               // for 4 candies in a column replace one by stripped
            let candy1= board[r][c];
            let candy2= board[r+1][c];
            let candy3= board[r+2][c];
            let candy4= board[r+3][c];
            for(let i=0; i<candies.length; i++){
                if(candy1.src==candy2.src && candy2.src==candy3.src && candy3.src==candy4.src && !candy1.src.includes('blank')  && candy1.src.endsWith(candies[i] +".png")){
                    candy1.src= "./images/blank.png";
                    candy2.src= "./images/blank.png";
                    candy3.src= "./images/"+candies[i]+"-Striped-Vertical.png";
                    candy4.src=  "./images/blank.png";
                    score=score+20;
                    Audiosound.play();
                    break;
                }
            }
          

        }
    }
   
  }


  function crushstriped() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candyType1 = candy1.src.split("/").pop().split(".")[0];
            let candyType2 = candy2.src.split("/").pop().split(".")[0];
            let candyType3 = candy3.src.split("/").pop().split(".")[0];

            if (
                (candyType1.includes("-Striped-Horizontal") &&
                    candyType1.replace("-Striped-Horizontal", "") === candyType2 &&
                    candyType1.replace("-Striped-Horizontal", "") === candyType3) ||
                (candyType2.includes("-Striped-Horizontal") &&
                    candyType2.replace("-Striped-Horizontal", "") === candyType1 &&
                    candyType2.replace("-Striped-Horizontal", "") === candyType3) ||
                (candyType3.includes("-Striped-Horizontal") &&
                    candyType3.replace("-Striped-Horizontal", "") === candyType1 &&
                    candyType3.replace("-Striped-Horizontal", "") === candyType2)
            ) {
                // Crush the entire row
                for (let i = 0; i < columns; i++) {
                    board[r][i].src = "./images/blank.png";
                }
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candyType1 = candy1.src.split("/").pop().split(".")[0];
            let candyType2 = candy2.src.split("/").pop().split(".")[0];
            let candyType3 = candy3.src.split("/").pop().split(".")[0];

            if (
                (candyType1.includes("-Striped-Vertical") &&
                    candyType1.replace("-Striped-Vertical", "") === candyType2 &&
                    candyType1.replace("-Striped-Vertical", "") === candyType3) ||
                (candyType2.includes("-Striped-Vertical") &&
                    candyType2.replace("-Striped-Vertical", "") === candyType1 &&
                    candyType2.replace("-Striped-Vertical", "") === candyType3) ||
                (candyType3.includes("-Striped-Vertical") &&
                    candyType3.replace("-Striped-Vertical", "") === candyType1 &&
                    candyType3.replace("-Striped-Vertical", "") === candyType2)
            ) {
                // Crush the entire column
                for (let i = 0; i < rows; i++) {
                    board[i][c].src = "./images/blank.png";
                }
            }
        }
    }
}
