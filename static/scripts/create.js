import * as templates from "/static/scripts/templates.js";


const qparent = document.getElementById("qparent");
const wparent = document.getElementById("wparent");
const hascorrect = document.getElementById("hascorrect");

let winnerid = 0;
const quiz = {name:"", description:"", hascorrect:0, winners:{}, questions:[]};
const winner = {name:"", description:""};
const question = {name:"", multichoice:0, answers:[]};
const answer = {name:"", iscorrect:0, winnerid:""};


function addAnswer(qobj, qel) {
	let aobj = JSON.parse(JSON.stringify(answer));

	let ael = document.createElement("div");
	ael.innerHTML = templates.answerhtml;

	ael.getElementsByClassName("answername")[0].addEventListener("input", function() {
		aobj.name = this.value;
	});

	let answerpoint = ael.getElementsByClassName("answerpoint")[0];
	answerpoint.addEventListener("change", function() {
		aobj.winnerid = this.value;
	});
	answerpoint.disabled = hascorrect.checked;

	let iscorrect = ael.getElementsByClassName("iscorrect")[0];
	iscorrect.addEventListener("change", function() {
			aobj.iscorrect = this.checked;
		});
	iscorrect.disabled = !hascorrect.checked;

	for (let id in quiz.winners) {
		let option = document.createElement("option");
		option.value = id;
		option.innerHTML = quiz.winners[id].name;
		answerpoint.appendChild(option);
	}

	ael.getElementsByClassName("delanswer")[0].addEventListener("click", function() {
		qobj.answers = qobj.answers.filter(item => item !== aobj);
		ael.parentNode.removeChild(ael);
	});

	qobj.answers.push(aobj);
	qel.appendChild(ael);
}


document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("quizname").addEventListener("input", function() {
		quiz.name = this.value;
	});

	document.getElementById("quizdesc").addEventListener("input", function() {
		quiz.description = this.value;
	});

	hascorrect.addEventListener("change", function() {
		quiz.hascorrect = this.checked;
		let answerpoints = qparent.getElementsByClassName("answerpoint");
		for (let select of answerpoints) {
			select.disabled = this.checked;
		}
		let iscorrects = qparent.getElementsByClassName("iscorrect");
		for (let checkbox of iscorrects) {
			checkbox.disabled = !this.checked;
		}
	});

	document.getElementById("addquestion").addEventListener("click", function() {
		let qobj = JSON.parse(JSON.stringify(question));

		let qel = document.createElement("fieldset");
		qel.innerHTML = templates.questionhtml;
		qel.className = "section";

		qel.getElementsByClassName("questionname")[0].addEventListener("input", function() {
			qobj.name = this.value;
		});

		qel.getElementsByClassName("multichoice")[0].addEventListener("change", function() {
			qobj.multichoice = this.checked;
		});

		qel.getElementsByClassName("addanswer")[0].addEventListener("click", function() {
			addAnswer(qobj, qel);
		});

		qel.getElementsByClassName("delquestion")[0].addEventListener("click", function() {
			quiz.questions = quiz.questions.filter(item => item !== qobj);
			qel.parentNode.removeChild(qel);
		});

		quiz.questions.push(qobj);
		qparent.appendChild(qel);
	});

	document.getElementById("addwinner").addEventListener("click", function() {
		let wobj = JSON.parse(JSON.stringify(winner));
		let wid = String(winnerid);
		quiz.winners[wid] = wobj;
		winnerid++;

		let wel = document.createElement("div");
		wparent.appendChild(wel);
		wel.innerHTML = templates.winnerhtml;

		wel.getElementsByClassName("winnername")[0].addEventListener("input", function() {
			wobj.name = this.value;
			let answerpoints = qparent.getElementsByClassName("answerpoint");
			for (let select of answerpoints) {
				for (let option of select.children) {
					if (option.value == wid) {
						option.innerHTML = wobj.name;
					}
				}
			}
		});

		wel.getElementsByClassName("winnerdesc")[0].addEventListener("input", function() {
			wobj.description = this.value;
		});

		wel.getElementsByClassName("delwinner")[0].addEventListener("click", function() {
			let answerpoints = qparent.getElementsByClassName("answerpoint");
			for (let select of answerpoints) {
				for (let j = select.children.length - 1; j >= 0; j--) {
					if (select.children[j].value == wid) {
						select.children[j].parentNode.removeChild(select.children[j]);
					}
				}
			}
			delete quiz.winners[wid];
			wel.parentNode.removeChild(wel);
		});

		let answerpoints = qparent.getElementsByClassName("answerpoint");
		for (let select of answerpoints) {
			let option = document.createElement("option");
			option.value = wid;
			option.innerHTML = wobj.name;
			select.appendChild(option);
		}
	});

	document.getElementById("submit").addEventListener("click", function() {
		var request = new XMLHttpRequest();
		request.open("POST", "/", true);
		request.send(JSON.stringify(quiz));
		window.location.assign("/");
	})
});