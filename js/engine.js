let sprites = { //задаем объект СПРАЙТИ со следующими свойствами
	scene: 'back_five_dogs.jpg',
	button: 'btn_with_text.png',
	girl: 'char.png',
	circles: {
		frame: 'circle_',
		count: 8,
		format: '.png'
	},
	logo: 'logo.png',
	dog: 'doggy.png',
	sparkle: 'sparkle.png'
}

let ini = { //задаю координаты местонахождения собак: 1 - ПК, 2 - мобайл
	width: 0,
	height: 0,
	stage: 1,
	factor: 1,
	preset: [
		[[90,270,0.8,1],[50,190,0.8,1]],
		[[510,380,1,1],[260,200,0.7,-1]],
		[[370,60,0.6,-1],[400,60,0.6,1]],
		[[610,80,0.6,1],[460,420,1,-1]],
		[[520,210,0.8,-1],[50,380,0.7,1]]
	],
	dogs: []
}

function getResolution(ax) { //определяю разрешение экрана для игры
	if(ax == 'width') {
		if(window.innerWidth < window.innerHeight) {
			ini.factor = 2;
			return window.innerWidth;
		} else {
			ini.factor = 1;
			return 752; //разрешение фона (ширина)
		}
	} else if (ax == 'height') {
		if(window.innerWidth < window.innerHeight) {
			ini.factor = 2;
			return window.innerHeight/2 + window.innerHeight/3;
		} else {
			ini.factor = 1;
			return 536; //разрешение фона (высота)
		}
	}
}

function initScene() { // функция для загрузки спрайтов
	for(let i in sprites) {
		if(sprites[i].count) {
			for(let k = 1; k <= sprites[i].count; k++) {
				PIXI.loader.add('assets/' + sprites[i].frame + '' + k + '' + sprites[i].format);
			}
		} else {
			PIXI.loader.add('assets/' + sprites[i]);
		}
	}
	for(let i in ini.preset) {
		if(ini.factor == 1) {
			ini.dogs.push(ini.preset[i][0]);
		} else {
			ini.dogs.push(ini.preset[i][1]);
		}
	}
	setup();
}


let setupContainer = new PIXI.Container();
let backgroundImage;
let dogs = [];
let loopTextures = [];
let dogsContainer = new PIXI.Container();
let allDogsSpotted = false;
let dogsSpotted = 0;
function setup() {
	let topText = new PIXI.Text('5 Hidden Dogs', {fontSize: ini.factor == 1 ? 48 : 32, fill: 0xffffff, fontWeight: 'bold', align: 'left'});
	let subText = new PIXI.Text('Can you spot them?', {fontSize: ini.factor == 1 ? 32 : 16, fill: 0xffffff, fontWeight: 'bold', align: 'center'});
	topText.anchor.set(0.5, 0.3); //устанавливаю якорь
	topText.position.set(ini.width/2.3, ini.height/2.5); //центрирование
	subText.anchor.set(0.5, 0.3); //устанавливаю якорь
	subText.position.set(ini.width/2, ini.height/1.8); //центрирование
	setupContainer.addChild(topText); //помещаю в контейнер
	setupContainer.addChild(subText); // помещаю в контейнер
	let bgTexture = new PIXI.Texture.fromImage('assets/' + sprites.scene);
	backgroundImage = new PIXI.Sprite(bgTexture);
	backgroundImage.anchor.set(0.5,0.5);
	backgroundImage.position.set(ini.width/2, ini.height/2);
	backgroundImage.alpha = 0; //слой прозрачности
	app.stage.addChild(backgroundImage);
	let buttonTexture = new PIXI.Texture.fromImage('assets/' + sprites.button);
	let button = new PIXI.Sprite(buttonTexture);
	button.buttonMode = true;
	button.anchor.set(0.5,0.5);
	button.position.set(ini.width/2, ini.height - ini.height/10);
	button.interactive = true;
	button.on('pointertap', buttonTrigger);
	app.stage.addChild(button);
	let dogTexture = new PIXI.Texture.fromImage('assets/' + sprites.dog);
	let previewDog = new PIXI.Sprite(dogTexture);
	let textBounds = topText.getBounds();
	previewDog.position.set(textBounds.x + textBounds.width,ini.height/2.5 - 70);
	setupContainer.addChild(previewDog);
	app.stage.addChild(setupContainer);
	for(let i = 1; i < sprites.circles.count+1; i++) {
		loopTextures.push(PIXI.Texture.fromImage('assets/' + sprites.circles.frame + i + sprites.circles.format));
	}
	setTimeout(()=>{ini.stage = 2;initStageTwo()},5000);
}

function initFinalScene() {
	setupContainer = new PIXI.Container();
	let girl = new PIXI.Sprite(PIXI.Texture.fromImage('assets/' + sprites.girl));
	girl.scale.set(ini.factor == 1 ? 0.6 : 0.4);
	girl.position.set(ini.factor == 1 ? -10 : ini.width/2, ini.factor == 1 ? 50 : ini.height/1.8);
	if(ini.factor == 2) {
		girl.anchor.set(0.5);
	}
	let topText = new PIXI.Text('Great Job', {fontSize: 48, fill: 0xffffff, fontWeight: 'bold', align: 'left', dropShadow: true});
	let subText = new PIXI.Text('Can you solve \nevery mystery?', {fontSize: 32, fill: 0xffffff, fontWeight: 'bold', align: 'center', dropShadow: true});
	topText.anchor.set(0.5, 0.3);
	topText.position.set(ini.width/2, ini.height/2);
	subText.anchor.set(0.5, 0.3);
	subText.position.set(ini.width/2, ini.height/1.6);
	let logo = new PIXI.Sprite(PIXI.Texture.fromImage('assets/' + sprites.logo));
	logo.scale.set(0.8)
	logo.position.set(ini.width/2, ini.height/5);
	logo.anchor.set(0.5,0.5);
	setupContainer.addChild(girl);
	setupContainer.addChild(topText);
	setupContainer.addChild(subText);
	setupContainer.addChild(logo);
	setupContainer.alpha = 0;
	app.stage.addChild(setupContainer);
	setTimeout(()=>{allDogsSpotted = true},400);
}

function initStageTwo() {
	setupContainer.parent.removeChild(setupContainer);
	setupContainer.destroy({children:true, texture:true, baseTexture:true});
	for(let i = 0; i < ini.dogs.length; i++) {
		let dogtexture = new PIXI.Texture.fromImage('assets/' + sprites.dog);
		let dog = new PIXI.Sprite(dogtexture);
		dog.position.set(ini.dogs[i][0],ini.dogs[i][1]);
		dog.scale.set(ini.dogs[i][2]);
		dog.scale.x *= ini.dogs[i][3];
		dog.alpha = 0;

		let trigger = new PIXI.Sprite(dogtexture);
		trigger.position.set(ini.dogs[i][0],ini.dogs[i][1]);
		trigger.scale.set(ini.dogs[i][2]);
		trigger.scale.x *= ini.dogs[i][3];
		trigger.alpha = 0;
		trigger.interactive = true;
		trigger.on('pointertap', function() {
			let k = 0, loop = sprites.circles.count;

			var timer = setInterval(function() {
				if (k < loop) {
					if(k == 0) {
						trigger.anchor.set(0.15);
					}
					trigger.texture = loopTextures[k];
					k++;
				} else {
					clearInterval(timer);
					trigger.removeAllListeners();
					dogsSpotted++;
					if(dogsSpotted == 5) {
						initFinalScene();
					}
				}
			}, 50);
		});

		app.stage.addChild(dog);
		app.stage.addChild(trigger);
		dogs.push([dog,trigger]);
	} 
	setTimeout(()=>{
		ini.stage = 3;
	},700);
}

function buttonTrigger() {
	window.open('https://www.g5e.com/');
}

ini.width = getResolution('width');
ini.height = getResolution('height');

let app = new PIXI.Application({
	width: ini.width,
	height: ini.height,
	backgroundColor: 0x000000
});

app.ticker.add((delta) => {
	switch(ini.stage) {
		case 1:
			setupContainer.scale.x += 0.001;
			setupContainer.scale.y += 0.001;
			setupContainer.position.x -= delta * 0.315;
			setupContainer.position.y -= delta * 0.315;
		break;
		case 2:
			setupContainer.alpha -= 0.02;
			if(backgroundImage.alpha < 1) {
				backgroundImage.alpha += 0.02;
				dogsContainer.alpha += 0.02;
				for(let i in dogs) {
					dogs[i][0].alpha += 0.03;
					dogs[i][1].alpha += 0.03;
				}
			}
		break;
		case 3:
			if(allDogsSpotted) {
				if(backgroundImage.alpha > 0) {
					backgroundImage.alpha -= 0.02;
					for(let i in dogs) {
						dogs[i][0].alpha -= 0.03;
						dogs[i][1].alpha -= 0.03;
					}
					setupContainer.alpha += 0.03;

				}
			}
		break;

	}
});

document.body.appendChild(app.view);
initScene();