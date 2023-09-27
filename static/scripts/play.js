const qparent = document.getElementById("qparent");
const resultobj = document.getElementById("result");
const answers = new Map();
var checked = false;


document.addEventListener("DOMContentLoaded", function() {
	for (let q of data["questions"]) {
		let qobj = document.createElement("fieldset");
		qobj.className = "section";
		let legend = document.createElement("legend");
		legend.innerHTML = q[2];
		qobj.innerHTML += legend.outerHTML;
		let selected;
		if (!q[3]) {
			selected = document.createElement("p");
			qobj.appendChild(selected);
		}
		for (let a of data["answers"][q[0]]) {
			if (q[3]) {
				answers.set(q[0], new Set());
				let label = document.createElement("label");
				label.innerHTML = document.createElement("input").outerHTML + a[2];
				let aobj = label.getElementsByTagName("input")[0];
				aobj.type = "checkbox";
				aobj.addEventListener("input", function() {
					if (checked) { return; }
					if (aobj.checked) {
						answers.get(q[0]).add(a[0]);
					}
					else {
						answers.get(q[0]).delete(a[0]);
					}
				});
				qobj.appendChild(label);
			}
			else {
				let aobj = document.createElement("button");
				aobj.addEventListener("click", function() {
					if (checked) { return; }
					answers.set(q[0], a[0]);
					selected.innerHTML = a[2];
				});
				aobj.innerHTML = a[2];
				qobj.appendChild(aobj);
			}
		}
		qparent.appendChild(qobj);
	}
});

document.getElementById("check").addEventListener("click", function() {
	if (checked) { return; }
	for (let q of data["questions"]) {
		if (!q[3] && data["answers"][q[0]].length > 0 && !answers.has(q[0])) {
			return false;
		}
	}

	checked = true;
	resultobj.hidden = false;
	for (let input of document.getElementsByTagName("input")) {
		input.disabled = true;
	}
	for (let button of document.getElementsByTagName("button")) {
		button.disabled = true;
	}

	if (data["quiz"][3]) {
		let correct = 0;
		let total = 0;
		for (let q of data["questions"]) {
			total++;
			if (q[3] && data["answers"][q[0]].every((a) => a[3] == answers.get(q[0]).has(a[0]))) {
				correct++;
			}
			else if (data["answers"][q[0]].some((a) => a[3] && a[0] == answers.get(q[0]))) {
				correct++;
			}
		}
		resultobj.getElementsByTagName("h1")[0].innerHTML = String(correct) + " out of " + String(total);
		if (answers.size > 0 && data["winners"].length > 0) {
			let winner = data["winners"][Math.min(Math.trunc(correct / total * data["winners"].length),  data["winners"].length - 1)];
			resultobj.getElementsByTagName("h2")[0].innerHTML = winner[2];
			resultobj.getElementsByTagName("h3")[0].innerHTML = winner[3];
		}
	}
	else {
		if (data["winners"].length <= 0) { return; }

		let points = new Map();
		for (let w of data["winners"]) {
			points.set(w, 0);
		}

		for (let q of data["questions"]) {
			for (let a of data["answers"][q[0]]) {
				if (answers.get(q[0]) == a[0] || (answers.get(q[0]) instanceof Set && answers.get(q[0]).has(a[0]))) {
					let w = data["winners"].find((e) => e[0] == a[4]);
					if (!w) {
						continue;
					}
					points.set(w, points.get(w) + 1);
				}
			}
		}

		let results = [];
		for (let winner of data["winners"]) {
			if (results.length == 0 || points.get(winner) == points.get(results[0])) {
				results.push(winner);
			}
			else if (points.get(winner) > points.get(results[0])) {
				results = [];
				results.push(winner);
			}
		}
		// console.log(answers);
		// console.log(points);
		// console.log(results);

		// https://gist.github.com/c0derabbit/9ad0c77f2713de58fa1c4c0e74199d33
		let picked = results[Math.floor(Math.random() * results.length)];
		resultobj.getElementsByTagName("h1")[0].innerHTML = picked[2];
		resultobj.getElementsByTagName("h2")[0].innerHTML = picked[3];
	}
});