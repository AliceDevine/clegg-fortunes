	// tasks to be run after DOM is fully loaded
	$(document).ready(function() {
	
		// calculate maximum number of answers per round
		$.each(answers_rounds, function(idx_round, answers) {
			if (answers.length > max_answers)
				max_answers = answers.length;
		});
		
		// initialize answer table for rounds
		var tbl_rounds_answers = $('#tbl_rounds_answers');
		for (var i = 0; i < max_answers; i++) {
			tbl_rounds_answers.append(
				'<tr id="answer_row'+i+'">' +
				'<td class="answer_priority">'+(i+1)+'.</td>' +
				'<td class="answer"><span id="answer'+i+'" class="answer_span">&nbsp;</span></td>' +
				'<td class="answer_points" id="points'+i+'"></td>' +
				'</tr>'
			);
		}

		// initialize answer table for finals
		var tbl_finals_answers = $('#tbl_finals_answers');
		for (var i = 0; i < answers_finals.length; i++) {
			tbl_finals_answers.append(
				'<tr>' +
				'<td class="answer"><span id="finals_answer'+i+'-0"></span><span id="finals_answer'+i+'-0-empty">&nbsp;</span></td>' +
				'<td class="answer_points"><span id="finals_points'+i+'-0"></span><span id="finals_points'+i+'-0-empty">&nbsp;</span></td>' +
				'<td class="answer_points"><span id="finals_points'+i+'-1"></span><span id="finals_points'+i+'-1-empty">&nbsp;</span></td>' +
				'<td class="answer"><span id="finals_answer'+i+'-1"></span><span id="finals_answer'+i+'-1-empty">&nbsp;</span></td>' +
				'</tr>'
			);
		}
		
		// notify control window
		window.opener.game_window_init_done();
	});

