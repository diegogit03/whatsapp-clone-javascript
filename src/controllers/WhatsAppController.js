//utils

import Format from './../utils/Format';

//segundary controllers

import CameraController from './CameraController';
import MicrophoneController from './MicrophoneController';
import DocumentPreviewController from './DocumentPreviewController';

export default class WhatsAppController{

	constructor(){

		this.elementsPrototype();
		this.loadElements();
		this.initEvents();

	}

	loadElements(){

		this.el = {};

		//Register all elements and format camelCase
		document.querySelectorAll('[id]').forEach(element=>{

			this.el[Format.getCamelCase(element.id)] = element;

		});

	}

	elementsPrototype(){

		Element.prototype.hide = function(){

			this.style.display = 'none';

			return this;

		}

		Element.prototype.show = function(){

			this.style.display = 'block';

			return this;

		}

		Element.prototype.toggle = function(){

			this.style.display = (this.style.display === 'none')? 'block' : 'none';

			return this;

		}

		Element.prototype.on = function(events, action){

			events.split(' ').forEach((event)=>{

				this.addEventListener(event, action);

			});

			return this;

		}

		Element.prototype.css = function(styles){

			for(let name in styles){

				this.style[name] = styles[name];

			}

			return this;

		}

		Element.prototype.addClass = function(name){

			this.classList.add(name);

			return this;

		}

		Element.prototype.removeClass = function(name){

			this.classList.remove(name);

			return this;

		}

		Element.prototype.toggleClass = function(name){

			this.classList.toggle(name);

			return this;

		}

		Element.prototype.hasClass = function(name){

			return this.classList.contains(name);

		}

		HTMLFormElement.prototype.getForm = function(){
			
			return new FormData(this);

		}

		HTMLFormElement.prototype.toJSON = function(){

			let json = {};

			this.getForm().forEach((value, key)=>{

				json[key] = value;

			});

			return json;

		}


	}

	initEvents(){

		this.el.myPhoto.on('click',event=>{

			this.closeAllLeftPanel();
			this.el.panelEditProfile.show();
			setTimeout(()=>{
				this.el.panelEditProfile.addClass('open');
			}, 300);
		});

		this.el.btnNewContact.on('click',event=>{

			this.closeAllLeftPanel();
			this.el.panelAddContact.show();
			setTimeout(()=>{
				this.el.panelAddContact.addClass('open');	
			}, 300);
		
		});

		this.el.btnClosePanelEditProfile.on('click',event=>{

			this.el.panelEditProfile.removeClass('open');

		});

		this.el.btnClosePanelAddContact.on('click',event=>{

			this.el.panelAddContact.removeClass('open');

		});

		this.el.photoContainerEditProfile.on('click',event=>{

			this.el.inputProfilePhoto.click();

		});

		this.el.inputNamePanelEditProfile.on('keypress',event=>{

			if (event.key === 'Enter') {

				event.preventDefault();
				this.el.btnSavePanelEditProfile.click();

			}

		});

		this.el.btnSavePanelEditProfile.on('click',event=>{

			console.log(this.el.inputNamePanelEditProfile.innerHTML);

		});

		this.el.formPanelAddContact.on('click',event=>{

			event.preventDefault();

			let formData = new FormData(this.el.formPanelAddContact);

		});

		this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item=>{

			item.on('click',event=>{

				this.el.home.hide();

				this.el.main.css({
					display: 'flex'
				})

			});

			this.el.btnAttach.on('click',event=>{


				event.stopPropagation();
				this.el.menuAttach.addClass('open');
				document.addEventListener('click',this.closeMenuAttach.bind(this));

			});

			this.el.btnAttachPhoto.on('click',event=>{

				this.el.inputPhoto.click();

			});

			this.el.inputPhoto.on('change',event=>{

				[...this.el.inputPhoto.files].forEach(file=>{



				});

			});

			this.el.btnAttachCamera.on('click',event=>{
				
				this.closeAllMainPanel();
				this.el.panelCamera.addClass('open');
				this.el.panelCamera.css({
					height: 'calc(100% - 120px)'
				});

				this._camera = new CameraController(this.el.videoCamera);

			});

			this.el.btnClosePanelCamera.on('click',event=>{

				this.closeAllMainPanel();
				this.el.panelMessagesContainer.show();
				this._camera.stop();

			});

			this.el.btnTakePicture.on('click',event=>{

				let dataUrl = this._camera.takePicture();

				this.el.pictureCamera.src = dataUrl;
				this.el.pictureCamera.show();
				this.el.videoCamera.hide();

			});

			this.el.btnAttachDocument.on('click',event=>{

				this.closeAllMainPanel();
				this.el.panelDocumentPreview.addClass('open');
				this.el.panelDocumentPreview.css({
					height: '1%'
				});
				this.el.inputDocument.click();

			});

			this.el.inputDocument.on('change',event=>{

				if(this.el.inputDocument.files.length){

					let file = this.el.inputDocument.files[0];

					this._documentPreviewController = new DocumentPreviewController(file);

					

					this._documentPreviewController.getPreviewData().then(data=>{

						this.el.imgPanelDocumentPreview.src = data.src;
						this.el.infoPanelDocumentPreview.innerHTML = data.info;
						this.el.imagePanelDocumentPreview.show();
						this.el.filePanelDocumentPreview.hide();
						this.el.panelDocumentPreview.css({
							height: 'calc(100% - 120px)'
						});

					}).catch(error=>{

						console.log('type', file.type);

						switch(file.type){

							case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
								this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
							break;

							case 'application/msword':
							case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
								this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
							break;

							case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
								this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
							break;

							default:
								this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
							break;

						}

						this.el.filenamePanelDocumentPreview.innerHTML = file.name;
						this.el.imagePanelDocumentPreview.hide();
						this.el.filePanelDocumentPreview.show();

					});

				}

			});

			this.el.btnClosePanelDocumentPreview.on('click',event=>{

				this.closeAllMainPanel();
				this.el.panelMessagesContainer.show();

			});

			this.el.btnSendDocument.on('click',event=>{

				console.log('send document');

			});

			this.el.btnAttachContact.on('click',event=>{

				this.el.modalContacts.show();

			});

			this.el.btnCloseModalContacts.on('click',event=>{

				this.el.modalContacts.hide();

			});

			this.el.btnSendMicrophone.on('click',event=>{

				this.el.recordMicrophone.show();
				this.el.btnSendMicrophone.hide();
				this.startRecordMicrophoneTime();

				this._microphoneController = new MicrophoneController();

			});

			this.el.btnCancelMicrophone.on('click',event=>{

				this._microphoneController.stop();
				this.closeRecordMicrophone();

			});

			this.el.btnFinishMicrophone.on('click',event=>{

				this._microphoneController.stop();
				this.closeRecordMicrophone();

			});

			this.el.inputText.on('keypress',event=>{

				if(event.key === 'Enter' && !event.shiftKey){

					event.preventDefault();
					this.el.btnSend.click();

				};

			});

			this.el.inputText.on('keyup',event=>{

				if(this.el.inputText.innerHTML.length){

					this.el.inputPlaceholder.hide();
					this.el.btnSendMicrophone.hide();
					this.el.btnSend.show();

				}else{

					this.el.inputPlaceholder.show();
					this.el.btnSendMicrophone.show();
					this.el.btnSend.hide();

				}

			});

			this.el.btnSend.on('click',event=>{

				console.log(this.el.inputText.innerHTML);
				this.el.inputText.innerHTML = '';

			});

			this.el.btnEmojis.on('click',event=>{

				this.el.panelEmojis.toggleClass('open');

			});

			this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji=>{

				emoji.on('click',event=>{

					let img = this.el.imgEmojiDefault.cloneNode();

					img.style.cssText = emoji.style.cssText;
					img.dataset.unicode = emoji.dataset.unicode;
					img.alt = emoji.dataset.unicode;

					emoji.classList.forEach(name=>{

						img.classList.add(name);

					});

					let cursor = window.getSelection();

					if(!cursor.focusNode || !cursor.focusNode.id == 'input-text'){

						this.el.inputText.focus();
						cursor = window.getSelection();

					};

					let range = document.createRange();

					range = cursor.getRangeAt(0);
					range.deleteContents();

					let frag = document.createDocumentFragment();

					frag.appendChild(img);

					range.insertNode(frag);

					range.setStartAfter(img);

					this.el.inputText.dispatchEvent(new Event('keyup'));

				});

			});

		});

	}

	startRecordMicrophoneTime(){

		let start = Date.now();

		this._recordMicrophoneInterval = setInterval(()=>{

			this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);

		},100);

	}

	closeRecordMicrophone(){

		this.el.recordMicrophone.hide();
		this.el.btnSendMicrophone.show();
		clearInterval(this._recordMicrophoneInterval);

	}

	closeMenuAttach(event){

		document.removeEventListener('click', this.closeMenuAttach);
		this.el.menuAttach.removeClass('open');
	}

	closeAllMainPanel(){

		this.el.panelMessagesContainer.hide();
		this.el.panelDocumentPreview.removeClass('open');
		this.el.panelCamera.removeClass('open');

	}

	closeAllLeftPanel(){

		this.el.panelEditProfile.hide();
		this.el.panelAddContact.hide();

	}

}