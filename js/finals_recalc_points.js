	// helper for finals: re-calculate total points
    // called from event_handlers.js when an answer is changed or points need to be shown in the finals
    
	function finals_recalc_points(changes) {
	
		// combine state from history with current changes
		var current_state = state.get_consolidated();
		$.each(changes, function(setting, value) {
			current_state[setting] = value;
		});

		// re-calculate total points
		changes['finals.points'] = 0;
		for (var p = 0; p < 2; p++) {
			for (var q = 0; q < questions_finals.length; q++) {
				var points_shown = current_state['finals.answers.'+p+'.'+q+'.points_shown'];
				var id = current_state['finals.answers.'+p+'.'+q+'.id'];
				var question_points = 0;
				
				if ((typeof(id) == 'number') && (id >= 0))
					question_points = answers_finals[q][id][1];					
				
				if (points_shown) {
					changes['finals.points'] += question_points;
				}
			}
		}
		
		return changes;
	}
	
