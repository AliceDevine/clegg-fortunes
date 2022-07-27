	// play sound object
	function play_sound(sound) {
		if (!$('#chk_mute').is(':checked')) {
			$('#audiodummy').html('<audio src="sfx/'+sound+'.ogg" autoplay="autoplay" / >');
		}
	}

