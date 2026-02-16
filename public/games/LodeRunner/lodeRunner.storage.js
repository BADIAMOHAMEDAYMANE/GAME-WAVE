
let modernScoreInfo, editScoreInfo;

//=======================
// LOCAL STORAGE SET/GET 
//=======================

function setLastPlayMode()
{
	const infoObj = { m:playMode, d:playData };
	const infoJSON = JSON.stringify(infoObj);
	
	setStorage(STORAGE_LASTPLAY_MODE, infoJSON); 	
}

function getClassicInfo()
{
	let infoJSON;
	
	if(playData == 1) {
		infoJSON = getStorage(STORAGE_CLASSIC_INFO1); 
		levelData = levelData1;
	} else {
		infoJSON = getStorage(STORAGE_CLASSIC_INFO2); 
		levelData = levelData2;
	}
	
	if(infoJSON == null) {
		curScore = 0;	
		curLevel = maxLevel = 1;
		runnerLife = RUNNER_LIFE;
	} else {
		const infoObj = JSON.parse(infoJSON);
		curScore = infoObj.s;
		curLevel = infoObj.l;
		maxLevel = infoObj.m;
		runnerLife = infoObj.r;
	}
}

function setClassicInfo()
{
	maxLevel = (maxLevel < curLevel)?curLevel:maxLevel;
	const infoObj = { s:curScore, l:curLevel, r:runnerLife, m: maxLevel };
	const infoJSON = JSON.stringify(infoObj);
	
	if(playData == 1) setStorage(STORAGE_CLASSIC_INFO1, infoJSON); 
	else setStorage(STORAGE_CLASSIC_INFO2, infoJSON); 
}

function clearClassicInfo()
{
	if(playData == 1) clearStorage(STORAGE_CLASSIC_INFO1);
	else clearStorage(STORAGE_CLASSIC_INFO2);
}

function getModernInfo()
{
	let infoJSON;
	
	if(playData == 1) {
		infoJSON = getStorage(STORAGE_MODERN_INFO1); 
		levelData = levelData1;
	} else if(playData == 2) {
		infoJSON = getStorage(STORAGE_MODERN_INFO2); 
		levelData = levelData2;
	} else {
		if(editLevels > 0) {
			infoJSON = getStorage(STORAGE_USER_INFO); 
			levelData = editLevelData;
		} else { //no any user created level !
			playData = 1;
			infoJSON = getStorage(STORAGE_MODERN_INFO1); 
			levelData = levelData1;
		}
	}
	
	if(infoJSON == null) {
		curScore = 0;	
		curLevel = 1;
		runnerLife = RUNNER_LIFE;
	} else {
		const infoObj = JSON.parse(infoJSON);
		curScore = 0;
		curLevel = infoObj.l;
		runnerLife = RUNNER_LIFE;
	}
	getModernScoreInfo();	
}

function setModernInfo()
{
	const infoObj = { l:curLevel};
	const infoJSON = JSON.stringify(infoObj);
	
	switch(playData) {
	case 1:		
		setStorage(STORAGE_MODERN_INFO1, infoJSON); 
		break;
	case 2:
		setStorage(STORAGE_MODERN_INFO2, infoJSON);
		break;
	case 3:		
		setStorage(STORAGE_USER_INFO, infoJSON); //user created
		break;
	default:
		debug("setModernInfo() design error !");
		break;	
	}
}

function clearModernInfo()
{
	switch(playData) {
	case 1:
		clearStorage(STORAGE_MODERN_INFO1);	
		break;
	case 2:
		clearStorage(STORAGE_MODERN_INFO2);	
		break;
	case 3:
		clearStorage(STORAGE_USER_INFO);	
		break;
	default:
		debug("setModernInfo() design error !");
		break;	
	}
		
}

function getModernScoreInfo()
{
	let infoJSON, levelSize;
	
	switch(playData) {
	case 1:
		infoJSON = getStorage(STORAGE_MODERN_SCORE_INFO1); 
		levelSize = levelData.length;
		break;	
	case 2:
		infoJSON = getStorage(STORAGE_MODERN_SCORE_INFO2); 
		levelSize = levelData.length;
		break;	
	case 3:
		infoJSON = getStorage(STORAGE_USER_SCORE_INFO);  //user created
		levelSize = MAX_EDIT_LEVEL;	
		break;
	}
	
	if(infoJSON) {
		modernScoreInfo = JSON.parse(infoJSON);
		if(modernScoreInfo.length != levelSize) infoJSON = null;
	} 
	if(infoJSON == null) {
		modernScoreInfo = [];
		for(let i = 0; i < levelSize; i++) modernScoreInfo[i] = -1;
	}
}

function setModernScoreInfo()
{
	const infoJSON = JSON.stringify(modernScoreInfo);
	
	switch(playData) {
	case 1:		
		setStorage(STORAGE_MODERN_SCORE_INFO1, infoJSON); 
		break;
	case 2:		
		setStorage(STORAGE_MODERN_SCORE_INFO2, infoJSON); 
		break;
	case 3:		
		setStorage(STORAGE_USER_SCORE_INFO, infoJSON); 
		break;
	}		
}

//=====================
// for edit mode
//=====================

var editLevelData, editLevels = -1, editLevelInfo;

function delEditLevel(level) 
{
	if(level > editLevels || level< 1) return false;
	
	const delId = editLevelInfo[level-1];
	
	editLevelInfo.splice(level-1,1); //delete id and shift others
	editLevelInfo.push(delId); //put the deleted id to last of array
	clearStorage(STORAGE_USER_LEVEL+("00"+(delId)).slice(-3));
	if(--editLevels <= 0) {
		clearEditLevelInfo(); //no edit levels
		clearStorage(STORAGE_USER_SCORE_INFO); //clear user score info
		initEditLevelInfo();
	} else {
		setEditLevelInfo();
		delUserLevelScore(level);
	}

	editLevelData.splice(level-1,1);
	
	return true;
}

function addEditLevel(levelMap) 
{
	if(editLevels >= MAX_EDIT_LEVEL) return false;
	setEditLevel(++editLevels, levelMap);
	//setStorage(STORAGE_USER_LEVEL+("00"+(editLevelInfo[editLevels])).slice(-3), levelMap); 	
	//editLevelData[editLevels] = levelMap;
	//++editLevels;
	setEditLevelInfo();
	
	return true;
}

function setEditLevel(level, levelMap)
{
	setStorage(STORAGE_USER_LEVEL+("00"+(editLevelInfo[level-1])).slice(-3), levelMap); 
	editLevelData[level-1] = levelMap;
}

function initEditLevelInfo()
{
	editLevels = 0;
	editLevelInfo = [];
	for(let i = 0; i < MAX_EDIT_LEVEL; i++) {
		editLevelInfo[i] = i+1;
	}	
}

function getEditLevelInfo()
{
	let infoJSON, levelMap;

	if(editLevels >= 0) return; //just once
	
	infoJSON = getStorage(STORAGE_EDIT_INFO); 
	editLevelData = [];
	
	if(infoJSON) {
		const infoObj = JSON.parse(infoJSON);
		editLevels = infoObj.no;
		editLevelInfo = infoObj.id;
	} else {
		initEditLevelInfo();
		if(getStorage(STORAGE_FIRST_PLAY) == null) {
			createUserDefaultLevel(); //first time, create user default level
		}
	}
	
	for(let i = 0; i < editLevels; i++) {
		levelMap = getStorage(STORAGE_USER_LEVEL + ("00"+(editLevelInfo[i])).slice(-3));
		if(levelMap == null || levelMap.length !=  NO_OF_TILES_X * NO_OF_TILES_Y) {
			debug("LOCAL STORAGE: get edit level map failed (" + i + ") !");
			editLevels =i; 
			break;
		}
		editLevelData[i] = levelMap;
	}

	curScore = 0;
	curLevel = editLevels+1;
	runnerLife = RUNNER_LIFE;
}

function setEditLevelInfo()
{
	const infoObj = { no:editLevels, id: editLevelInfo};
	const infoJSON = JSON.stringify(infoObj);
	
	setStorage(STORAGE_EDIT_INFO, infoJSON); 
}

function clearEditLevelInfo()
{
	clearStorage(STORAGE_EDIT_INFO);
}

function initNewLevelInfo(testInfo)
{
	testInfo.level = editLevels+1;
	testInfo.levelMap = "";
	testInfo.pass = 0;
	testInfo.modified = 0;
	for(let i = 0; i < NO_OF_TILES_X * NO_OF_TILES_Y; i++) 
		testInfo.levelMap += " "; //empty map
}

function compareWithExist(existLevelMap, testLevelMap)
{
	for(let i = 0; i < NO_OF_TILES_X * NO_OF_TILES_Y; i++) {
		if(existLevelMap.charAt(i) != testLevelMap.charAt(i)) return 1;
	}
	return 0;
}

function getTestLevel(testInfo)
{
	let infoJSON;
	
	if((infoJSON = getStorage(STORAGE_TEST_LEVEL)) == null)	{
		initNewLevelInfo(testInfo);
	} else {
		const init = testInfo.level<0?1:0;
		const infoObj = JSON.parse(infoJSON);
		
		testInfo.level  = infoObj.level;
		testInfo.levelMap = infoObj.map;
		testInfo.pass     = infoObj.pass;
		
		//BEGIN for debug ====================
		let i = 0;
		for(let y = 0; y < NO_OF_TILES_Y; y++) {
			let string = ""
			for(let x = 0; x < NO_OF_TILES_X; x++) {
				string += testInfo.levelMap[i++];
			}
			debug('"' + string + '"');
		}
		//END   for debug ====================
		
		if(testInfo.level > editLevels) testInfo.modified = 1;
		else {
			if(compareWithExist(editLevelData[infoObj.level-1], testInfo.levelMap) == 0) { 
				if(init) {
					//same as exist level, new level 
					clearTestLevel();
					initNewLevelInfo(testInfo);
				}
			} else {
				testInfo.modified = 1;
			}
		}
		
	}
}

function setTestLevel(testInfo)
{
	const infoObj = { level:testInfo.level, map: testInfo.levelMap, pass: testInfo.pass};
	const infoJSON = JSON.stringify(infoObj);
	
	setStorage(STORAGE_TEST_LEVEL, infoJSON); 	
}

function clearTestLevel()
{
	clearStorage(STORAGE_TEST_LEVEL);
}

function createUserDefaultLevel()
{
	const myDefaultLevel =    //Double Happy 2014/05/25
		"0-------- ------- ---------0" +
		"H     &  #   $   #         H" +
		"H     #######S#######      H" +
		"H      $ #       # $       H" +
		"H     @@@#@@@S@@@#@@@      H" +
		"H        #       #         H" +
		"H     ####### #######      H" +
		"H     #  $  # #  $  #      H" +
		"H     #@@#### ####@@#      H" +
		"H        X       X         H" +
		"H     @@@#@@@X@@@#@@@      H" +
		"H        #       #         H" +
		"H     ####### #######      H" +
		"H     #  $  # #  $  #      H" +
		"H     ####### #######      H" +
		"H        #       #         H";		
	
	addEditLevel(myDefaultLevel);
}

//=========================
// for debug only 
//=========================
function genUserLevel(levels)
{
	const levelMap = 
		"                    H       " +
		"                   &H       " +
		"                   ##       " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " +
		"                            " ;
	getEditLevelInfo();
	while(editLevels > 0) delEditLevel(1); //clear all user level
	
	for(let i = 1; i <= levels; i++) {
		let tmpMap = levelMap;
		const no = i%5;
		const str = "##########";
		for(let j = 0; j < no; j++) {
			const index = (no+j*2)*NO_OF_TILES_X;
			tmpMap = tmpMap.substr(0, index) + str + tmpMap.substr(index+str.length); 
		}
		addEditLevel(tmpMap);
	}
}

//=======================================
// BEGIN for set|get|clear localstorage
//=======================================
function setStorage(key, value) 
{
	if(typeof(window.localStorage) !== 'undefined'){ 
		window.localStorage.setItem(key,value); 
	} 
}

function getStorage(key) 
{
	let value = null;
	if(typeof(window.localStorage) !== 'undefined'){ 
		value = window.localStorage.getItem(key); 
	} 
	return value;
}

function clearStorage(key) 
{
	if(typeof(window.localStorage) !== 'undefined'){ 
		window.localStorage.removeItem(key); 
	} 
}
