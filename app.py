import sqlite3, json
from flask import *


# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.route("/create")
def create():
	return render_template("create.html")


@app.route("/", methods=["GET", "POST"])
def index():
	with sqlite3.connect('quizzes.db') as con:
		cur = con.cursor()

		if request.method == "POST":
			data = json.loads(request.data)
			# print(data)

			if type(data) != dict:
				abort(400)

			cur.execute("insert into quizzes (name, description, hascorrect) values (?, ?, ?)", (str(data.get("name", "")),
				str(data.get("description", "")), bool(data.get("hascorrect", 0))))
			quizid = cur.lastrowid

			# jsid: sqlid
			winnerids = {}
			if "winners" in data:
				if type(data["winners"]) != dict:
					con.rollback()
					abort(400)

				for wid, winner in data["winners"].items():
					if type(winner) != dict:
						con.rollback()
						abort(400)

					cur.execute("insert into winners (quizid, name, description) values (?, ?, ?)", (quizid,
						str(winner.get("name", "")), str(winner.get("description", ""))))
					winnerids[wid] = cur.lastrowid


			if "questions" in data:
				if type(data["questions"]) != list:
					con.rollback()
					abort(400)

				for question in data["questions"]:
					if type(question) != dict:
						con.rollback()
						abort(400)

					cur.execute("insert into questions (quizid, name, multichoice) values (?, ?, ?)", (quizid,
						str(question.get("name", "")), bool(question.get("multichoice", ""))))
					questionid = cur.lastrowid

					if "answers" in question:
						if type(question["answers"]) != list:
							con.rollback()
							abort(400)

						for answer in question["answers"]:
							if type(answer) != dict:
								con.rollback()
								abort(400)

							cur.execute("insert into answers (questionid, name, iscorrect, winnerid) values (?, ?, ?, ?)", (questionid,
								str(answer.get("name", "")), bool(answer.get("iscorrect", "")), winnerids.get(str(answer.get("winnerid", "")))))

			con.commit()
			return redirect("/")

		cur.execute("select id, name, description from quizzes")
		return render_template("index.html", quizzes=cur.fetchall())


@app.route("/play")
def play():
	with sqlite3.connect('quizzes.db') as con:
		cur = con.cursor()

		# id, name, description, hascorrect
		cur.execute("select * from quizzes where id = ?", (int(request.args.get("quizid")), ))
		quiz = cur.fetchone()
		if not quiz:
			abort(404)

		# id, quizid, name, description
		cur.execute("select * from winners where quizid = ?", (quiz[0], ))
		winners = cur.fetchall()

		# id, quizid, name, multichoice
		cur.execute("select * from questions where quizid = ?", (quiz[0], ))
		questions = cur.fetchall()

		# id, questionid, name, iscorrect, winnerid
		answers = {}
		for q in questions:
			cur.execute("select * from answers where questionid = ?", (q[0], ))
			answers[q[0]] = cur.fetchall()

		return render_template("play.html", data={"quiz": quiz, "questions": questions, "winners": winners, "answers": answers})