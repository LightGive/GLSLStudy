/*{
  "audio": true,
}*/

 #define PI 3.141592653589793
 #define PI2 PI * 2.
 #define repeat(p, span) mod(p, span) - (0.5 * span)
 #define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
 #define random(st) fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123)

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

#define OCTAVES 6
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;

    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main()
{
  vec2 rep = vec2(10.0);
  vec2 r = resolution/rep;
  vec2 coord = mod(gl_FragCoord.xy,r);
  vec2 p = (coord)/min(r.x,r.y);
  vec2 off = floor(gl_FragCoord.xy/r.xy)/rep;
  float interval = 1.0;
  float t = mod(time,interval);
  float l = t/interval;

  vec3 blue = vec3(0.1,0.3,1.);
  vec3 green = vec3(0.3,1.0,0.1);
  float sinL = sin(l*PI2 +length(off*PI))*0.5+0.5;
  float cosL = cos(l*PI2+length(off+PI))*0.5+.5;

  vec3 c1 = mix(blue,green,sinL);
  vec3 c2 = mix(green,blue,sinL);

  float rotTime = time*2.0;
  float rotTime2 = -time*2.0;
  vec2 p1 = mat2(cos(rotTime),sin(rotTime),-sin(rotTime),cos(rotTime))*p;
  vec2 p2 = mat2(cos(rotTime2),sin(rotTime2),-sin(rotTime2),cos(rotTime2))*p;
  vec3 tri1 = vec3(step(sinL*2.0 ,p1.x+p1.y)*c1);
  vec3 tri2 = vec3(step(cosL*2.0 ,p2.x+p2.y)*c2);
  gl_FragColor = vec4((tri1 + tri2)*0.8,1.0);
}
