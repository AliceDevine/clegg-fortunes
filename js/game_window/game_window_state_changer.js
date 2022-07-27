	// contains change handlers for the game window
	var state_changer = new Object();

	// handle teams.* settings
	state_changer.teams = function(args, value) {
		var team = args.shift();
		var setting = args.shift();
		
		switch (setting) {
			case 'name':
				// set team name
				$('#name_t'+team).text(value);
				break;
			
			case 'points':
				// set team points
				$('#team'+team+'_points').text(value);
				break;
				
			case 'misses':
				// set team misses
				for (var i = 0; i < 3; i++) {
					var text = (i < value) ? 'X' : '&nbsp;';
					$('#x_t'+team+'_'+ i).html(text);
				}
				break;
		}
	}
	
	// handle screen.* settings
	state_changer.screen = function(args, value) {
		var screen = args.shift();
		
		// switch to screen
		$('.screen').hide();
		$('#view_'+value).show();
	}
	
	// handle round.* settings
	state_changer.round = function(args, value) {
		var setting = args.shift();
		
		switch (setting) {
			case 'id':
				// switch to round
				$('#round_display').text(value+1);
		
				// update multiplicator
				if (multiplicator[value] > 1)
					$('#multiplicator_display').text('('+multiplicator[value]+'x)')
				else
					$('#multiplicator_display').empty();
		
				// set length of answers table
				$('#tbl_rounds_answers').find('td').addClass('invisible');
				for (var a = 0; a < answers_rounds[value].length; a++) {
					$('#answer_row'+a).find('td').removeClass('invisible');
				}
				break;
		
			case 'points':
				// set round points
				$('#round_points').text(value);
				break;
				
			case 'answers_shown':
				var idx_answer = args.shift();
				
				// show/hide answer
				var text;
				var points;
				
				if (value >= 0) {
					var answer = answers_rounds[value][idx_answer];
					text = answer[0];
					points = answer[1];
				} else {
					text = '&nbsp;';
					points = '&nbsp;';
				}
				//rollin effect
				answer = $('#answer'+idx_answer);
				answer.css("width", "0%");
				answer.html(text);
				answer.animate({width: '100%'}, 500);
				$('#points'+idx_answer).html(points);
				break;
		}
	}
	
	// handle finals.* settings
	state_changer.finals = function(args, value) {
		var setting = args.shift();
		
		switch (setting) {
			case 'points':
				// set points
				$('#finals_points').text(value);
				break;
				
			case 'answers':
				// configure answers display
				var player = args.shift();
				var idx_question = args.shift();
				var setting2 = args.shift();
				
				switch (setting2) {
				
					case 'id':
						// set answer text and points
						var text;
						var points;
						
						// wrong answer (given as string)
						if (typeof(value) == 'string') {
							text = value;
							points = '--';
							
						// no answer given (yet)
						} else if (value < 0) {
							text = '';
							points = '';
							
						// correct answer given (as index)
						} else {
							var answer = answers_finals[idx_question][value];
							text = answer[0];
							points = answer[1];
						}

						$('#finals_answer'+idx_question+'-'+player).text(text);
						$('#finals_points'+idx_question+'-'+player).text(points);
						break;
						
					case 'answer_shown':
						// show/hide answer
						$('#finals_answer'+idx_question+'-'+player).toggle(value);
						$('#finals_answer'+idx_question+'-'+player+'-empty').toggle(!value);
						break;
						
					case 'points_shown':
						// show/hide points
						$('#finals_points'+idx_question+'-'+player).toggle(value);
						$('#finals_points'+idx_question+'-'+player+'-empty').toggle(!value);
						break;
				}
				break;
		}
	}

