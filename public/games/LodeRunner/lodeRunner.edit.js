let emptyTile, actTile;
let cursorTileObj;
let editMap;
	
const MAX_EDIT_GUARD = 5;     //maximum number of guards
const EMPTY_ID = 0, GUARD_ID = 8, RUNNER_ID = 9;

//value | Character | Type
//------+-----------+-----------
//  0x0 |  <space>  | Empty space
//  0x1 |     #     | Normal Brick
//  0x2 |     @     | Solid Brick
//  0x3 |     H     | Ladder
//  0x4 |     -     | Hand-to-hand bar (Line of rope)
//  0x5 |     X     | False brick
//  0x6 |     S     | Ladder appears at end of level
//  0x7 |     $     | Gold chest
//  0x8 |     0     | Guard
//  0x9 |     &     | Player

const tileInfo = [
	[ "eraser",   ' ' ], //(0), empty
	[ "brick",    '#' ], //(1)
	[ "solid",    '@' ], //(2)
	[ "ladder",   'H' ], //(3)
	[ "rope",     '-' ], //(4)
	[ "trapBrick",'X' ], //(5)
	[ "hladder",  'S' ], //(6)
	[ "gold",     '$' ], //(7)
	[ "guard1",   '0' ], //(8)
	[ "runner1",  '&' ]  //(9)
];

const baseTile=[];	
let lastRunner = null;
let lastGuardList = [];	
let editBorder;
const testLevelInfo = {level: -1};

function startEditMode() 
{
	mainStage.removeAllChildren();

	document.onkeydown = editHandleKeyDown;
	

	setEditSelectMenu();
	
	canvasEditReSize();
	createBaseTile();
	createEditMap();
	startEditTicker();
	setButtonState();
}

function setEditSelectMenu()
{
	if(editLevels>0)selectIconObj.enable(); 
	else selectIconObj.disable(1);
}

function back2EditMode(rc)
{
	if(rc == 1) {
		testLevelInfo.pass = 1;
		setTestLevel(testLevelInfo);
	
	} else { /* empty */ }
	startEditMode();
}

function saveTestState()
{
	map2LevelData();
	setTestLevel(testLevelInfo);
}

function startTestMode()
{
	stopEditTicker();
	saveTestState();
	canvasReSize();
	document.onkeydown = handleKeyDown; //key press
	selectIconObj.disable(1);
	initShowDataMsg();
	startGame();
}

function getTestLevelMap(initValue)
{
	return testLevelInfo.levelMap;
}

const EDIT_PADDING = 1;

function canvasEditReSize() 
{
	for (let scale = MAX_SCALE; scale >= MIN_SCALE; scale -= 0.25) {
		let canvasX = (BASE_SCREEN_X+BASE_TILE_X*2) * scale+ EDIT_PADDING * (NO_OF_TILES_X+1);
		let canvasY =  BASE_SCREEN_Y * scale + EDIT_PADDING * (NO_OF_TILES_Y+1);
		if (canvasX <= screenX1 && canvasY <= screenY1 || scale <= MIN_SCALE) break;
	}
	

	let canvas = document.getElementById('canvas');

	canvas.width = canvasX;
	canvas.height = canvasY;
	
	//Set canvas top left position
	const left = ((screenX1 - canvasX)/2|Math.trunc),
		top  = ((screenY1 - canvasY)/2|Math.trunc);
	canvas.style.left = (Math.max(left, 0)) + "px";
	canvas.style.top =  (Math.max(top, 0)) + "px";
	canvas.style.position = "absolute";
	
	//initial constant value
	let tileScale = scale;
	
	
	
	editBorder = 4 * tileScale;	
}

function createBaseTile()
{
	for(let id = 0; id < tileInfo.length; id++) {
		baseTile[id] = { image: preload.getResult(tileInfo[id][0]), id: id };
	}
	
	emptyTile = { image: preload.getResult("empty"), id: 0 };
	actTile = baseTile[1];
}

function createEditMap() 
{
	let tile, backColor, bitmap;
		
	setEditBackground();
	drawEditArea(0,0, 
				 (tileW+EDIT_PADDING)*NO_OF_TILES_X+EDIT_PADDING,
				 (tileH+EDIT_PADDING)*NO_OF_TILES_Y+EDIT_PADDING
	);
	
	initMapInfo();
	getTestLevel(testLevelInfo);
	
	
	//(1) create empty map[x][y] array;
	editMap = [];
	for(let x = 0; x < NO_OF_TILES_X; x++) {
		editMap[x] = [];
	}
	
	//(2) draw map
	let index = 0;
	for(let y = 0; y < NO_OF_TILES_Y; y++) {
		for(let x = 0; x < NO_OF_TILES_X; x++) {
			const id = tile2Id(testLevelInfo.levelMap.charAt(index++));
			tile = new createjs.Container();
				
			backColor = new createjs.Shape();
			backColor.graphics.beginFill("black").drawRect(0, 0, tileW, tileH).endFill();
			if(id == 0) {
				bitmap = new createjs.Bitmap(emptyTile.image);
			} else {
				bitmap = new createjs.Bitmap(baseTile[id].image);
			}
			bitmap.scaleX = bitmap.scaleY = tileScale;
			
			tile.addChild(backColor, bitmap);
			tile.x = (tileW + EDIT_PADDING) * x+EDIT_PADDING;
			tile.y = (tileH + EDIT_PADDING) * y+EDIT_PADDING;
			editMap[x][y] = { tile: tile, id: id };
			mainStage.addChild(tile); 
			addManCheck(id, x, y);
		}
	}
	drawEditGround();
	addSelectIcon();
 	addCursorTile();
	drawEditLevel();
	drawSaveButton();
	drawTestButton();
	drawNewButton();
	enableTestButton();
	
	mainStage.on("stagemouseup", stageMouseUp);
	mainStage.on("stagemousedown", stageMouseDown);
}

function clearEditMap()
{
	initMapInfo();	
	for(let y = 0; y < NO_OF_TILES_Y; y++) {
		for(let x = 0; x < NO_OF_TILES_X; x++) {
			const tileObj = editMap[x][y];
			tileObj.tile.getChildAt(1).image =  emptyTile.image;
			tileObj.id = emptyTile.id;
		}
	}
}

const tileIdMapping = { ' ':0, '#':1, '@':2, 'H':3, '-':4, 'X':5, 'S':6, '$':7, '0':8, '&':9 };
function tile2Id(tileChar)
{
	if( tileIdMapping.hasOwnProperty(tileChar)) {
		return tileIdMapping[tileChar];
	} else {
		return 0;
	}
}

function setEditBackground()
{
	//set background color
	const background = new createjs.Shape();
	background.graphics.beginFill("black").drawRect(0, 0, canvas.width, canvas.height);
	mainStage.addChild(background);
	document.body.style.background = "#301050";
}
	
function drawEditArea(startX, startY, width, height)
{
	const editBack = new createjs.Shape();
	editBack.alpha = 0.5;
	editBack.graphics.beginFill("gold").drawRect(startX, startY, width, height);
	mainStage.addChild(editBack);
}

function drawEditGround()
{
	let groundTile;
	const y = (tileH + EDIT_PADDING) * NO_OF_TILES_Y+EDIT_PADDING;
	const x = (tileW + EDIT_PADDING) * NO_OF_TILES_X+EDIT_PADDING;
	
	groundTile = new createjs.Shape();
	groundTile.graphics.beginFill("#0DA1FF").drawRect(0, 0, x, 10*tileScale);
	groundTile.x = 0;
	groundTile.y = y;

	mainStage.addChild(groundTile); 
}

function addSelectIcon()
{
	const x =  (tileW+EDIT_PADDING)*NO_OF_TILES_X+tileW/2;
	let y;
	for(let i = 1; i < baseTile.length; i++) {
		y = (tileH*3/2)*(i-1) + tileH*3/2;
		drawSelectIcon(i, x, y);
	}
	y = (tileH*3/2)*(i-1) + tileH*3/2;
	drawSelectIcon(0, x, y);
}
	
function addCursorTile()
{
	let backColor, bitmap;
	
	cursorTileObj = new createjs.Container();
				
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("black").drawRect(0, 0, tileW, tileH).endFill();
	bitmap = new createjs.Bitmap(actTile.image);
	bitmap.scaleX = bitmap.scaleY = tileScale;
				
	cursorTileObj.addChild(backColor, bitmap);
	cursorTileObj.alpha = 0;	
	mainStage.addChild(cursorTileObj);

}

//var gameTicker = null; ....//same as playTicker
function startEditTicker()
{
	stopEditTicker();
	createjs.Ticker.setFPS(60);	
	mainStage.enableMouseOver(120);
}
	
function stopEditTicker()
{
	if(gameTicker) {
		createjs.Ticker.off("tick", gameTicker);
		mainStage.enableMouseOver(0);
		mainStage.cursor = 'default';
		let gameTicker = null;
	}
}

function drawSelectIcon(id, x, y)
{
	let tile, border, backColor, bitmap;
	let selColor;
	
	tile = new createjs.Container();

	//child id = 0
	border = new createjs.Shape();
	if(id == actTile.id) {
		selColor = "red";
	} else {
		selColor = "black";
	}
	border.graphics.beginFill(selColor).drawRect(-editBorder, -editBorder, tileW+editBorder*2, tileH+editBorder*2).endFill();
	
	
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("black").drawRect(0, 0, tileW, tileH).endFill();
	
	
	if(id == 0) {
		bitmap = new createjs.Bitmap(preload.getResult("eraser")); //id=2
	} else {
		bitmap = new createjs.Bitmap(baseTile[id].image); //id=2
	}
	bitmap.scaleX = bitmap.scaleY = tileScale;
				
	tile.addChild(border, backColor, bitmap);
		
	tile.x = x;
	tile.y = y;
	tile.myId = id;
	tile.on('click', selectTileClick);
	tile.on('mouseover', selectTileMouseOver);
	tile.on('mouseout', selectTileMouseOut);
	mainStage.addChild(tile);
}
	
let mouseOver = 0;	
function selectTileClick()
{
	const actBorder = this.getChildAt(0);
	const inActBorder = selectedTile.getChildAt(0);
	
	inActBorder.graphics.clear();
	inActBorder.graphics.beginFill("black").drawRect(-editBorder, -editBorder, tileW+editBorder*2, tileH+editBorder*2).endFill();
	
	actBorder.graphics.clear();
	actBorder.graphics.beginFill("red").drawRect(-editBorder, -editBorder, tileW+editBorder*2, tileH+editBorder*2).endFill();
	
	actTile = baseTile[this.myId];
	cursorTileObj.getChildAt(1).image =  actTile.image;
}
	
function selectTileMouseOver()
{ 
	const border = this.getChildAt(0);
	
	border.graphics.clear();
	border.graphics.beginFill("gold").drawRect(-editBorder, -editBorder, tileW+editBorder*2, tileH+editBorder*2).endFill();

	mainStage.cursor = 'pointer'
	mouseOver = 1;
}
	
function selectTileMouseOut()
{ 
	const border = this.getChildAt(0);
	const color = (actTile.id == this.myId)?"red":"black";
	
	border.graphics.clear();
	border.graphics.beginFill(color).drawRect(-editBorder, -editBorder, tileW+editBorder*2, tileH+editBorder*2).endFill();
	
	mouseOver = 0;
}

function drawEditLevel()
{
	const y = canvas.height - tileH - editBorder*2;
	
	drawText(0, y, "LEVEL", mainStage);	
	drawEditLevelNo();
}

let editLevelNoObj = [];
function drawEditLevelNo()
{
	const y = canvas.height - tileH - editBorder*2;
	
	for(const element of editLevelNoObj) 
		element.remove();
	
	editLevelNoObj = drawText(5*tileW, y, ("00"+(testLevelInfo.level)).slice(-3), mainStage);
}

let testButton, newButton, saveButton;

function createButtonMouseOverHandler(buttonWidth) {
	return function() {
		const border = this.getChildAt(0);
		border.graphics.clear();
		border.graphics.beginFill("gold").drawRect(-editBorder, -editBorder, buttonWidth+editBorder*2, tileH+editBorder*2).endFill();
		mainStage.cursor = 'pointer';
		mouseOver = 1;	
	};
}

function createButtonMouseOutHandler(buttonWidth) {
	return function() {
		const border = this.getChildAt(0);
		border.graphics.clear();
		border.graphics.beginFill("black").drawRect(-editBorder, -editBorder, buttonWidth+editBorder*2, tileH+editBorder*2).endFill();
		mouseOver = 0;	
	};
}

function drawTestButton()
{
	let border, backColor;
	const textSting = "TEST";
	
	const width = textSting.length * tileW;
	const x = 20*(tileW+EDIT_PADDING)+EDIT_PADDING;
	const y = canvas.height - tileH - editBorder;
	
	testButton = new createjs.Container();


	border = new createjs.Shape();
	border.graphics.beginFill("black").drawRect(-editBorder, -editBorder, width+editBorder*2, tileH+editBorder*2).endFill();
	

	backColor = new createjs.Shape();
	backColor.graphics.beginFill("#FFF").drawRect(0, 0, width, tileH).endFill();
	
	testButton.addChild(border, backColor);
	
	
	drawText(0, 0, textSting, testButton);
		
	testButton.x = x;
	testButton.y = y;
	testButton.on('click', testButtonClick);
	testButton.on('mouseover', createButtonMouseOverHandler(4*tileW));
	testButton.on('mouseout', createButtonMouseOutHandler(4*tileW));
	testButton.alpha = 0;
	mainStage.addChild(testButton);	
}

function drawSaveButton()
{
	let border, backColor;
	const textSting = "SAVE";
	
	const width = textSting.length * tileW;
	const x = 15*(tileW+EDIT_PADDING)+EDIT_PADDING;
	const y = canvas.height - tileH - editBorder;
	
	saveButton = new createjs.Container();

	
	border = new createjs.Shape();
	border.graphics.beginFill("black").drawRect(-editBorder, -editBorder, width+editBorder*2, tileH+editBorder*2).endFill();
	

	backColor = new createjs.Shape();
	backColor.graphics.beginFill("#FFF").drawRect(0, 0, width, tileH).endFill();
	
	saveButton.addChild(border, backColor);
	
	//child id = 2
	drawText(0, 0, textSting, saveButton);
		
	saveButton.x = x;
	saveButton.y = y;
	saveButton.on('click', saveButtonClickHandler);
	saveButton.on('mouseover', createButtonMouseOverHandler(4*tileW));
	saveButton.on('mouseout', createButtonMouseOutHandler(4*tileW));
	saveButton.alpha = 0;
	mainStage.addChild(saveButton);	
}

function saveButtonClickHandler()
{
	stopEditTicker();
	saveEditLevel();
	yesNoDialog(["Save Successful", "Play It ?"], yesBitmap, noBitmap, mainStage, tileScale, playConfirm);
}

function playConfirm(rc)
{
	if(rc) { 
		clearTestLevel();
		startPlayUserLevel();
	} else { 
		setButtonState();
		startEditTicker();
	}
}

function editLevelModified()
{
	return (testLevelInfo.modified);
}

function editConfirmAbortState(callbackFun)
{
	stopEditTicker();
	yesNoDialog(["Abort current edit ?"], yesBitmap, noBitmap, mainStage, tileScale, 
				function(rc) { if(rc) callbackFun(); else startEditTicker(); });
}

function newLevelConfirm(rc)
{
	if(rc) 	{
		clearEditMap();
		if(testLevelInfo.level <= editLevels) { //edit exist level
			testLevelInfo.level = editLevels+1;
			drawEditLevelNo();
		}
		if(testLevelInfo.level > MAX_EDIT_LEVEL) {
			setButtonState();
		} else {
			disableTestButton();
		}
		clearTestLevel();
	}
	startEditTicker();
}

function drawNewButton()
{
	let border, backColor;
	const textSting = "NEW";
	const width = textSting.length * tileW;
	const x = 25*(tileW+EDIT_PADDING)+EDIT_PADDING;
	const y = canvas.height - tileH - editBorder;
	
	newButton = new createjs.Container();

	//child id = 0
	border = new createjs.Shape();
	border.graphics.beginFill("black").drawRect(-editBorder, -editBorder, width+editBorder*2, tileH+editBorder*2).endFill();
	
	//child id = 1
	backColor = new createjs.Shape();
	backColor.graphics.beginFill("#FFF").drawRect(0, 0, width, tileH).endFill();
	
	newButton.addChild(border, backColor);
	
	//child id = 2
	drawText(0, 0, textSting, newButton);
		
	newButton.x = x;
	newButton.y = y;
	newButton.on('click', newButtonClickHandler);
	newButton.on('mouseover', createButtonMouseOverHandler(3*tileW));
	newButton.on('mouseout', createButtonMouseOutHandler(3*tileW));
	mainStage.addChild(newButton);	
}

function setButtonState()
{
	if(testLevelInfo.level > MAX_EDIT_LEVEL) {
		newButton.alpha = 0;
		testButton.alpha = 0;
		saveButton.alpha = 0;
		editWarningMsg(0);
		return;
	} else {
		newButton.alpha = 1;
		editWarningMsg(1);
	}
	
	if(testLevelInfo.modified) 	{
		enableTestButton();
		if(testLevelInfo.pass) {
			saveButton.alpha = 1;
		} else {
			saveButton.alpha = 0;
		}
	} else {
		testLevelInfo.pass = 0;
		saveButton.alpha = 0;
	}
} 

function enableTestButton()
{
	if(lastRunner) testButton.alpha = 1;
}

function disableTestButton()
{
	testButton.alpha = 0;
	saveButton.alpha = 0;
}

function clearUserLevelScore()
{
	getModernScoreInfo();
	modernScoreInfo[testLevelInfo.level-1] = -1;
	setModernScoreInfo();
}

function delUserLevelScore(level)
{
	getModernScoreInfo();
	modernScoreInfo.splice(level-1, 1);
	modernScoreInfo[MAX_EDIT_LEVEL-1] = -1;
	setModernScoreInfo();
}

function saveEditLevel()
{
	map2LevelData();
	if(testLevelInfo.level > editLevels) { // new level
		addEditLevel(testLevelInfo.levelMap);
	} else {
		setEditLevel(testLevelInfo.level, testLevelInfo.levelMap);
	}
	clearUserLevelScore(); //clear score 
	testLevelInfo.modified = 0;
	setEditSelectMenu();
}


let mouseDown = 0;
let lastDown = {x:-1, y:-1};
	
function stageMouseDown(event)
{
	mouseDown = 1;
}
	
function stageMouseUp(event)
{
	mouseDown = 0;
	lastDown = {x:-1, y:-1};

}

function initMapInfo()
{
	lastRunner = null;
	lastGuardList = [];	

	testLevelInfo.modified = 0;
	testLevelInfo.pass = 0;
}
		
function addManCheck(id, x, y)
{
	switch(id) {
	case RUNNER_ID:
		if (lastRunner && (lastRunner.x != x || lastRunner.y != y)) {
			const lastRunnerTile = editMap[lastRunner.x][lastRunner.y];
			lastRunnerTile.tile.getChildAt(1).image =  emptyTile.image;
			lastRunnerTile.id = emptyTile.id;
		}
		lastRunner = { x:x, y:y };
		break;	
	case GUARD_ID:
		{ let sameGuard=0, guardNo = lastGuardList.length;
			
		for(let i = 0; i < guardNo; i++) {
			if(lastGuardList[i].x == x && lastGuardList[i].y == y) {
				sameGuard = 1;
				break;
			}
		}
		if(!sameGuard) {
			if(guardNo >= MAX_EDIT_GUARD) { //too many guards remove first one
				const x1 = lastGuardList[0].x, y1 = lastGuardList[0].y;
				const guardTile = editMap[x1][y1];
					
				guardTile.tile.getChildAt(1).image =  emptyTile.image;
				guardTile.id = emptyTile.id;
				lastGuardList.splice(0,1); //remove first one from array
			}
			lastGuardList.push({x:x, y:y});
		}
		break; }	
	}
}

function delManCheck(id, x, y)
{
	switch(id) {
	case RUNNER_ID:
		{ let lastRunnerTile = editMap[lastRunner.x][lastRunner.y];
		lastRunnerTile.tile.getChildAt(1).image =  emptyTile.image;
		lastRunnerTile.id = emptyTile.id;
		lastRunner = null;
		disableTestButton();	
		break; }
	case GUARD_ID:		
		{ let removeId = -1, guardNo = lastGuardList.length;
		for(let i = 0; i < guardNo; i++) {
			if(lastGuardList[i].x == x && lastGuardList[i].y == y) {
				removeId = i;
				break;
			}
		}
		if(removeId >= 0) {
			const x1 = lastGuardList[removeId].x, y1 = lastGuardList[removeId].y;
			const guardTile = editMap[x1][y1];
			
			guardTile.tile.getChildAt(1).image =  emptyTile.image;
			guardTile.id = emptyTile.id;
			lastGuardList.splice(removeId,1);
		} else {
			console.log("design error !");
		}
		break;	
	}
	}
}



//state: = 0: no change, < 0: level deleted, > 0 level change to newLevel
function editSelectMenuClose(levelDeleted, newLevel, state)
{
	if(levelDeleted) {
		switch(true) {
		case (state > 0): //level changed
			getTestLevel(testLevelInfo);
			testLevelInfo.level = newLevel;
			setTestLevel(testLevelInfo);
			startEditMode();
			break;
		case (state < 0): //level deleted
			clearTestLevel();
			setEditSelectMenu();	
			startEditMode();
			break;	
		case (state == 0 && newLevel == 0): //new level
			if(testLevelInfo.modified == 1) {	
				testLevelInfo.level = editLevels+1;
				setTestLevel(testLevelInfo);
			} 
			startEditMode();
			break;
		}
	}
}

function editSelectLevel(level)
{
	testLevelInfo.level = level;
	testLevelInfo.levelMap = editLevelData[level-1];
	setTestLevel(testLevelInfo);
	startEditMode();
}

function map2LevelData()
{
	testLevelInfo.levelMap = "";
	for(let y = 0; y < NO_OF_TILES_Y; y++) {
		for(let x = 0; x < NO_OF_TILES_X; x++) {
			testLevelInfo.levelMap += tileInfo[editMap[x][y].id][1];
		}
	}
}

//==============================
// Too many user created Levels
//==============================
let editWarningText = null;
function editWarningMsg(hidden)
{
	let width, height;

	if(editWarningText == null) 
		editWarningText = new createjs.Text("Too many user created levels !", 
											"bold " +  (64*tileScale) + "px Helvetica", "#fc5c1c");
	
	width = editWarningText.getBounds().width;
	height = editWarningText.getBounds().height;
	editWarningText.x = (NO_OF_TILES_X*(tileW+EDIT_PADDING) - width) / 2 | Math.trunc;
	editWarningText.y = (NO_OF_TILES_Y*tileH - height) / 2 | Math.trunc;
	editWarningText.shadow = new createjs.Shadow("white", 2, 2, 1);
	
	if(hidden) {
		editWarningText.remove();
	} else {
		mainStage.addChild(editWarningText);
	}
	mainStage.update();
}

const copyLevelMap = null;
function editHandleKeyDown(event)
{
	if(!event){ event = window.event; } //cross browser issues exist
	
	if (event.ctrlKey) {
		if(event.keyCode == KEYCODE_V) { //CTRL-V
			if(copyLevelMap != null) {
				testLevelInfo.levelMap = copyLevelMap;
				testLevelInfo.pass = 1;
				setTestLevel(testLevelInfo);
				startEditMode();
				////setButtonState();
				setTimeout(function() { showTipsText("PASTE MAP", 0);}, 50);
			}
		}
	}
	return true;
}	

function handleTileEdit(x, y)
{
	const clickTile = editMap[x][y];
	
	if(!actTile.id || clickTile.id == actTile.id) {
		if(actTile.id) cursorTileObj.alpha = 0;
		delManCheck(clickTile.id, x, y);
		clickTile.tile.getChildAt(1).image = emptyTile.image;
		clickTile.id = emptyTile.id;
	} else {	
		delManCheck(clickTile.id, x, y);
		clickTile.tile.getChildAt(1).image = actTile.image;
		clickTile.id = actTile.id;
		addManCheck(actTile.id, x, y);
	}
	lastDown = {x:x, y:y};
	
	if(testLevelInfo.pass || actTile.id == RUNNER_ID || testLevelInfo.modified == 0) {
		testLevelInfo.modified = 1;
		testLevelInfo.pass = 0;
		setButtonState();
	}
}

function updateCursorPosition(x, y, isInEditArea)
{
	if(isInEditArea) {
		cursorTileObj.alpha = 1;
		cursorTileObj.x = (tileW + EDIT_PADDING) * x + EDIT_PADDING;
		cursorTileObj.y = (tileH + EDIT_PADDING) * y + EDIT_PADDING;
		if(mouseDown) {
			handleTileEdit(x, y);
		}
	} else {
		if(!mouseOver) mainStage.cursor = 'default'; 
		cursorTileObj.alpha = 0;
	}
}

function editTick() 
{
	const x = ((mainStage.mouseX-EDIT_PADDING) / (tileW+EDIT_PADDING) )| Math;
	const y = ((mainStage.mouseY-EDIT_PADDING) / (tileH+EDIT_PADDING) )| Math.trunc;
	
	if(testLevelInfo.level > MAX_EDIT_LEVEL) {
		mainStage.cursor = 'default'; 
		mainStage.update();
		return;
	}
	
	const isInEditArea = (x >= 0 && x < NO_OF_TILES_X && y >= 0 && y < NO_OF_TILES_Y);
	
	if(isInEditArea) {
		mainStage.cursor = 'pointer'; 
		if(x != lastDown.x || y != lastDown.y) {
			updateCursorPosition(x, y, true);
		}
	} else {
		updateCursorPosition(x, y, false);
	}
	
	mainStage.update();
}