	// ##### start of timer #####

	var timer = new Object();

	timer._running = false;
	timer._timeleft = timers[0];

	// configure timer for given player
	timer.init = function(player) {
		this.stop();
		this.set_time(timers[player]);
	}
	
	// set timer value
	timer.set_time = function(timeleft) {
		this._timeleft = timeleft;
		if (game)
			game.set_timer(timeleft);
	}
	
	// get timer value
	timer.get_time = function(timeleft) {
		return this._timeleft;
	}
	
	// start timer
	timer.start = function() {
		this._running = true;
		window.setTimeout('timer._tick();', 1000);
		$('#btn_timer_start').attr('disabled', true);
	}
	
	// stop timer
	timer.stop = function() {
		this._running = false;
		$('#btn_timer_start').attr('disabled', false);
	}
	
	// executed once a second while timer is running
	timer._tick = function() {
		var timeleft = this.get_time() - 1;

		if (this._running) {
			this.set_time(timeleft);
		
			if (timeleft > 0) {
				window.setTimeout('timer._tick();', 1000);
			
			} else {
				this.stop();
				play_sound('clock');
			}
		}
	}
	
	// ##### end of timer #####
