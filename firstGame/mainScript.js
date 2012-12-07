//Datos importantes de Canvas
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
//Creamos el objeto de la nave
var spaceShip = {
	x:100,
	y:300,
	width:50,
	height:50,
	counter:0
};
//Objeto texto para responder al usuario
var answerText = {
	counter: -1,
	title: '',
	subtitle: ''
};
//Definimos las variables para las imágenes
var imgSpaceShip, imgInvader,imgShoot,imgInvaderShoot,soundDeadSpace,soundDeadInvader,soundEndGame,space;
//Definimos las variables para los sonidos
var soundShoot, soundInvaderShoot;
//Array para los disparos
var shoots = [];
//Aray para los enemigos
var invaders = [];
//Array para los misiles de los enemigos
var invaderShoots = [];
//Creamos el obj del teclado
var keyboard = {};
//Creamos el objeto del juego para manipular sus estados
var game = {
	state : "start"
}
//Las funciones de aquí controlan cada parte del juego
function drawSpaceShip()
{
	//Esta función dibuja la nave en base a los datos del objeto
	//ctx.fillStyle = 'white';
	ctx.drawImage(imgSpaceShip,spaceShip.x,spaceShip.y,spaceShip.width,spaceShip.height);
}
function drawShoots()
{
	//Dibujamos los disparos que ha hecho nuestra nave
	ctx.fillStyle = 'white';
	for(var i in shoots)
	{
		var shoot = shoots[i];
		ctx.drawImage(imgShoot,shoot.x,shoot.y,shoot.width,shoot.height);
	}
}
function drawInvaders()
{
	//Función que dibuja los enemigos de nuestro juego
	for(var i in invaders)
	{
		var invader = invaders[i];
		if(invader.state == 'alive')
		{
			ctx.fillStyle = 'red';
		}
		if(invader.state == 'hit')
		{
			ctx.fillStyle = 'purple';
		}
		if(invader.state == 'dead')
		{
			ctx.fillStyle = 'black';
		}
		ctx.drawImage(imgInvader,invader.x,invader.y,invader.width,invader.height);
	}
}
function loadMedia()
{
	//Esta función carga las imágenes y el audio
	//Primero cargamos las imágenes
	imgSpaceShip = new Image();
	imgSpaceShip.src = 'spaceship.png';
	imgInvader = new Image();
	imgInvader.src = 'monster.png';
	imgShoot = new Image();
	imgShoot.src = 'laser.png';
	imgInvaderShoot = new Image();
	imgInvaderShoot.src= 'enemyLaser.png';
	space = new Image();
	space.src = 'space.jpg';
	//Ahora cargamos el sonido haciendo uso de <audio> de HTML5
	soundShoot = document.createElement('audio');
	document.body.appendChild(soundShoot);
	soundShoot.setAttribute('src','laserSpace.wav');
	soundInvaderShoot = document.createElement('audio');
	document.body.appendChild(soundInvaderShoot);
	soundInvaderShoot.setAttribute('src','laserAlien.wav');
	soundDeadSpace = document.createElement('audio');
	document.body.appendChild(soundDeadSpace);
	soundDeadSpace.setAttribute('src','deadSpaceShip.wav');
	soundDeadInvader = document.createElement('audio');
	document.body.appendChild(soundDeadInvader);
	soundDeadInvader.setAttribute('src','deadInvader.wav');
	soundEndGame = document.createElement('audio');
	document.body.appendChild(soundEndGame);
	soundEndGame.setAttribute('src','endGame.wav');
}
function moveShoots()
{
	//Esta función mueve los disparos
	for(var i in shoots)
	{
		var shoot = shoots[i];
		shoot.y -= 2;
		shoot.counter++;
	}
	//Removemos las balas que se salen del escenario
	shoots = shoots.filter(function(shoot){
		return shoot.y > 0;
	});
}
function updateInvaders()
{
	//Esta función se encarga de manipular a los invasores
	//y sus disparos
	function addInvaderShoot(invader)
	{
		//Esta función agrega un disparo
		return {
			x: invader.x,
			y: invader.y,
			width: 10,
			height: 33,
			counter: 0
		}
	}
	//De llenar el arreglo y moverlos.
	if(game.state == 'start')
	{
		//Ponemos de inicio 10 enemigos
		for(var i=0;i<10;i++)
		{
			invaders.push({
				x: 10 + (i*50),
				y: 10,
				height: 40,
				width: 40,
				phase: Math.floor(Math.random() * 50),
				counter: 0,
				state: 'alive'
			});
		}
		//Cambiamso el estado del juego a 'jugando'
		game.state = 'playing';
	}
	//Movemos los elementos
	for(var i in invaders)
	{
		var invader = invaders[i];
		if(!invader)
		{
			//Si no está este invasor pasamos al siguiente
			continue;
		}
		if(invader && invader.state =='alive')
		{
			//Si el invasor está vivo lo movemos
			invader.counter++;
			invader.x += Math.sin(invader.counter * Math.PI /90)*5;

			//Función para disparar de los enemigos
			if(aleatorio(0,invaders.length*10) == 4)
			{
				//Agregamos un disparo
				soundInvaderShoot.pause();
				soundInvaderShoot.currentTime = 0;
				soundInvaderShoot.play();
				invaderShoots.push(addInvaderShoot(invader));
			}
		}
		if(invader && invader.state == 'hit')
		{
			invader.counter++;
			if(invader.counter >= 20)
			{
				invader.state = 'dead';
				invader.counter = 0;
			}
		}
		invaders = invaders.filter(function(event){
			if(event && event.state !== 'dead'){
				return true;
			}
			return false;
		});
	}
}
function addInvaders()
{
	//Agregamos más invasores

}
function drawBackground()
{
	//Esta función dibuja el fondo del lienzo
	//ctx.fillStyle= "#000";
	//ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(space,0,0);
}
function drawInvaderShoot()
	{
	//Dibuja los disparos en Canvas
	for(var i in invaderShoots)
	{
		var shoot = invaderShoots[i];
		var xOffset = (shoot.counter % 9 ) * 12 + 1;
		var yOffset = 1;
		ctx.fillStyle = 'yellow';
		ctx.drawImage(imgInvaderShoot,shoot.x, shoot.y, shoot.width, shoot.height);
	}
}
function drawAnswerText()
{
	//Esta función dibuja indicaciones en texto para el usuario
	if(answerText.counter == -1)
	{
		return;
	}
	var alpha = answerText.counter/50.0;
	if(alpha>1)
	{
		for(var i in invaders)
		{
			delete invaders[i];
		}
	}
	ctx.globalAlpha = alpha;
	ctx.save();
	if(game.state == 'over')
	{
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(answerText.title,140,200);
		ctx.font = '14pt Helvetica';
		ctx.fillText(answerText.subtitle,190,250);
	}
	if(game.state == 'won')
	{
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(answerText.title,50,200);
		ctx.font = '14pt Helvetica';
		ctx.fillText(answerText.subtitle,190,250);
	}
	ctx.restore();

}
function moveInvaderShoot()
{
	//Movemos los disparos
	for(var i in invaderShoots)
	{
		var shoot = invaderShoots[i];
		shoot.y += 3;
		shoot.counter++;
	}
}
function updateGameState()
{
	//Función que actualiza los diferentes estados del juego
	if(game.state=='playing' && invaders.length == 0)
	{
		game.state = 'won';
		soundEndGame.play();
		answerText.title = 'Venciste a los invasores';
		answerText.subtitle = 'Preciona la tecla R para reiniciar';
		answerText.counter = 0;
	}
	if((game.state == 'over' || game.state=='won') && keyboard[82])
	{
		game.state = 'start';
		spaceShip.state = 'alive';
		answerText.counter = -1;
	}
	if(answerText.counter >=0)
	{
		answerText.counter++;
	}
}
function fire()
{
	//Esta función es con la que se dispara
	soundShoot.pause();
	soundShoot.currentTime = 0;
	soundShoot.play();
	shoots.push({
		x: spaceShip.x + 20,
		y: spaceShip.y - 10,
		width: 10,
		height: 30
	});
}
function checkHit()
{
	//Esta función verifica si dos elementos han chocado.
	for(var i in shoots)
	{
		var shoot = shoots[i];
		for(var j in invaders)
		{
			var invader = invaders[j];
			if(hit(shoot, invader))
			{
				soundDeadInvader.pause();
				soundDeadInvader.currentTime = 0;
				soundDeadInvader.play();
				shoot.state = 'hit';
				invader.state = 'hit';
				invader.counter = 0;
			}
		}
	}
	//Verificamos choques con la nave
	if(spaceShip.state == 'hit' || spaceShip.state == 'dead')
		return;
	for(var i in invaderShoots)
	{
		var shoot = invaderShoots[i];
		if(hit(shoot,spaceShip))
		{

			soundDeadSpace.play();
			shoot.state='hit';
			spaceShip.state='hit';
			spaceShip.counter= 0;
		}
	}

}
function hit(a,b)
{
	var hit = false;
	//Colsiones horizontales
	if(b.x + b.width >= a.x && b.x < a.x + a.width)
	{
		//Colisiones verticales
		if(b.y + b.height >= a.y && b.y < a.y + a.height)
			hit = true;
	}
	//Colisión de a con b
	if(b.x <= a.x && b.x + b.width >= a.x + a.width)
	{
		if(b.y <= a.y && b.y + b.height >= a.y + a.height)
			hit = true;
	}
	//Colisión b con a
	if(a.x <= b.x && a.x + a.width >= b.x + b.width)
	{
		if(a.y <= b.y && a.y + a.height >= b.y + b.height)
			hit = true;
	}
	return hit;
}
function addKeyBoardevents()
{
	//Esta función agrega los eventos al teclado para IE y otros navgs.
	addEvent(document, "keydown",function(e){
		//True a la tecla aplastada.
		keyboard[e.keyCode] = true;
	});
	addEvent(document, "keyup",function(e){
		//False a la tecla que se levantó
		keyboard[e.keyCode] = false;
	});
	function addEvent(element, eventName, func)
	{
		if(element.addEventListener)
		{
			//Buenos navegadores (Chrome, Firefox, Opera etc.)
			element.addEventListener(eventName,func,false);
		}
		else if(element.attachEvent)
		{
			//Navegadores de Microsoft
			element.attachEvent(eventName,func);
		}
	}

}
function moveSpaceShip()
{
	//Esta función verifica a cada momento si se presiona una tecla
	//Para luego mover la nave
	if(spaceShip.state === 'dead')
	{
		//Si la nave se muere
		return;
	}
	//Mover a la izquierda
	if(keyboard[37])
	{
		//Movemos la nave
		spaceShip.x -= 10;
		//Colocamos un límite
		if(spaceShip.x <0 )
			spaceShip.x = 0;
	}
	//Mover a la derecha
	if(keyboard[39])
	{
		//Movemos la nave
		spaceShip.x += 10;
		//Colocamos un límite
		var rightEdge = canvas.width - spaceShip.width;
		if(spaceShip.x > rightEdge )
			spaceShip.x = rightEdge;
	}
	//Activamos la función de disparo al presionar la barra espaciadora
	if(keyboard[32])
	{
		//Condiciones para que no dispare más de una vez
		if(!keyboard.fired)
		{
			fire();
			keyboard.fired = true;
		}
	}
	if(!keyboard[32])
	{
		keyboard.fired = false;
	}
	if(spaceShip.state == 'hit')
	{
		spaceShip.counter++;
		if(spaceShip.counter >=20)
		{
			spaceShip.counter= 0;
			spaceShip.state = 'dead';
			game.state = 'over';
			answerText.title = 'Game Over';
			answerText.subtitle = 'Presiona la tecla R para reiniciar';
			answerText.counter = 0;
		}
	}
}
function aleatorio(inferior,superior)
{
	//Función que genera números aleatorios vía desarrolloweb.com 
    numPosibilidades = superior - inferior 
    aleat = Math.random() * numPosibilidades 
    aleat = Math.floor(aleat) 
    return parseInt(inferior) + aleat 
} 
//Esta función se ejecuta cada 16 mls
function frameLoop()
{
	updateGameState();
	updateInvaders();
	moveSpaceShip();
	moveInvaderShoot();
	drawBackground();
	drawSpaceShip();
	drawInvaders();
	drawInvaderShoot();
	drawShoots();
	drawAnswerText();
	moveShoots();
	checkHit();
}
//Agregamos los eventos antes de crear el ciclo
addKeyBoardevents();
loadMedia();