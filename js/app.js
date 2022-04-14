var n = 0;


var inpBut = document.getElementById('input-button');

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

function freqToVolume(x){
	return 1.6 * 2 ** (- x * 0.0090909);
}

function updateText(){
	var num_at_end = Math.floor((n - 3) / 12) + 5;
	
	inpBut.innerText = getLetter() + num_at_end.toString();
}

function bindEvents() {
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    
    var decayInterval = null;
    var volumeControl = null;

    inpBut.addEventListener('click',
        function() {
    		noteOn = !noteOn;
    		if(noteOn) {
    			if(decayInterval !== null){
	    			osc.stop();
    				clearInterval(decayInterval);
    			}
    			
    			var ctxClass = window.audioContext || window.AudioContext || window.AudioContext || window.webkitAudioContext;
    			var ctx = new ctxClass();
    			osc = ctx.createOscillator();
    			osc.type = 'sine';
    			volumeControl = ctx.createGain();
    			osc.connect(volumeControl);
    			volumeControl.connect(ctx.destination);
    			
    			osc.frequency.value = 440 * (2 ** (1/12)) ** n;
    			volumeControl.gain.value = freqToVolume(osc.frequency.value);
    			
    			//console.log(volumeControl.gain.value);
    			
    			osc.start();
    		} else {
    			decayInterval = setInterval(function() {
    				volumeControl.gain.value -= 0.01;
    				
    				if(volumeControl.gain.value <= 0) {
    	    			osc.stop();
    	    			clearInterval(decayInterval);
    	    			decayInterval = null;
    				}
    			}, 30);
    			
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