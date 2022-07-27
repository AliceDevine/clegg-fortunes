

    // audio files to be loaded
	// format: filename without extension, label
	var audiofiles = {
		'yeah': 'Yeah!',
		'boo': 'Boo!',
		'beep': 'Beep',
		'clock': 'Clock',
	};
	
	// game window
	var game = null;
	
	// maximum number of answers per question
	var max_answers;

	// state manager
	var state = null;
	
	// produces a changeset with an entry for every setting, set to a default value
	function get_initial_changeset() {
		var init = {
			'teams.0.name': 'Team left',
			'teams.0.points': 0,
			'teams.0.misses': 0,
			'teams.1.name': 'Team right',
			'teams.1.points': 0,
			'teams.1.misses': 0,
			'screen': 'splash',
			'round.id': 0,
			'round.points': 0,
			'round.finished': false,
			'finals.points': 0
		}
	
		for (var a = 0; a < max_answers; a++)
			init['round.answers_shown.'+a] = -1;
	
		for (var q = 0; q < answers_finals.length; q++) {
			for (var p = 0; p < 2; p++) {
				init['finals.answers.'+p+'.'+q+'.id'] = -1;
				init['finals.answers.'+p+'.'+q+'.answer_shown'] = false;
				init['finals.answers.'+p+'.'+q+'.points_shown'] = false;
			}
		}
	
		return init;
	}

