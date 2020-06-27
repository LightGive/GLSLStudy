 #define PI 3.141592653589793
 #define PI2 PI * 2.
 #define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))

precision mediump float;
uniform float time;
uniform vec2 resolution;


vec3 rightTop(vec2 p)
{
  float scale = 0.05;
  float wid = 0.02;
  float speed = 5.0;
  p = p*rot(time*speed);
  float angLerp =(degrees(atan(p.y,p.x))+180.)/360.;
  float ring = (1.0-step(scale+wid,length(p)))*  step(scale,length(p))*angLerp;
  return vec3(ring);
}

vec3 leftTop(vec2 p)
{
  float scale = 0.1;
  float wid = 0.02;
  float angleWid = 0.15;
  float speed = 5.0;
  float gray = .5;
  p = p*rot(mod(time*speed,PI2));
  float angLerp =(degrees(atan(p.y,p.x))+180.)/360.;
  float a = clamp(step(1.0-angleWid,angLerp)+gray,0.0,1.0);
  float ring = (1.0-step(scale+wid,length(p)))* step(scale,length(p))*a;
  return  vec3(ring);
}

vec3 rightBot(vec2 p)
{
  const int spCnt = 8;
  float totalRad = 0.15;
  float cirRad = 0.03;
  float minRad = 0.01;
  float interval = 1.0;
  float t = mod(-time,interval)/interval;
  float c;
  for(int i=0;i<spCnt;i++)
  {
    float l = float(i)/float(spCnt);
    float la = l*PI2;
    vec2 cen = vec2(sin(la),cos(la))*totalRad;
    float dis = distance(cen,p);
    c +=(1.0 - step(mix(minRad,cirRad,mod(l+t,1.0)),dis))*mix(0.1,1.0,mod(l+t,1.0));
  }
  return vec3(c);
}

vec3 leftBot(vec2 p)
{
  const int spCnt = 10;
  float interval = 1.0;
  float rad = 0.13;
  float len = 0.1;
  float lineWid = 0.015;

  float t = mod(time,interval)/interval;
  float c;

  for(int i=0;i<spCnt;i++)
  {
    float l = float(i)/float(spCnt);
    float la = l*PI2;
    vec2 p1 = vec2(sin(la),cos(la))*rad;
    vec2 p2 = vec2(sin(la),cos(la))*(rad+len);
    vec2 pa = p-p1,ba = p2-p1;
    float h =clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    c+= step(1.0-lineWid,1.0-length(pa-ba*h))*mix(1.0,0.0,mod(l+t,1.0));
  }
  return vec3(c);
}

void main()
{
  vec2 p = (gl_FragCoord.xy * 2. -resolution.xy) / min(resolution.x,resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 fc;

  float offsetX = (resolution.x > resolution.y)?resolution.x/resolution.y*0.5:0.5;
  float offsetY = (resolution.x > resolution.y)?0.5:resolution.y/resolution.x*0.5;
  if(p.x > 0.0 && p.y> 0.0){fc= rightTop( p + vec2(-offsetX,-offsetY));}
  else if (p.x<0.0 && p.y > 0.0){fc = leftTop(p+vec2(offsetX,-offsetY));}
  else if(p.x >0.0 && p.y<0.0){fc = rightBot(p+vec2(-offsetX,offsetY));}
  else if (p.x<0.0 && p.y <0.0){fc = leftBot(p+vec2(offsetX,offsetY));}
  gl_FragColor = vec4(fc,0.0);
}
