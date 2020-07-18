let config={
	type:Phaser.AUTO,

	scale:{
		mode: Phaser.Scale.FIT,
		width:800,
		height:600,
	},

	physics:{
		default:'arcade',
		arcade:{
			gravity:{
				y:1000,
			},
			debug:false,
		}
	},

	scene:
	{
		preload:preload,
		create:create,
		update:update,
	}
};

let game = new Phaser.Game(config);

player_obj={
	speed:200,
	jump_speed:1500,
}

function preload()
{
	this.load.image('ground','assets/ground.png');
	this.load.image('sky','assets/background.png');
	this.load.image('apple','assets/apple.png');
	this.load.spritesheet('dude','assets/dude.png',{frameWidth:32,frameHeight:48});
	this.load.image('ray','assets/ray.png');

}
function create()
{
	W=game.config.width;
	H=game.config.height;

	let bottomground=this.add.tileSprite(0,H-100,W,100,'ground');
	bottomground.setOrigin(0,0);

	let sky=this.add.sprite(0,0,'sky');
	sky.setOrigin(0,0);
	sky.displayWidth = W;
	sky.depth=-2;

	let rays=[];
	for(let i=-10;i<=10;i++)
	{
		let ray=this.add.sprite(W/2-200,H-100,'ray');
	    ray.setOrigin(0.5,1);
	    ray.depth=-1;
	    ray.alpha=0.2;
	    ray.angle=i*20;
	    ray.displayHeight=1.5*H; 
	    rays.push(ray);
	}
	this.tweens.add({
		targets:rays,
		props:{
			angle:{
				value:"+=20",
			}
		},
		duration:6000,
		repeat:-1,
	});

	this.player=this.physics.add.sprite(100,100,'dude',4);
	console.log(this.player);
	this.player.setBounce(0.4);
	this.player.setCollideWorldBounds(true);

	this.physics.add.existing(bottomground,true);

	this.anims.create({
		key:'left',
		frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
		frameRate:10,
		repeat:-1,
	});
	this.anims.create({
		key:'right',
		frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
		frameRate:10,
		repeat:-1,
	});
	this.anims.create({
		key:'center',
		frames:this.anims.generateFrameNumbers('dude',{start:4,end:4}),
		frameRate:10,
		repeat:-1,
	});

	let fruits=this.physics.add.group({
		key:"apple",
		repeat:8,
		setScale:{x:0.2,y:0.2},
		setXY:{x:10,y:0,stepX:100},
	});
	let platforms=this.physics.add.staticGroup();
	platforms.create(150,100,'ground').setScale(2,0.5).refreshBody();
	platforms.create(385,275,'ground').setScale(2,0.5).refreshBody();
	platforms.create(650,400,'ground').setScale(2,0.5).refreshBody();
	platforms.add(bottomground);

	fruits.children.iterate(function(f){
		f.setBounce(Phaser.Math.FloatBetween(0.3,0.6));
	});

	this.physics.add.collider(fruits,platforms);
	this.physics.add.collider(bottomground,this.player);	
	this.physics.add.collider(platforms,this.player);
	this.physics.add.overlap(fruits,this.player,eatFruit,null,this);

	this.controls = this.input.keyboard.createCursorKeys();
	
}
function eatFruit(player,fruits)
{
	fruits.disableBody(true,true);
}
function update()
{
	if(this.controls.left.isDown)
	{
		this.player.setVelocityX(-player_obj.speed);
		this.player.anims.play('left',true);
	}
	else if(this.controls.right.isDown)
	{
		this.player.setVelocityX(player_obj.speed);
		this.player.anims.play('right',true);
	}
	else if(this.controls.up.isDown&&this.player.body.touching.down)
	{
		this.player.setVelocityY(player_obj.jump_speed);
	}
	else
	{
		this.player.setVelocityX(0);
		this.player.anims.play('center',true);
	}

	//when player gets fruit

}