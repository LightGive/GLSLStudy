 #define PI 3.141592653589793
 #define PI2 PI * 2.
 #define repeat(p, span) mod(p, span) - (0.5 * span)
 #define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
 #define random(st) fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123)
#define ENDPOINTS 1

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform float volume;
uniform sampler2D spectrum;
uniform sampler2D samples;

float noise (in vec2 st)
{
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float Line(vec2 p1, vec2 p2, vec2 p)
{
		float x = dot(normalize(p2 - p1), (p - p1));
		x = clamp(x, 0.0, distance(p1,p2));
		vec2 np =p1 + normalize(p2 -p1)* x;
		return distance(p,np);
}

vec2 Move(vec2 p,float a)
{
  float cnt = 82.;
  float lerp = a/cnt;
  float interval = 1.0;
  float t = mod(time,interval)/interval;

  float ang = lerp*PI2;
  return mix(vec2(sin(ang),cos(ang)),p,t);
}

void main()
{
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec3 fc;
  float lineLengh = 0.001;
  //lineLengh /  Line( Move(vec2(,),1.0),Move(vec2(,),1.0),p);
  float h1 =lineLengh /  Line( Move(vec2(-0.95,0.95),0.0),Move(vec2(-0.95,0.4),1.0),p);
  float h2 =lineLengh /  Line( Move(vec2(-0.95,0.65),2.0),Move(vec2(-0.7,0.65),3.0),p);
  float h3 =lineLengh /Line( Move(vec2(-0.7,0.95),4.0),Move(vec2(-0.7,0.4),5.0),p);
  float p1 =lineLengh /Line( Move(vec2(-0.1,0.95),6.0),Move(vec2(-0.1,0.4),7.0),p);
  float p2 =lineLengh /Line( Move(vec2(-0.1,0.95),8.0),Move(vec2(0.1,0.8),9.0),p);
  float p3 =lineLengh /Line( Move(vec2(-0.1,0.65),10.0),Move(vec2(0.1,0.8),11.0),p);
  float p4 =lineLengh /Line( Move(vec2(0.3,0.95),12.0),Move(vec2(0.3,0.4),13.0),p);
  float p5 =lineLengh /Line( Move(vec2(0.3,0.95),14.0),Move(vec2(0.5,0.8),15.0),p);
  float p6 =lineLengh /Line( Move(vec2(0.3,0.65),16.0),Move(vec2(0.5,0.8),17.0),p);
  float a1 = lineLengh/Line( Move(vec2(-0.4,0.95),18.0),Move(vec2(-0.5,0.4),19.0),p);
  float a2 = lineLengh/Line( Move(vec2(-0.4,0.95),20.0),Move(vec2(-0.3,0.4),21.0),p);
  float a3 = lineLengh/Line( Move(vec2(-0.35,0.65),22.0),Move(vec2(-0.45,0.65),23.0),p);
  float y1 =lineLengh /Line( Move(vec2(0.95,0.95),24.0),Move(vec2(0.8,0.65),25.0),p);
  float y2 =lineLengh /Line( Move(vec2(0.65,0.95),26.0),Move(vec2(0.8,0.65),27.0),p);
  float y3 =lineLengh /Line( Move(vec2(0.8,0.65),28.0),Move(vec2(0.8,0.4),29.0),p);
  float b1 =lineLengh /  Line( Move(vec2(-0.95,0.3),30.0),Move(vec2(-0.95,-0.3),31.0),p);
  float b2 =lineLengh /  Line( Move(vec2(-0.95,0.3),32.0),Move(vec2(-0.75,0.15),33.0),p);
  float b3 =lineLengh /  Line( Move(vec2(-0.95,0.0),34.0),Move(vec2(-0.75,0.15),35.0),p);
  float b4 =lineLengh /  Line( Move(vec2(-0.95,-0.3),36.0),Move(vec2(-0.75,-0.15),37.0),p);
  float b5 =lineLengh /  Line( Move(vec2(-0.95,0.0),38.0),Move(vec2(-0.75,-0.15),39.0),p);
  float i1 =lineLengh /  Line( Move(vec2(-0.4,0.3),40.0),Move(vec2(-0.4,-0.3),41.0),p);
  float i2 =lineLengh /  Line( Move(vec2(-0.5,0.3),42.0),Move(vec2(-0.3,0.3),43.0),p);
  float i3 =lineLengh /  Line( Move(vec2(-0.5,-0.3),44.0),Move(vec2(-0.3,-0.3),45.0),p);
  float r1 =lineLengh /Line( Move(vec2(-0.1,0.3),46.0),Move(vec2(-0.1,-0.3),47.0),p);
  float r2 =lineLengh /Line( Move(vec2(-0.1,0.3),48.0),Move(vec2(0.1,0.15),49.0),p);
  float r3 =lineLengh /Line( Move(vec2(-0.1,0.0),50.0),Move(vec2(0.1,0.15),51.0),p);
  float r4 =lineLengh /Line( Move(vec2(-0.1,0.0),52.0),Move(vec2(0.1,-0.3),53.0),p);
  float t1 =lineLengh /Line( Move(vec2(0.3,0.3),54.0),Move(vec2(0.5,0.3),55.0),p);
  float t2 =lineLengh /Line( Move(vec2(0.4,0.3),56.0),Move(vec2(0.4,-0.3),57.0),p);
  float h4 =lineLengh /Line( Move(vec2(0.95,0.3),58.0),Move(vec2(0.95,-0.3),59.0),p);
  float h5 =lineLengh /Line( Move(vec2(0.65,0.3),60.0),Move(vec2(0.65,-0.3),61.0),p);
  float h6 =lineLengh /Line( Move(vec2(0.95,0.0),62.0),Move(vec2(0.65,0.0),63.0),p);
  float d1 =lineLengh /Line( Move(vec2(-0.5,-0.4),64.0),Move(vec2(-0.5,-0.95),65.0),p);
  float d2 =lineLengh /Line( Move(vec2(-0.5,-0.4),66.0),Move(vec2(-0.3,-0.65),67.0),p);
  float d3 =lineLengh /Line( Move(vec2(-0.5,-0.95),68.0),Move(vec2(-0.3,-0.65),69.0),p);
  float a4 = lineLengh/Line( Move(vec2(-0.1,-0.95),70.0),Move(vec2(0.0,-0.4),71.0),p);
  float a5 = lineLengh/Line( Move(vec2(0.1,-0.95),72.0),Move(vec2(0.0,-0.4),73.0),p);
  float a6 = lineLengh/Line( Move(vec2(-0.05,-0.7),74.0),Move(vec2(0.05,-0.7),75.0),p);
  float y4 =lineLengh /Line( Move(vec2(0.3,-0.4),76.0),Move(vec2(0.4,-0.7),77.0),p);
  float y5 =lineLengh /Line( Move(vec2(0.5,-0.4),78.0),Move(vec2(0.4,-0.7),79.0),p);
  float y6 =lineLengh /Line( Move(vec2(0.4,-0.7),80.0),Move(vec2(0.4,-0.95),81.0),p);

  fc += h1+h2+ h3;
  fc += a1+a2+a3;
  fc += p1+p2+p3+p4+p5+p6;
  fc += y1+y2+y3;
  fc += b1+b2+b3+b4+b5;
  fc += i1+i2+i3;
  fc += r1+r2+r3+r4;
  fc += t1+t2;
  fc += h4+h5+h6;
  fc += d1+d2+d3;
  fc += a4+a5+a6;
  fc += y4+y5+y6;

  gl_FragColor = vec4(fc,0.0);
}



// 
//
//
// // Author:
// // Title:
//
// #ifdef GL_ES
// precision mediump float;
// #endif
// #define PI 3.141592653589793
// #define PI2 PI * 2.
//
// uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float u_time;
//
// float Line(vec2 p1, vec2 p2, vec2 p)
// {
// 	float x = dot(normalize(p2 - p1), (p - p1));
// 	x = clamp(x, 0.0, distance(p1,p2));
// 	vec2 np =p1 + normalize(p2 -p1)* x;
//     return distance(p,np);
// }
//
// vec2 Move(vec2 p,float a)
// {
//   float cnt = 82.;
//   float lerp = a/cnt;
//   float interval = 1.0;
//   float tim = mod(u_time,interval)/interval;
//   float ang = lerp*PI2;
//   return mix(vec2(sin(ang),cos(ang)),p,tim);
// }
//
// void main()
// {
//   vec2 p = (gl_FragCoord.xy * 2. - u_resolution) / min(u_resolution.x,u_resolution.y);
//   vec3 fc;
//   float lineLengh = 0.001;
//   float h1 =lineLengh /Line( Move(vec2(-0.95,0.95),0.0),Move(vec2(-0.95,0.4),1.0),p);
//   float h2 =lineLengh /Line( Move(vec2(-0.95,0.65),2.0),Move(vec2(-0.7,0.65),3.0),p);
//   float h3 =lineLengh /Line( Move(vec2(-0.7,0.95),4.0),Move(vec2(-0.7,0.4),5.0),p);
//   float p1 =lineLengh /Line( Move(vec2(-0.1,0.95),6.0),Move(vec2(-0.1,0.4),7.0),p);
//   float p2 =lineLengh /Line( Move(vec2(-0.1,0.95),8.0),Move(vec2(0.1,0.8),9.0),p);
//   float p3 =lineLengh /Line( Move(vec2(-0.1,0.65),10.0),Move(vec2(0.1,0.8),11.0),p);
//   float p4 =lineLengh /Line( Move(vec2(0.3,0.95),12.0),Move(vec2(0.3,0.4),13.0),p);
//   float p5 =lineLengh /Line( Move(vec2(0.3,0.95),14.0),Move(vec2(0.5,0.8),15.0),p);
//   float p6 =lineLengh /Line( Move(vec2(0.3,0.65),16.0),Move(vec2(0.5,0.8),17.0),p);
//   float a1 = lineLengh/Line( Move(vec2(-0.4,0.95),18.0),Move(vec2(-0.5,0.4),19.0),p);
//   float a2 = lineLengh/Line( Move(vec2(-0.4,0.95),20.0),Move(vec2(-0.3,0.4),21.0),p);
//   float a3 = lineLengh/Line( Move(vec2(-0.35,0.65),22.0),Move(vec2(-0.45,0.65),23.0),p);
//   float y1 =lineLengh /Line( Move(vec2(0.95,0.95),24.0),Move(vec2(0.8,0.65),25.0),p);
//   float y2 =lineLengh /Line( Move(vec2(0.65,0.95),26.0),Move(vec2(0.8,0.65),27.0),p);
//   float y3 =lineLengh /Line( Move(vec2(0.8,0.65),28.0),Move(vec2(0.8,0.4),29.0),p);
//   float b1 =lineLengh /Line( Move(vec2(-0.95,0.3),30.0),Move(vec2(-0.95,-0.3),31.0),p);
//   float b2 =lineLengh /Line( Move(vec2(-0.95,0.3),32.0),Move(vec2(-0.75,0.15),33.0),p);
//   float b3 =lineLengh /Line( Move(vec2(-0.95,0.0),34.0),Move(vec2(-0.75,0.15),35.0),p);
//   float b4 =lineLengh /Line( Move(vec2(-0.95,-0.3),36.0),Move(vec2(-0.75,-0.15),37.0),p);
//   float b5 =lineLengh /Line( Move(vec2(-0.95,0.0),38.0),Move(vec2(-0.75,-0.15),39.0),p);
//   float i1 =lineLengh /Line( Move(vec2(-0.4,0.3),40.0),Move(vec2(-0.4,-0.3),41.0),p);
//   float i2 =lineLengh /Line( Move(vec2(-0.5,0.3),42.0),Move(vec2(-0.3,0.3),43.0),p);
//   float i3 =lineLengh /Line( Move(vec2(-0.5,-0.3),44.0),Move(vec2(-0.3,-0.3),45.0),p);
//   float r1 =lineLengh /Line( Move(vec2(-0.1,0.3),46.0),Move(vec2(-0.1,-0.3),47.0),p);
//   float r2 =lineLengh /Line( Move(vec2(-0.1,0.3),48.0),Move(vec2(0.1,0.15),49.0),p);
//   float r3 =lineLengh /Line( Move(vec2(-0.1,0.0),50.0),Move(vec2(0.1,0.15),51.0),p);
//   float r4 =lineLengh /Line( Move(vec2(-0.1,0.0),52.0),Move(vec2(0.1,-0.3),53.0),p);
//   float t1 =lineLengh /Line( Move(vec2(0.3,0.3),54.0),Move(vec2(0.5,0.3),55.0),p);
//   float t2 =lineLengh /Line( Move(vec2(0.4,0.3),56.0),Move(vec2(0.4,-0.3),57.0),p);
//   float h4 =lineLengh /Line( Move(vec2(0.95,0.3),58.0),Move(vec2(0.95,-0.3),59.0),p);
//   float h5 =lineLengh /Line( Move(vec2(0.65,0.3),60.0),Move(vec2(0.65,-0.3),61.0),p);
//   float h6 =lineLengh /Line( Move(vec2(0.95,0.0),62.0),Move(vec2(0.65,0.0),63.0),p);
//   float d1 =lineLengh /Line( Move(vec2(-0.5,-0.4),64.0),Move(vec2(-0.5,-0.95),65.0),p);
//   float d2 =lineLengh /Line( Move(vec2(-0.5,-0.4),66.0),Move(vec2(-0.3,-0.65),67.0),p);
//   float d3 =lineLengh /Line( Move(vec2(-0.5,-0.95),68.0),Move(vec2(-0.3,-0.65),69.0),p);
//   float a4 =lineLengh/Line( Move(vec2(-0.1,-0.95),70.0),Move(vec2(0.0,-0.4),71.0),p);
//   float a5 =lineLengh/Line( Move(vec2(0.1,-0.95),72.0),Move(vec2(0.0,-0.4),73.0),p);
//   float a6 =lineLengh/Line( Move(vec2(-0.05,-0.7),74.0),Move(vec2(0.05,-0.7),75.0),p);
//   float y4 =lineLengh /Line( Move(vec2(0.3,-0.4),76.0),Move(vec2(0.4,-0.7),77.0),p);
//   float y5 =lineLengh /Line( Move(vec2(0.5,-0.4),78.0),Move(vec2(0.4,-0.7),79.0),p);
//   float y6 =lineLengh /Line( Move(vec2(0.4,-0.7),80.0),Move(vec2(0.4,-0.95),81.0),p);
//
//   fc += h1+h2+h3;
//   fc += a1+a2+a3;
//   fc += p1+p2+p3+p4+p5+p6;
//   fc += y1+y2+y3;
//   fc += b1+b2+b3+b4+b5;
//   fc += i1+i2+i3;
//   fc += r1+r2+r3+r4;
//   fc += t1+t2;
//   fc += h4+h5+h6;
//   fc += d1+d2+d3;
//   fc += a4+a5+a6;
//   fc += y4+y5+y6;
//
//   gl_FragColor = vec4(fc,1.0);
// }
