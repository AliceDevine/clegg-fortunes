	// ##### start of API (to be called from control window) #####

	// apply changes to game window
	function apply_changes(changes) {
		$.each(changes, function(setting, value) {
			var args = setting.split('.');
			var toplevel = args.shift();
			
			state_changer[toplevel](args, value);
		});
	}
	
	// set timer value
	function set_timer(timeleft) {
		$('#timeleft').text(timeleft);
	}

	// ##### end of API (to be called from control window) #####
