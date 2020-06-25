let activeMode = "random";
let winlinePositions = ["top", "center", "bottom"];
let symbols = ["cherry", "7", "BAR", "2xBAR", "3xBAR"];
let reelRowSymbols = [];
let reelCount = 3;
let reelRow = [
    document.querySelector("#reel-row-1"),
    document.querySelector("#reel-row-2"),
    document.querySelector("#reel-row-3")
];
let reelItems = [];
let spinning = [false, false, false];
let spinBtn = document.querySelector("#spin-btn");
let spinInterval = null;

spinBtn.addEventListener("click", function() {
    if(spinInterval !== null) {
        return;
    }

    Init();
    spinning = [206, 258, 309];
    spinInterval = setInterval(function() { RollReels() }, 10);
});

function RandomlyAssembleReels() {
    for(let r = 0; r < reelCount; r++) {
        for(let w = 0; w <= winlinePositions.length; w++) {
            if(reelRowSymbols[r] === undefined) {
                reelRowSymbols[r] = [];
            }
            reelRowSymbols[r].push(GetRandomSymbol());
        }
    }
    
    RenderStartingReels();
}

function RenderStartingReels() {
    for(let r = 0; r < reelCount; r++) {
        let reelItem = CreateReelElement(reelRowSymbols[r][0], r);
        reelItem.style.top = "-130px";

        for(let w = 1; w <= winlinePositions.length; w++) {
            let reelItem = CreateReelElement(reelRowSymbols[r][w], r);
            reelItem.style.top = (w-1)*130+"px";
        }
    }
}

function CreateReelElement(symbol, reel) {
    let ReelItem = document.createElement("div");
    ReelItem.classList.add("reel-item");

    let ReelImg = document.createElement("img");
    ReelImg.src = `./images/${symbols[symbol]}.png`;

    ReelItem.setAttribute("data-reel", reel);
    ReelItem.appendChild(ReelImg);

    if(reelItems[reel] === undefined) {
        reelItems[reel] = [];
    }

    reelItems[reel].push(ReelItem);
    reelRow[reel].appendChild(ReelItem);
    return ReelItem;
}

function GetRandomSymbol() {
    return GetRandomArbitrary(0, symbols.length);
}

function CreateReelElementOnTop(reel) {
    let reelItem = CreateReelElement(GetRandomSymbol(), reel);
    reelItem.style.top = "-130px";
}

function Init() {
    ClearAllReelItems();
    RandomlyAssembleReels();
}

function GetRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function RollReels() {
    console.log("RollReels");
    let removeIndex = [];
    let removedFromReels = [];

    for(let reel = 0; reel < reelCount; reel++) {
        for(let i = 0, reelItem; reelItem = reelItems[reel][i]; i++) {
            if(reelItem.parentNode == null) {
                continue;
            }
    
            if(spinning[reelItem.dataset.reel]) {
                let topValue = parseInt(reelItem.style.top.replace("px", "")) + 5;
    
                if(topValue >= 385) {
                    removeIndex.push(i);
                    removedFromReels.push(reelItem.dataset.reel);
                    reelItem.style.display = "none";
                    reelItem.parentNode.removeChild(reelItem);
                    continue;
                }
    
                reelItem.style.top = topValue+"px";
            }
        }
        
        if(spinning[reel] > 0) {
            spinning[reel]--;
        }
    }

    for(let j = 0; j < removeIndex.length; j++) {
        reelItems[removedFromReels[j]].splice(removeIndex[j], 1);
        CreateReelElementOnTop(removedFromReels[j]);
    }
    
    if(!spinning[reelCount-1]) {
        clearTimeout(spinInterval);
        spinInterval = null;
    }
}

function ClearAllReelItems() {
    let rItems = document.querySelectorAll(".reel-item");

    for(let i = 0, rItem; rItem = rItems[i]; i++) {
        rItem.remove();
    }
}

Init();