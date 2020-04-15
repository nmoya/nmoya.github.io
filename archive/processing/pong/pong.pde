/*
Tipo:
  int inteiro (1, 2, 3, mouse x, mouse y)
  float real (3.14, 15/2)
  char caracter ('a','c')
  void vazio
    
Variaveis:
  < tipo > nome qualquer;
  float gravidade;
  char nome [25];
  
Atribuição:
  operador = 
  gravidade = 9.81;
  int a = 10;
  a = a*2;
  
Função:
  f(y)=x+2
  <tipo> nome ()
  
Escopo:
  {} define um bloco de código
  
Estrutura Condicional:
  if (condicao) {
    // seu codigo aqui
  }
  
Estrutura de Repeticao:
  int i = 0;
  for (i =0; i<5; i++){
    // seu codigo aqui
  }
  
  while (condicao) {
    // seu codigo aqui
  }
  
  while (i<5){
    i = i+1;
  }
  
Estrutura Processing:
  setup();
  while (true){
    draw ();
  }
*/

//Declaracoes

float bola_x = 300;
float bola_y = 50;
float velocidade_x = random(3,7);
float velocidade_y = random(3,7);
float cor_R=0 ;
float cor_B=0 ;
float cor_G=0 ;
int level=0;

void setup (){
  size (600, 600);
  noCursor();
  textSize(32);
  noStroke();
  smooth();
  
}

void draw (){
  background (255, 255, 255); 
  fill (0,0,0);
  text ("Level:",width/2-40, height/4);
  text (str(level),width/2+60,height/4);
  fill (cor_R,cor_G,cor_B);
  ellipse (bola_x, bola_y,30,30);
  fill (128,128,128);
  rect (30, mouseY, 20,70);
  bola_x = bola_x + velocidade_x;
  bola_y = bola_y + velocidade_y;
  if (bola_y > height || bola_y < 0) {
    velocidade_y = velocidade_y*-1;
    cor_R = random (0,255);
    cor_B = random (0,255);
    cor_G = random (0,255);
  }
  if (bola_x > width){
    velocidade_x = velocidade_x*-1;
    cor_R = random (0,255);
    cor_B = random (0,255);
    cor_G = random (0,255);
    }
  if (bola_x <0){
    velocidade_x = random (3,5);
    if (velocidade_y > 0) {
      velocidade_y= random (3,5);
    }else{
      velocidade_y=random (3,5)*-1;
    }
    bola_x = random(100,600);
    bola_y = random(0,600);
    level = 0;
  }
  if (bola_x > 30 && bola_x < 50 && bola_y > mouseY && bola_y < mouseY+70) {
    velocidade_x = velocidade_x*-1;
    velocidade_x = velocidade_x+1;
    velocidade_y = velocidade_y+1;
    level = level+1;
  }
  
  
  
}

