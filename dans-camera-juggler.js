
/*


I want to show off a 3D object on a web site. It should work on the desktop, on a phone/tablet,
and with a VR headset/Google Cardboard. Some scenes I want to show using orbit controls,
and some scenes I want to use a free look camera. 

This component exists to juggle camera controls as needed to accomplish that. We need to switch
between several cameras in AFrame (or to add/remove controllers to a single camera)


I. Orbit-controls paradigm
	A. On Desktop:
		1. start: use orbit controls
		2. enter-vr: Switch active cam to look-controls. 
		3. exit-vr: Switch active to orbit cam
	B. On mobile:
		start: use orbit-controls
		enter-vr: Switch active cam to look-controls. 
		exit-vr: Switch active to orbit cam

II. Look-controls paradigm
	A. On Desktop:
		1. start: use look-controls
		2. enter-vr: Remain in look-controls mode
		3. exit-vr: Reset camera pitch to 0'. Remain in look-controls mode
	B. On mobile:
		1. start: use multitouch-look-controls*
		2. enter-vr: switch to regular look-controls
		3. exit-vr: switch to multitouch-look-controls

*multitouch-look-controls adds bounded +/- pitch as a touch gesture, and adds pinch-to-dolly as a gesture

*/


AFRAME.registerComponent('dans-camera-juggler', {

	schema: {
		paradigm:   { type: 'string', default:''}, // Can be 'freelook' or 'orbit'
		orbitCamID: { type: 'string', default:"#camera_orbit" },
		lookCamID:  { type: 'string', default:"#camera_look" },
		touchlookCamID:  { type: 'string', default:"#camera_touchlook" },
	},


	// This component should only be instantiated once per scene
	multiple: false,


	switchToOrbitCam: function () {

		console.log('switchToOrbitCam');

		if (this.data.orbitCamEl) {
			this.data.orbitCamEl.setAttribute('camera',{active: true});
			this.data.orbitCamEl.play(); // We must call play() and pause() in addition to setting the 'active' property. This may change in the future: https://github.com/aframevr/aframe/issues/2671
		}
		this.data.lookCamEl.setAttribute('camera',{active: false});
		this.data.lookCamEl.pause();
		if (this.data.tlookCamEl){
			this.data.tlookCamEl.setAttribute('camera',{active: false});
			this.data.tlookCamEl.pause();
		}

	},


	switchToLookCam: function () {

		console.log('switchToLookCam');

	 	if (this.data.orbitCamEl) {
			this.data.orbitCamEl.setAttribute('camera',{active: false});
			this.data.orbitCamEl.pause();
		}

		this.data.lookCamEl.setAttribute('camera',{active: true});
		this.data.lookCamEl.play();

		if (this.data.tlookCamEl){
			this.data.tlookCamEl.setAttribute('camera',{active: false});
			this.data.tlookCamEl.pause();
		}

	},

	switchToTouchlookCam: function () {

		console.log('switchToTouchlookCam');

		if (!this.data.tlookCamEl) { console.error('touchlook cam not found'); return; }

		if (this.data.orbitCamEl){
			this.data.orbitCamEl.setAttribute('camera',{active: false});
			this.data.orbitCamEl.pause();
		}		
		this.data.lookCamEl.setAttribute('camera',{active: false});
		this.data.lookCamEl.pause();
		this.data.tlookCamEl.setAttribute('camera',{active: true});
		this.data.tlookCamEl.play();

	},


	init: function(){

		this.data.orbitCamEl = document.querySelector(this.data.orbitCamID);
		this.data.lookCamEl = document.querySelector(this.data.lookCamID);
		this.data.tlookCamEl = document.querySelector(this.data.touchlookCamID);

		/*
		I. Orbit-controls paradigm
		*/
		if (this.data.paradigm==='orbit') {

			// I.B On mobile:
			if (AFRAME.utils.device.isMobile()) {

				// I.B.1. start: use orbit-controls
				this.switchToOrbitCam();
				// We have to call this again after 1ms because the initialization sequence (scene, cameras, etc) is not clear...
				setTimeout(this.switchToOrbitCam.bind(this), 1);

				//  I.B.2. enter-vr: save orbit cam position. Switch active cam to look-controls. 
				AFRAME.scenes[0].addEventListener('enter-vr', this.switchToLookCam.bind(this));

				//  I.B.3. exit-vr: save look-control position. Restore orbit-cam position. Switch active to orbit cam
				AFRAME.scenes[0].addEventListener('exit-vr', this.switchToOrbitCam.bind(this));

			//I.A On Desktop:
			} else {

				//I.A.1. start: use orbit controls
				this.switchToOrbitCam();
				// We have to call this again after 1ms because the initialization sequence (scene, cameras, etc) is not clear...
				setTimeout(this.switchToOrbitCam.bind(this), 1);

				//I.A.2. enter-vr: save orbit cam position. Switch active cam to look-controls. 
				AFRAME.scenes[0].addEventListener('enter-vr', this.switchToLookCam.bind(this));

				//I.A.3. exit-vr: save look-control position. Restore orbit-cam position. Switch active to orbit cam
				AFRAME.scenes[0].addEventListener('exit-vr', this.switchToOrbitCam.bind(this));

			} // mobile or desktop?

		} // end if paradigm=='orbit'


		/*
		II. Look-controls paradigm
		*/
		else if (this.data.paradigm==='freelook') {

			// II.B On mobile:
			if (AFRAME.utils.device.isMobile()) {
				// II.B.1. start: use multitouch-look-controls*
				this.switchToTouchlookCam();
				setTimeout(this.switchToTouchlookCam.bind(this), 1);

				// II.B.2. enter-vr: switch to regular look-controls
				AFRAME.scenes[0].addEventListener('enter-vr', this.switchToLookCam.bind(this));

				//	3. exit-vr: switch to multitouch-look-controls
				AFRAME.scenes[0].addEventListener('exit-vr', this.switchToTouchlookCam.bind(this));

			// II.A On Desktop:
			} else {
				// II.A.1. start: use look-controls
				this.switchToLookCam();
				setTimeout(this.switchToLookCam.bind(this), 1);

				// II.A.2. enter-vr: Remain in look-controls mode
					// do nothing.

				// II.A.3. exit-vr: Reset camera pitch to 0'. Remain in look-controls mode
					// do nothing.

			} // mobile or desktop?

		} // end if paradigm=='freelook'


		/*
			III. Other paradigms can be implemented in the future.
		*/
		else {
			console.error('Unknown paradigm (must be freelook or orbit): '  + this.data.paradigm);
		}



	} // end init() function
});

