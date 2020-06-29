// Game code

let winlinePositions = ["top", "center", "bottom"];
let symbols = ["3xBAR", "BAR", "2xBAR", "7", "Cherry"];
let reelRowSymbols = [];
let reelCount = 3;
let reelItems = [];
let spinning = [false, false, false];
let spinInterval = null;
let reelStartingPoses = [];
let rollingSpeed = 5;
let TopLineMin = -5, TopLineMax = 5;
let CenterLineMin = 125, CenterLineMax = 135;
let BottomLineMin = 255, BottomLineMax = 265;

let RePosTopLineMin = -15, RePosTopLineMax = 15;
let RePosCenterLineMin = 115, RePosCenterLineMax = 145;
let RePosBottomLineMin = 245, RePosBottomLineMax = 275;

let balanceElement = document.querySelector("#balance");
let reelRow = [
    document.querySelector("#reel-row-1"),
    document.querySelector("#reel-row-2"),
    document.querySelector("#reel-row-3")
];
let reelWinningLines = [
    document.querySelector('#winline-top'),
    document.querySelector('#winline-center'),
    document.querySelector('#winline-bottom')
];

let spinBtn = document.querySelector("#spin-btn");
let paytableCherryTopLine = document.querySelector("#paytable-cherries-top");
let paytableCherryCenterLine = document.querySelector("#paytable-cherries-center");
let paytableCherryBottomLine = document.querySelector("#paytable-cherries-bottom");
let paytableSevenAnyLine = document.querySelector("#paytable-seven-any");
let paytableSevenOrCherryAnyLine = document.querySelector("#paytable-seven-or-cherry-any");
let paytableThreeBarAnyLine = document.querySelector("#paytable-threebar-any");
let paytableTwoBarAnyLine = document.querySelector("#paytable-twobar-any");
let paytableBarAnyLine = document.querySelector("#paytable-bar-any");
let paytableAnyBarAnyLine = document.querySelector("#paytable-anybar-any");

let winningPotCherryTopLine = 2000;
let winningPotCherryCenterLine = 1000;
let winningPotCherryBottomLine = 4000;
let winningPotSevenAnyLine = 150;
let winningPotSevenOrCherryAnyLine = 75;
let winningPotThreeBarAnyLine = 50;
let winningPotTwoBarAnyLine = 20;
let winningPotBarAnyLine = 10;
let winningPotAnyBarAnyLine = 5;

spinBtn.addEventListener("click", function() { StartSpinningReels(); });

balanceElement.addEventListener("input", () => {
    if(parseInt(balanceElement.value) < 1) {
        balanceElement.value = 1;
    } else if(parseInt(balanceElement.value) > 5000) {
        balanceElement.value = 5000;
    }
});

function StartSpinningReels() {
    if(IsSpinning()) {
        return;
    }
    if(IsNotEnoughMoneyToSpin()) {
        alert("You do not have enough money to spin!");
        return;
    }

    RePositionReelItems();
    AddSumToBalance(-1);
    StartRollingReels();
    DisableSpinButtonVisually();
}

function IsNotEnoughMoneyToSpin() {
    return (parseInt(balanceElement.value) < 1);
}

function RePositionReelItems() {
    for(let reel = 0; reel < reelCount; reel++) {
        RePositionSpecificReelItems(reel);
    }
}

function RePositionSpecificReelItems(reel) {
    for(let i = 0, reelItem; reelItem = reelItems[reel][i]; i++) {
        if(IsReelItemOnLineRange(reelItem, "top")) {
            reelItem.style.top = "0px";
        } else if(IsReelItemOnLineRange(reelItem, "center")) {
            reelItem.style.top = "130px";
        } else if(IsReelItemOnLineRange(reelItem, "bottom")) {
            reelItem.style.top = "260px";
        }
    }
}

function IsSpinning() {
    return (spinInterval !== null);
}

function GetRollingTime(initialTime) {
    let rollingTimes = [-26, 0, 26]; // 26 is the value of 130px which is 1 symbol height / rollingSpeed which is 5
    let rollingTime = GetRandomArbitrary(0, rollingTimes.length);
    return initialTime + rollingTimes[rollingTime];
}

function StartRollingReels() {
    spinning = [
        GetRollingTime(206), 
        GetRollingTime(258), 
        GetRollingTime(309)
    ];
    spinInterval = setInterval(function() { RollReels() }, 10);
}

function DisableSpinButtonVisually() {
    spinBtn.classList.add("disabled");
}

function RandomlyAssembleReels() {
    reelStartingSymbols = [];
    reelLinePositions = [];

    for(let r = 0; r < reelCount; r++) {
        reelStartingSymbols[r] = GetRandomSymbol();
        reelLinePositions[r] = GetRandomArbitrary(0,2);

        for(let w = 0; w <= winlinePositions.length; w++) {
            if(reelRowSymbols[r] === undefined) {
                reelRowSymbols[r] = [];
            }

            if(reelLinePositions[r] == w || reelLinePositions[r]+2 == w) {
                reelRowSymbols[r].push(GetNextSymbolForReel(r));
            } else {
                reelRowSymbols[r].push(-1);
            }
        }
    }
    
    RenderStartingReels();
}

function GetNextSymbolForReel(reel) {
    reelStartingSymbols[reel] ++;
    
    if(reelStartingSymbols[reel] >= symbols.length) {
        reelStartingSymbols[reel] = 0;
    }

    return reelStartingSymbols[reel];
}

function RenderStartingReels() {
    for(let r = 0; r < reelCount; r++) {
        CreateReelElementOnTop(r);

        for(let w = 1; w <= winlinePositions.length; w++) {
            if(reelRowSymbols[r][w] == -1) {
               continue; 
            }

            let reelItem = CreateReelElement(reelRowSymbols[r][w], r);
            reelItem.style.top = (w-1)*130+"px";

            if(w == winlinePositions.length) {
                reelItem.setAttribute("data-created", 1); // Because we create CreateReelElementOnTop above
            }
        }
    }

    ClearReelLinePositions();
}

function ClearReelLinePositions() {
    for(let i = 0; i < reelCount; i++) {
        reelLinePositions[reel] = 0;
    }
}

function CreateReelElement(symbol, reel) {
    let ReelItem = document.createElement("div");
    ReelItem.classList.add("reel-item");

    let ReelImg = document.createElement("img");
    ReelImg.src = `./images/${symbols[symbol]}.png`;

    ReelItem.setAttribute("data-reel", reel);
    ReelItem.setAttribute("data-symbol", symbol);
    ReelItem.setAttribute("data-created", 0);
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
    let reelItem = CreateReelElement(GetNextSymbolForReel(reel), reel);

    if(reelLinePositions[reel] == 1) {
        reelItem.style.top = "-260px";
    } else {
        reelItem.style.top = "-130px";
    }
}

function CreateReelElementOnReel(reel, topValue) {
    let reelItem = CreateReelElement(GetNextSymbolForReel(reel), reel);
    reelItem.style.top = topValue+"px";
}

function IsReelItemOnLine(reelItem, line) {
    let topMin = GetLineMin(line);
    let topMax = GetLineMax(line);
    let topValue = parseInt(reelItem.style.top.replace("px", ""));

    if(topValue >= topMin && topValue <= topMax) {
        return true;
    }
    return false;
}

function IsReelItemOnLineRange(reelItem, line) {
    let topMin = GetLineRangeMin(line);
    let topMax = GetLineRangeMax(line);
    let topValue = parseInt(reelItem.style.top.replace("px", ""));

    if(topValue >= topMin && topValue <= topMax) {
        return true;
    }
    return false;
}

function Init() {
    AddEventListenersToModeSelection();
    AddEventListenersToDebugSymbolSelectTags();
    AddEventListenersToDebugPositionSelectTags();
    InitDebugValues();
    ClearAllReelItems();
    RandomlyAssembleReels();
}

function GetRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function RollReels() {
    let removeIndex = [];
    let removedFromReels = [];

    for(let reel = 0; reel < reelCount; reel++) {
        for(let i = 0, reelItem; reelItem = reelItems[reel][i]; i++) {
            if(spinning[reelItem.dataset.reel]) {
                let topValue = parseInt(reelItem.style.top.replace("px", "")) + rollingSpeed;
    
                if(topValue == 260) {
                    reelItem.setAttribute("data-created", 1);
                    CreateReelElementOnReel(reelItem.dataset.reel, -260);
                } else if(topValue == 265 && reelItem.dataset.created == 0) { // Sometimes when spinning stopped and re-spinned then above condition statement didn't fire. This is failover.
                    reelItem.setAttribute("data-created", 1);
                    CreateReelElementOnReel(reelItem.dataset.reel, -255);
                } else if(topValue == 385) {
                    reelItem.style.display = "none";
                    removeIndex.push(i);
                    removedFromReels.push(reelItem.dataset.reel);
                    reelItem.parentNode.removeChild(reelItem);
                    continue;
                }
    
                reelItem.style.top = topValue+"px";
            }
        }
        
        if(spinning[reel] > 0) {
            spinning[reel]--;

            if(activeMode == "fixed" && spinning[reel] == 0) {
                if(!CheckSymbolOnReelAndLine(reel, reelActivePositions[reel], reelActiveSymbols[reel])) {
                    AddSpinningTimeToAllReelsNotFixed(reel); // Keep spinning until correct symbol is in position
                }
            }

            if(spinning[reel] == 0) {
                RePositionSpecificReelItems(reel);
            }
        }
    }

    for(let j = 0; j < removeIndex.length; j++) {
        reelItems[removedFromReels[j]].splice(removeIndex[j], 1);
    }
    
    if(!spinning[reelCount-1]) {
        clearTimeout(spinInterval);
        spinInterval = null;
    }

    let reelStopped = 0;
    for(let x = 0; x < reelCount; x++) {
        if(spinning[x] <= 0) {
            reelStopped++;
        }
    }

    if(reelStopped >= reelCount) {
        RePositionReelItems();
        CheckReelsForWinnings();
    }
}

function AddSpinningTimeToAllReelsNotFixed(reel) {
    for(let i = reel; i < spinning.length; i++) {
        spinning[i]++;
    }
}

function AddSumToBalance(sum) {
    balanceElement.value = parseInt(balanceElement.value) + sum;
}

function EnableSpinButton() {
    spinBtn.classList.remove("disabled");
}

function CheckReelsForWinnings() {
    EnableSpinButton();

    if(ThreeCherrysOnTopLine()) {
        BlinkPaytableItem(paytableCherryTopLine, winningPotCherryTopLine);
    }
    if(ThreeCherrysOnCenterLine()) {
        BlinkPaytableItem(paytableCherryCenterLine, winningPotCherryCenterLine);
    }
    if(ThreeCherrysOnBottomLine()) {
        BlinkPaytableItem(paytableCherryBottomLine, winningPotCherryBottomLine);
    }
    if(SevensOnAnyLine()) {
        BlinkPaytableItem(paytableSevenAnyLine, winningPotSevenAnyLine);
    }
    if(ThreeXBarsOnAnyLine()) {
        BlinkPaytableItem(paytableThreeBarAnyLine, winningPotThreeBarAnyLine);
    }
    if(TwoXBarsOnAnyLine()) {
        BlinkPaytableItem(paytableTwoBarAnyLine, winningPotTwoBarAnyLine);
    }
    if(BarsOnAnyLine()) {
        BlinkPaytableItem(paytableBarAnyLine, winningPotBarAnyLine);
    }
    if(CherriesOrSevensCombinedOnAnyLine()) {
        BlinkPaytableItem(paytableSevenOrCherryAnyLine, winningPotSevenOrCherryAnyLine);
    }
    if(AnykindOfBarsCombinedOnAnyLine()) {
        BlinkPaytableItem(paytableAnyBarAnyLine, winningPotAnyBarAnyLine);
    }
}

function BlinkPaytableItem(paytableElement, winningPot) {
    paytableElement.classList.add("blink");
    AddSumToBalance(winningPot);
    setTimeout(function() {
        paytableElement.classList.remove("blink");
    }, 2000);
}

function ThreeCherrysOnTopLine() {
    return CheckSymbolsOnLine("top", "Cherry");
}
function ThreeCherrysOnCenterLine() {
    return CheckSymbolsOnLine("center", "Cherry");
}
function ThreeCherrysOnBottomLine() {
    return CheckSymbolsOnLine("bottom", "Cherry");
}

function SevensOnAnyLine() {
    return (CheckSymbolsOnLine("top", "7") || 
            CheckSymbolsOnLine("center", "7") ||
            CheckSymbolsOnLine("bottom", "7"));
}
function ThreeXBarsOnAnyLine() {
    return (CheckSymbolsOnLine("top", "3xBAR") || 
            CheckSymbolsOnLine("center", "3xBAR") ||
            CheckSymbolsOnLine("bottom", "3xBAR"));
}
function TwoXBarsOnAnyLine() {
    return (CheckSymbolsOnLine("top", "2xBAR") || 
            CheckSymbolsOnLine("center", "2xBAR") ||
            CheckSymbolsOnLine("bottom", "2xBAR"));
}
function BarsOnAnyLine() {
    return (CheckSymbolsOnLine("top", "BAR") || 
            CheckSymbolsOnLine("center", "BAR") ||
            CheckSymbolsOnLine("bottom", "BAR"));
}
function CherriesOrSevensCombinedOnAnyLine() {
    return (CheckSymbolsOnLine("top", ["Cherry", "7"], true) || 
            CheckSymbolsOnLine("center", ["Cherry", "7"], true) ||
            CheckSymbolsOnLine("bottom", ["Cherry", "7"], true));
}
function AnykindOfBarsCombinedOnAnyLine() {
    return (CheckSymbolsOnLine("top", ["BAR", "2xBAR", "3xBAR"]) || 
            CheckSymbolsOnLine("center", ["BAR", "2xBAR", "3xBAR"]) ||
            CheckSymbolsOnLine("bottom", ["BAR", "2xBAR", "3xBAR"]));
}

function GetLineMin(line) {
    switch(line) {
        case "top": return TopLineMin;
        case "center": return CenterLineMin;
        case "bottom": return BottomLineMin;
    }
    return 0;
}

function GetLineMax(line) {
    switch(line) {
        case "top": return TopLineMax;
        case "center": return CenterLineMax;
        case "bottom": return BottomLineMax;
    }
    return 0;
}

function GetLineRangeMin(line) {
    switch(line) {
        case "top": return RePosTopLineMin;
        case "center": return RePosCenterLineMin;
        case "bottom": return RePosBottomLineMin;
    }
    return 0;
}

function GetLineRangeMax(line) {
    switch(line) {
        case "top": return RePosTopLineMax;
        case "center": return RePosCenterLineMax;
        case "bottom": return RePosBottomLineMax;
    }
    return 0;
}

function GetLineIndex(line) {
    switch(line) {
        case "top": return 0;
        case "center": return 1;
        case "bottom": return 2;
    }
    return 0;
}

function IsReelUnChecked(reelsChecked, reel) {
    return (!reelsChecked.includes(reel));
}

function SymbolIsInSelectedSymbols(symbol, symbols) {
    return (symbols.includes(parseInt(symbol)));
}

function CheckSymbolsOnLine(line, symbolStrs, allRequired) {
    let symbolsOnLine = 0;
    let reelsChecked = [];
    let symbolIndexes = [];
    let symbolCounts = [];
    let multiValues = false;

    if(typeof symbolStrs === 'string' || symbolStrs instanceof String) {
        symbolIndexes.push(symbols.indexOf(symbolStrs));
    } else {
        multiValues = true;

        for(let s = 0, symbol; symbol = symbolStrs[s]; s++) {
            let indexOfSymbol = symbols.indexOf(symbol);
            symbolIndexes.push(indexOfSymbol);
            symbolCounts[indexOfSymbol] = 0;
        }
    }

    for(let r = 0; r < reelCount; r++) {
        for(let i = 0, reelItem; reelItem = reelItems[r][i]; i++) {
            if(IsReelUnChecked(reelsChecked, reelItem.dataset.reel) && 
                SymbolIsInSelectedSymbols(reelItem.dataset.symbol, symbolIndexes) &&
                IsReelItemOnLine(reelItem, line)) 
            {
                if(multiValues) {
                    symbolCounts[parseInt(reelItem.dataset.symbol)]++;
                }

                reelsChecked.push(reelItem.dataset.reel);
                symbolsOnLine++;

                if(symbolsOnLine == reelCount) {
                    StartBlinkingReel(GetLineIndex(line));
                    break;
                }
            }
        }
    }

    if(multiValues) {
        if(allRequired) { // as for example cherrys and 7 both need to exist on line
            for(let i = 0; i < symbolCounts.length; i++) {
                if(symbolCounts[i] == 0) {
                    return false; // Note all symbols got hit.
                }
            }
        } else { // as for example any kind of bar combination
            let occurences = 0;

            for(let i = 0; i < symbolCounts.length; i++) {
                if(symbolCounts[i] > 0) {
                    occurences++;
                }
            }

            if(occurences <= 1) { // <= 1 because in this case only 1 symbol was on line, but we seek multiple symbols on 1 line
                return false;
            }
        }
    }

    return (symbolsOnLine == reelCount);
}

function StartBlinkingReel(line) {
    if(!reelWinningLines[line].classList.contains("blink")) {
        reelWinningLines[line].classList.add("blink");

        setTimeout(function() {
            reelWinningLines[line].classList.remove("blink");
        }, 2000);
    }
}

function ClearAllReelItems() {
    let rItems = document.querySelectorAll(".reel-item");

    for(let r = 0; r < reelCount; r++) {
        reelItems[r] = [];
    }

    for(let i = 0, rItem; rItem = rItems[i]; i++) {
        rItem.remove();
    }
}

// Debug area

let activeMode = document.querySelector('[name=mode]:checked').value;
let modeRadiobuttonRandom = document.querySelector("#random");
let modeRadiobuttonFixed = document.querySelector("#fixed");

let debugSymbolReels = [
    document.querySelector("#symbol-reel-1"),
    document.querySelector("#symbol-reel-2"),
    document.querySelector("#symbol-reel-3")
];

let debugSymbolReelPositions = [
    document.querySelector("#symbol-reel-1-position"),
    document.querySelector("#symbol-reel-2-position"),
    document.querySelector("#symbol-reel-3-position")
];

let reelActiveSymbols = []; // index 0 = reel 1, index 1 = reel 2... value is array symbols index
let reelActivePositions = []; // index 0 = reel 1 position, index 1 = reel 2 position

function InitDebugValues() {
    for(let i = 0; i < debugSymbolReels.length; i++) {
        reelActiveSymbols.push(parseInt(debugSymbolReels[i].value));
    }
    for(let i = 0; i < debugSymbolReelPositions.length; i++) {
        reelActivePositions.push(debugSymbolReelPositions[i].value);
    }
}

function AddEventListenersToModeSelection() {
    modeRadiobuttonRandom.addEventListener("click", () => { activeMode = modeRadiobuttonRandom.value; });
    modeRadiobuttonFixed.addEventListener("click", () => { activeMode = modeRadiobuttonFixed.value; });
}

function AddEventListenersToDebugSymbolSelectTags() {
    for(let i = 0, symbolSelect; symbolSelect = debugSymbolReels[i]; i++) {
        symbolSelect.addEventListener("change", () => {
            reelActiveSymbols[i] = parseInt(symbolSelect.value);
        });
    }
}

function AddEventListenersToDebugPositionSelectTags() {
    for(let i = 0, positionSelect; positionSelect = debugSymbolReelPositions[i]; i++) {
        positionSelect.addEventListener("change", () => {
            reelActivePositions[i] = positionSelect.value;
        });
    }
}

function CheckSymbolOnReelAndLine(reel, line, symbolIndex) {
    for(let i = 0, reelItem; reelItem = reelItems[reel][i]; i++) {
        if(symbolIndex == parseInt(reelItem.dataset.symbol) && IsReelItemOnLine(reelItem, line)) {
            return true;
        }
    }

    return false;
}

Init();

// Progressive Web App

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('https://caupo.ee/slotmachine/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = 'block';

    addBtn.addEventListener('click', (e) => {
      addBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });