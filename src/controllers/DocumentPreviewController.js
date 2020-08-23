const pdfjsLib = require('pdfjs-dist');
const path = require('path');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '..', '..', 'dist', 'pdf.worker.bundle.js');

export default class DocumentPreviewController{
	constructor(file){

		this._file = file;

	}

	getPreviewData(){

		return new Promise((resolve, reject)=>{

			let reader = new FileReader();

			switch(this._file.type){

				case 'image/png':
				case 'image/jpeg':
				case 'image/jpg':
				case 'image/gif':
				reader.onload = e=>{

					resolve({
						src: reader.result,
						info: this._file.name
					});

				};
				reader.onerror = e=>{

					reject(e);

				}
				reader.readAsDataURL(this._file);
				break;

				case 'application/pdf':

				reader.onload = e => {

					pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf => {

						pdf.getPage(1).then(page => {

							let viewport = page.getViewport(1);

							let canvas = document.createElement('canvas');
							let canvasContext = canvas.getContext('2d');

							canvas.width = viewport.width;
							canvas.height = viewport.height;

							page.render({
								canvasContext,
								viewport
							}).then(()=>{

								let sToPlural = (pdf.numPages > 1)? 's': '';

								resolve({
									src: canvas.toDataURL('image/png'),
									info: `${pdf.numPages} pagina${sToPlural}`
								})

							}).catch(error=>{
								reject(error);
							});

						}).catch(error=>{

							reject(error);

						});

					}).catch(error => {

						reject(error);

					});

				}

				reader.readAsArrayBuffer(this._file);

				break;

				default:
					reject();
				break;

			}

		});

	}

}