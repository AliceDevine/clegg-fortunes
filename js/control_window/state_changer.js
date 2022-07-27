
	// ##### start of state changer #####
	
	/* !!! General rules for state changer !!!
	 * 
	 * Don't use state from the document as it may not be valid at all.
	 * Only state from state variables is guaranteed to be correct
	 * (think undo/redo).
	 *
	 * Don't trigger further state changes as these can degrade
	 * usability of undo/redo and might cause loops. Watch for document
	 * changes that trigger event handlers which trigger state changes!
	 */ 


	// helper to publish changes to the game and control windows
	// Only to be called from State() objects!
	function publish_changes(changes) {

		// apply changes to game window, if it has been opened
		if (game) {
			game.apply_changes(changes);
		}

		// apply changes locally
		$.each(changes, function(setting, value) {
			var args = setting.split('.');
			var toplevel = args.shift();
	
			state_changer[toplevel](args, value);
		});
	}
	

	// contains change handlers for the control window
	var state_changer = new Object();

	// handle teams.* settings
	state_changer.teams = function(args, value) {
		var team = args.shift();
		var setting = args.shift();
		
		switch (setting) {
			case 'name':
				// set team name
				$('#txt_name_'+team).val(value);
				break;
			
			case 'misses':
				// set team misses
				$('#btn_miss'+team).attr('disabled', (value >= 3))
				break;
		}
	}
	
	// handle screen.* settings
	state_changer.screen = function(args, value) {
		var screen = args.shift();
		
		// switch to screen
		$('.screen').hide();
		$('#view_'+value).show();
		
		// stop timer
		if (value != 'finals') {
			timer.stop();
		}
	}
	
	// handle round.* settings
	state_changer.round = function(args, value) {
		var setting = args.shift();
		
		switch (setting) {
			case 'id':
				var idx_r = value;
			
				// go to next round
				$('#round').text(idx_r+1);

				// generate answer buttons
				var answers = $('#answers');
				answers.empty();
				$.each(answers_rounds[idx_r], function(idx_a, answer) {
					var val = answer[0]+' ('+answer[1]+')';
					var handler = 'right_answer_given('+idx_a+');';
					answers.append('<input type="button" id="btn_answer" value="'+val+'" onclick="'+handler+'" id="answer'+idx_a+'"></input>');
				});
				
				// enable/disable "next" buttons
				if (idx_r < multiplicator.length - 1) {
					$('#btn_next_round').attr('disabled', false);
					$('#btn_goto_finals').attr('disabled', true);
				} else {
					$('#btn_next_round').attr('disabled', true);
					$('#btn_goto_finals').attr('disabled', false);
				}
				break;
		
			case 'answers_shown':
				var idx_answer = args.shift();
				
				// enable/disable answer button
				if (value >= 0)
					$('#answer'+idx_answer).attr('disabled', true)
				else
					$('#answer'+idx_answer).attr('disabled', false);
				break;

			case 'finished':
				// disable "won" buttons if finished
				$('#btn_left_wins').attr('disabled', value);
				$('#btn_right_wins').attr('disabled', value);
				break;
		}
	}

	// handle finals.* settings
	state_changer.finals = function(args, value) {
		var setting = args.shift();
		
		switch (setting) {
			case 'answers':
				var player = args.shift();
				var question = args.shift();
				var setting2 = args.shift();

				switch (setting2) {
				
					case 'id':
						// set default values for answer fields
						var right_answer_disabled = false;
						var wrong_answer_disabled = false;
						var right_answer_index = -1;
						var wrong_answer_text = '';
						
						if (typeof(value) == 'number') {
							// answer is numeric => chosen from right answers or no answer given
							right_answer_index = value;
							
							if (value >= 0) {
								wrong_answer_disabled = true;
							}
								
						} else {
							// answer is textual => wrong answer
							wrong_answer_text = value;
							right_answer_disabled = true;
						}
						
						// enable/disable answer fields
						var right_answer = $('#finals_answers_p'+player+'_'+question);
						right_answer.val(right_answer_index);
						right_answer.attr('disabled', right_answer_disabled);
						
						var wrong_answer = $('#finals_wrong_answer_p'+player+'_'+question);
						wrong_answer.val(wrong_answer_text);
						wrong_answer.attr('disabled', wrong_answer_disabled);
						break;
						
					case 'answer_shown':
						// show/hide answer
						var checkbox = $('#finals_answer_visible_p'+player+'_'+question);
						checkbox.prop("checked", value);
						break;
						
					case 'points_shown':
						// show/hide points
						var checkbox = $('#finals_points_visible_p'+player+'_'+question);
						checkbox.prop("checked", value);
						break;
				}
				break;
		}
	}
	
	// ##### end of state changer #####
