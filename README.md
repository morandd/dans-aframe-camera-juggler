# dans-aframe-camera-juggler
AFrame component to activate the appropriate camera controller in desktop, mobile, and VR modes

AFrame offers a number of camera controllers for mouse, touch, and free-look, but there is no one controller that works intuitively in desktop, mobile, and VR mode. This component offers a solution. 

The necessity that birthed this invention is as follows: I want to show off a 3D object on a web site. It should work on the desktop, on a phone/tablet, and with a VR headset/Google Cardboard. Some scenes I'd like to show with orbit cam, and other scenes should be seen
with a free-look camera. This component exists to juggle cameras as needed to accomplish this goal.

There are two paradigms for this controller: `orbit` and `freelook`. Here is the logic:
```
I. Orbit-controls paradigm
	A. On Desktop:
		1. start: use orbit-cam
		2. enter-vr: Switch cam to look-cam. 
		3. exit-vr: Switch to orbit-cam
	B. On mobile:
		1. start: use orbit-cam
		2. enter-vr: Switch cam to look-cam. 
		3. exit-vr: Switch to orbit-cam

II. Look-controls paradigm
	A. On Desktop:
		1. start: Use look-cam
		2. enter-vr: Remain in look-cam
		3. exit-vr: Remain in look-cam. Reset camera pitch to 0'. 
	B. On mobile:
		1. start: Use multitouch-look-cam*
		2. enter-vr: Switch to look-cam
		3. exit-vr: Switch to multitouch-look-cam
```

* There was no good free-look controller designed for touch input, so I built one: [multitouch-look-controls](https://github.com/morandd/aframe-multitouch-look-controls/). The AFrame look-controls on mobile uses the 'magic window' paradigm, taking camera controls from the phone deviceorientation. But in some cases it's more usable to have a touch-driven look controller, so folks can explore with their fingers instead of waving the phone about. 
[multitouch-look-controls](https://github.com/morandd/aframe-multitouch-look-controls/) provides yaw, pitch, dolly, and pinch to zoom.


# API #
Attribute | Description | Default
--- | --- | ---
paradigm | Required. Either 'freelook' or 'orbit' | ''
orbitCamID | DOM id of the camera with orbit controls | #camera_orbit
lookCamID | DOM id of the camera with look-controls | #camera_look
touchlookCamID | DOM id of the camera with multitouch-look-controls | #camera_touchlook


# Using #

Include in page and add it to your `a-scene`. To use it, set up two cameras that get juggled between.

Take a look at the example from multitouch-look-controls: [Example](https://morandd.github.io/aframe-multitouch-look-controls/example/)

For example, for orbit paradigm:
````
<script src="https://cdn.rawgit.com/tizzle/aframe-orbit-controls-component/v0.1.6/dist/aframe-orbit-controls-component.js"></script>
<script src="https://morandd.github.io/dans-aframe-camera-juggler/dans-camera-juggler.js"></script>

<a-scene dans-camera-juggler="paradigm:orbit">
<a-entity id="camera_orbit" camera="active:true" orbit-controls>
<a-entity id="camera_look" camera="active:false" look-controls>
```

Or for freelook:

```
<script src="https://github.com/morandd/aframe-multitouch-look-controls/aframe-multitouch-look-controls.js"></script>
<script src="https://morandd.github.io/dans-aframe-camera-juggler/dans-camera-juggler.js"></script>

<a-scene dans-aframe-camera-juggler="paradigm:freelook">
<a-entity id="camera_look" camera="active:true" look-controls>
<a-entity id="camera_touchlook" camera="active:false" multitouch-look-controls>
```
