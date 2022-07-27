	// ##### start of event handlers #####
	
	/* !!! General rules for event handlers !!!
	 *
	 * Don't change the document directly; always use commit_changes to
	 * change the game state.
	 *
	 * Exception: Things that should not be visible in both the game
	 * window and in undo/redo can be changed directly.
	 */
	
	// update state of play buttons
	function mute_changed() {
		var muted = $('#chk_mute').is(':checked');
		$('#audio > input:button').attr('disabled', muted);
	}

	// go to given screen
	// parameter: screen name
	function goto_screen(screen) {
		var changes = {'screen': screen};

		// save changes from settings screen
		if (screen == 'rounds') {
			changes['teams.0.name'] = $('#txt_name_0').val();
			changes['teams.1.name'] = $('#txt_name_1').val();
		}

		state.commit_changes(changes);
	}

	// answer was clicked
	// parameter: answer index
	function right_answer_given(idx_a) {
		var changes = {};
		var current_state = state.get_consolidated();
		var idx_r = current_state['round.id'];
		
		// show answer
		var setting = 'round.answers_shown.'+idx_a;
		changes[setting] = idx_r;
		
		// add points
		setting = 'round.points';
		var round_points = current_state[setting];
		var answer_points = answers_rounds[idx_r][idx_a][1];
		changes[setting] = round_points+answer_points * multiplicator[idx_r];
		
		state.commit_changes(changes);

		play_sound('yeah');
	}
	
	// team gave wrong answer
	// parameter: team (0 or 1)
	function wrong_answer_given(team) {
		var changes = {};
		var setting = 'teams.'+team+'.misses';
		changes[setting] = state.get_consolidated()[setting]+1;
		state.commit_changes(changes);

		play_sound('buh');
	}

	// given team has won the current round
	// parameter: team (0 or 1)
	function team_won_round(team) {
		var changes = {};
		var setting = 'teams.'+team+'.points';
		
		var current_state = state.get_consolidated();
		var round_points = current_state['round.points'];
		var team_points = current_state[setting];
		
		changes[setting] = team_points+round_points;
		changes['round.finished'] = true;
		state.commit_changes(changes);
		
		play_sound('yeah');
	}
	
	// start next round
	function goto_next_round() {
		var changes = {};
		var current_state = state.get_consolidated();

		changes['round.id'] = current_state['round.id']+1;
		changes['round.points'] = 0;
		changes['round.finished'] = false;
		
		for (var a = 0; a < max_answers; a++) {
			changes['round.answers_shown.'+a] = -1;
		}

		changes['teams.0.misses'] = 0;
		changes['teams.1.misses'] = 0;
		state.commit_changes(changes);
	}
	
	// finals: an answer is chosen or typed in
	function finals_answer_changed(player, question) {
		var right_answer = $('#finals_answers_p'+player+'_'+question).val();
		var wrong_answer = $('#finals_wrong_answer_p'+player+'_'+question).val();
		var answer;
		
		// answer is chosen from dropdown
		if (right_answer >= 0)
			answer = parseInt(right_answer)
		
		// answer is typed in
		else if (wrong_answer != '')
			answer = wrong_answer
		
		// no answer is given
		else
			answer = -1;
		
		var changes = {};
		changes['finals.answers.'+player+'.'+question+'.id'] = answer;

		// re-calculate points
		changes = finals_recalc_points(changes);

		state.commit_changes(changes);
	}
	
	// finals: answer should be shown/hidden
	function finals_show_answer(player, question) {
		var shown = $('#finals_answer_visible_p'+player+'_'+question).is(':checked');
		var changes = {};

		changes['finals.answers.'+player+'.'+question+'.answer_shown'] = shown;
		state.commit_changes(changes);
	}
	
	// finals: points should be shown/hidden
	function finals_show_points(player, question) {
		var current_state = state.get_consolidated();
		var changes = {};

		// show/hide points
		var shown = $('#finals_points_visible_p'+player+'_'+question).is(':checked');
		changes['finals.answers.'+player+'.'+question+'.points_shown'] = shown;

		// re-calculate points
		changes = finals_recalc_points(changes);
		
		state.commit_changes(changes);

		if (shown) {
			if (typeof(current_state['finals.answers.'+player+'.'+question+'.id']) == 'string') {
				play_sound('boo');
			} else {
				play_sound('yeah');
			}
		}
	}
	
	// ##### end of event handlers #####
