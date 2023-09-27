export const questionhtml = `<input autocomplete="off" autofocus class="questionname" placeholder="Question" type="text">
                        <label><input type="checkbox" class="multichoice">Multiple choice</label>
                        <p>
                            <input type="button" class="addanswer" value="Add an answer">
                            <input type="button" class="delquestion" value="Delete question">
                        </p>`

export const answerhtml = `<p>
                            <input autocomplete="off" class="answername" placeholder="Answer" type="text">
                            <label>Gives a point to: <select autocomplete="off" autofocus class="answerpoint"><option value=""></option></select></label>
                            <p>
                                <label><input type="checkbox" autocomplete="off" class="iscorrect" disabled>Is correct</label>
                                <input type="button" class="delanswer" value="Delete">
                            </p>
                        </p>`

export const winnerhtml = `<input autocomplete="off" autofocus class="winnername" placeholder="Winner" type="text">
                        <input type="button" class="delwinner" value="Delete">
                        <br><textarea autocomplete="off" class="winnerdesc" placeholder="Winner description" type="text" rows="5" cols="50"></textarea>`