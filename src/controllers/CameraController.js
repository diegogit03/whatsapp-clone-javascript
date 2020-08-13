export default class CameraController{

	constructor(videoEl){

		this._videoEl = videoEl;

		navigator.mediaDevices.getUserMedia({
			video: true
		}).then(stream=>{

			this._stream = stream;
			this._videoEl.srcObject = new MediaStream(stream);
			this._videoEl.play();

		}).catch(error=>{

			console.error(error);

		});

	}

	stop(){

		this._stream.getTracks().forEach(track=>{

			track.stop();

		});

	}

	takePicture(mimeType = 'image/png'){

		let canvas = document.createElement('canvas');

		canvas.setAttribute('height', this._videoEl.videoHight);
		canvas.setAttribute('width', this._videoEl.videoWidth);

		let context = canvas.getContext('2d');

		context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);
		this.stop();

		return canvas.toDataURL(mimeType);

	}

}