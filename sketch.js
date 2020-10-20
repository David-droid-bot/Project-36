//Create variables here
var dog;
var database;
var foodS;
var foodStock;

var dogHappy;
var dogImage;
var gardenImage;
var washroomImage;
var bedroomImage;
var sadDog;

var garden;
var bedroom;
var washroom;
function preload()
{
  //load images here
  dogImage=loadImage("images/dogImg.png");
  dogHappy=loadImage("images/dogImg1.png");
  washroomImage=loadImage("images/Wash Room.png");
  bedroomImage=loadImage("images/Bed Room.png");
  gardenImage=loadImage("images/Garden.png");
  sadDog=loadImage("images/deadDog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500,500);
  dog=createSprite(250,250,10,10);
  dog.addImage(dogImage);
  dog.scale=0.5;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  foodObj=new food();

  feed=createButton("Feed");
  feed.position(400,30);
  feed.mousePressed(feedDog);

  addFood=createButton("addfood");
  addFood.position(400,50);
  addFood.mousePressed(addFood);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
});
}

function draw() {  
background(46,139,87);
foodObj.display();
  drawSprites();
  //add styles here
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
}
function writeStock(x){
  if(x<=0){
    x=0
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
  if(gameState!='Hungry'){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
  database.ref('/').update({
    Food:x
  })
}
function readStock(data){
foodS=data.val();
}
function addFood(){
  foodS++;
  database.ref('/').update({
   Food:foodS
  })
}
function feedDog(){
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
