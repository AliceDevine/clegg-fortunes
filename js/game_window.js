	// open the game in a popup window
	function open_game_window() {
		game = window.open('popup.html', 'game', 'width=1024,height=768,resizable=yes');
	}
	
	// callback when game window is initialized
	function game_window_init_done() {
		game.apply_changes(state.get_consolidated());
		game.set_timer(timer.get_time());
	}
	
	// callback when game window is closed
	function game_window_closed() {
		game = null;
	}

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
	
