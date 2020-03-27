var questionbox = document.getElementById("questionbox");
var answerbox = document.getElementById("answerbox");
var scorebox = document.getElementById("scorebox");
var hsbox = document.getElementById("highscorebox");
var progbox = document.getElementById("progbox");
var prog = document.getElementById("prog");
var addcheck = document.getElementById("addcheck");
var subcheck = document.getElementById("subcheck");
var multicheck = document.getElementById("multicheck");
var divcheck = document.getElementById("divcheck");
var allownegcheck = document.getElementById("allownegcheck");
var resetbutton = document.getElementById("resetbutton");
var maxnumbox = document.getElementById("maxnumbox");
var settingsdiv = document.getElementById("settingsdiv");
var settingshide = document.getElementById("settingshide");
var hsdiv = document.getElementById("hsdiv");
var qnumbox = document.getElementById("qnumbox");


var timeperq = 15 * 1000; //ms
var refreshinterval = 50; //ms
var allowneganswers = false; 
var successmessages =  ["You did it!", 
                        "Correct!", 
                        "Nice one!", 
                        "Woo-hoo!"];

function getRandomInt(max) {
	return Math.round(Math.random() * Math.floor(max));
}
function getRandomIndex(max) {
	return Math.ceil(Math.random() * Math.floor(max)) - 1;
}
function getRandomSuccess(){
	return successmessages[getRandomIndex(successmessages.length)];
}

var supportedops;
var maxnum;
var qnum;
var currtime = timeperq;
var proginterval;
var currx;
var curry;
var opindex; 
var currop;
var realanswer;
var newqtimeout;
var questioncount = 0;
var hs;

function newQuestion(){
	clearTimeout(newqtimeout);
	if(questioncount === qnum){
		clearTimeout(newqtimeout);
		progStop();
		questionbox.innerHTML = "Game over!";
		highscoreSet();
		return;
	}else{
		do{
			currx = getRandomInt(maxnum);
			curry = getRandomInt(maxnum);
			opindex = getRandomIndex(supportedops.length);
			//opindex = opindex < 0 ? 0 : opindex; 
			currop = supportedops[opindex];
			var questionstr="" + currx + " " + currop + " " + curry;
			questionbox.innerHTML = questionstr;
			realanswer = Number(eval(questionstr));
			if (Number.isNaN(realanswer)){
				questionbox.innerHTML = "Something went wrong...";
			}
		} while(!allowneganswers && realanswer < 0)
		progReset();
		progStart();
		newqtimeout = setTimeout(() => {
			progStop();
			answerClear();
			//scoreSub(1);
			newQuestion();
		}, timeperq);
	}
	questioncount++;
	progbox.innerHTML = "Q " + questioncount + " of " + qnum;
}

function highscoreGet(){
	hs = localStorage.getItem("highscore");
	if(hs === null){
		localStorage.setItem("highscore", 0);
		hs=0;
	}
	return Number(hs);
}

function highscoreSet(){
	var currscore = Number(scorebox.innerHTML);
	var currhs = highscoreGet();
	if (currscore > currhs){
		currhs = currscore;
	showHsDiv();
		//alert("New high score! Way to go!");
		localStorage.setItem("highscore", currhs);
		
	}
	hsbox.innerHTML = currhs
}

function showHsDiv(){
	hsdiv.style.display = "";
	setTimeout(() => {
		hsdiv.style.display = "none";
		}, 2.5 * 1000);
}

function highscoreReset(){
	localStorage.setItem("highscore", 0);
	hsbox.innerHTML = 0
}

function scoreReset(){
	scorebox.innerHTML = "0";
}

function scoreAdd(amount){
	scorebox.innerHTML = (Number(scorebox.innerHTML) + amount);
}

function scoreSub(amount){
	scorebox.innerHTML = (Number(scorebox.innerHTML) - amount);
}

function scoreGet(){
	return Number(scorebox.innerHTML);
}

function progStop(){
	if (proginterval != null)
		clearInterval(proginterval);
}

function progStart(){
	proginterval = setInterval(() => {
		currtime -= refreshinterval;
		prog.value = (currtime/timeperq * 100);
	}, refreshinterval)
}

function progReset(){
	currtime = timeperq;
	prog.value = 100;
}

function answerClear(){
	answerbox.value = "";
}

function checkAnswer(){    
	inanswer = answerbox.value == "" ? Number.NaN : Number(answerbox.value);
	//console.log("inanswer: " + inanswer + " realanswer: " + realanswer);
	if (realanswer === inanswer){
		clearTimeout(newqtimeout);
		progStop();
		scoreAdd(Math.round(Math.pow(1.1,(currtime/timeperq * 100))));
		questionbox.innerHTML = getRandomSuccess();
		newqtimeout = setTimeout(() => {
			newQuestion()
		}, 2 * 1000);
		answerClear();
	}
}

function updateSupportedOps(){
	supportedops = [];
	if (subcheck.checked)
		supportedops.push("-");
	if (addcheck.checked)
		supportedops.push("+");
	if (divcheck.checked)
		supportedops.push("/");
	if (multicheck.checked)
		supportedops.push("*");
	allowneganswers = allownegcheck.checked;
}

function settingsChangedCallback(event){
	localStorage.setItem("setting"+event.target.value, String(event.target.checked));
	answerbox.focus();
}

function newGame(){
	maxnum = Number(maxnumbox.value);
	qnum = Number(qnumbox.value);
	scoreReset();
	questioncount = 0;
	clearTimeout(newqtimeout);
	progStop();
	updateSupportedOps();
	newQuestion();
	answerbox.focus();
}

function showSettings(){
	if (settingshide.innerHTML == "˄"){
		settingshide.innerHTML = "˅";
		settingsdiv.style.display = "none";
	}else{
		settingshide.innerHTML = "˄";
		settingsdiv.style.display = "";
	}
}

function loadSettings(){
	var allowsub = localStorage.getItem("setting-");
	if (allowsub != null){
		subcheck.checked = allowsub == "true";
	}
	var allowadd = localStorage.getItem("setting+");
	if (allowadd != null){
		addcheck.checked = allowadd == "true";
	}
	var allowmulti = localStorage.getItem("setting*");
	if (allowmulti != null){
		multicheck.checked = allowmulti == "true";
	}
	var allowdivi = localStorage.getItem("setting/");
	if (allowdivi != null){
		divcheck.checked = allowdivi == "true";
	}
	var allowneg = localStorage.getItem("settingallowneg");
	if (allowneg != null){
		allownegcheck.checked = allowneg == "true";
	}
	var maxnumber = localStorage.getItem("settingmaxnumbox");
	if (maxnumber != null){
		maxnumbox.value = Number(maxnumber);
	}
	var qnumber = localStorage.getItem("settingqnumbox");
	if (qnumber != null){
		qnumbox.value = Number(qnumber);
	}
}

function numChangeedCallback(event){
	localStorage.setItem("setting"+event.target.id, String(event.target.value));
	answerbox.focus();
}

loadSettings();

answerbox.addEventListener("keyup", checkAnswer);
subcheck.addEventListener("click", settingsChangedCallback);
addcheck.addEventListener("click", settingsChangedCallback);
divcheck.addEventListener("click", settingsChangedCallback);
multicheck.addEventListener("click", settingsChangedCallback);
allownegcheck.addEventListener("click", settingsChangedCallback);
maxnumbox.addEventListener("change", numChangeedCallback);
qnumbox.addEventListener("change", numChangeedCallback);
resetbutton.addEventListener("click", newGame);
settingshide.addEventListener("click", showSettings);


highscoreSet(0);

newGame();
