PImage img;
PImage out;

void setup()
{ 
  img = loadImage("https://raw.githubusercontent.com/nmoya/nmoya.github.io/master/processing/iftedt/assets/images/whale.jpg");
  //  img = loadImage("./assets/images/whale.jpg");
  out = createImage(img.width, img.height, RGB);
  out = compute_gradient(img);
  //size(img.width*2, img.height);
  size(1280, 640);
}
//IntList create_adjrelation(PImage img, int neigh)
//{
//  IntList adj_rel = new IntList();
//  if (neigh == 4)
//  {  
//    adj_rel.append(0);
//    adj_rel.append(-img.width);
//    adj_rel.append(-1);
//    adj_rel.append(img.width);
//    adj_rel.append(img.width+1);
//  }
//  else if (neigh == 8)
//  {
//    adj_rel.append(0);
//    adj_rel.append(1);
//    adj_rel.append(-img.width+1);
//    adj_rel.append(-img.width);
//    adj_rel.append(-img.width-1);
//    adj_rel.append(-1);
//    adj_rel.append(img.width-1);
//    adj_rel.append(img.width);
//    adj_rel.append(img.width+1);
//  }
//  return adj_rel;  
//}
PImage compute_gradient(PImage img)
{
//  IntList neigh8 = create_adjrelation(img, 8);
  int i;
  PImage out = createImage(img.width, img.height, RGB);
  out.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  out.filter(GRAY);
  out.loadPixels();
  for (i = 0; i < img.width*img.height; i++) 
  {
    out.pixels[i] = color((int)brightness(out.pixels[i]));
    if (i <= 3)
      println((int)brightness(out.pixels[i]));
  }
  out.updatePixels();
  return out;
}

void draw()
{
  background(0);
  image(img,0,0);
  image(out,img.width, 0);
}

