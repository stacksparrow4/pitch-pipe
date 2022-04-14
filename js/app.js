var n = 0;

function getLetter(){
	switch(((n % 12) + 12) % 12) {
	case 0:
		return "A";
	case 1:
		return "A#";
	case 2:
		return "B";
	case 3:
		return "C";
	case 4:
		return "C#";
	case 5:
		return "D";
	case 6:
		return "D#";
	case 7:
		return "E";
	case 8:
		return "F";
	case 9:
		return "F#";
	case 10:
		return "G";
	case 11:
		return "G#";
	}
}

function updateText(){
	var num_at_end = Math.floor((n - 3) / 12) + 5;
	
	document.getElementById('direction-button').innerText = getLetter() + num_at_end.toString();
}

function bindEvents() {
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    
    var inpBut = document.getElementById('direction-button');

    inpBut.addEventListener('click',
        function() {
    		noteOn = !noteOn;
    		if(noteOn) {
    			var ctxClass = window.audioContext || window.AudioContext || window.AudioContext || window.webkitAudioContext;
    			var ctx = new ctxClass();
    			osc = ctx.createOscillator();
    			osc.type = 'sine';
    			var volume = ctx.createGain();
    			osc.connect(volume);
    			volume.connect(ctx.destination);
    			volume.gain.value = 0.1;
    			
    			osc.frequency.value = 440 * (2 ** (1/12)) ** n;
    			
    			osc.start();
    		} else {
    			osc.stop();
    			//n--;
    			//updateText();
    		}
    		
    		inpBut.style.backgroundColor = "rgba(0,0,0," + (noteOn ? "0.2" : "0") + ")";
        },
        false);

    // Handle rotarydetent event
    document.addEventListener('rotarydetent', function(ev) {
        var direction = ev.detail.direction;

        if(direction === "CW") {
        	n++;
			updateText();
        } else {
        	n--;
			updateText();
        }
        
        if (noteOn) {
			osc.frequency.value = 440 * (2 ** (1/12)) ** n;
        }
    });
}

function init() {
    bindEvents();
}

var noteOn = false;
var osc;


window.onload = init;