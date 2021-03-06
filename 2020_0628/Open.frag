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
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;
  float spd = 0.1;
  vec3 fc;
  vec3 sky = vec3(0.1,0.3,0.8)+vec3(fbm(p+time*spd));
  fc = sky;
  float t = mod(time,1.0);
  float maxHei = 0.05;
  float horLine = 1.0-(((mix(0.0,maxHei,t)*noise(vec2(p.x*10.))) /abs(p.y)));

  if(horLine < 0.0)
  {
    fc= vec3(noise(vec2(p.x*30.))*0.4  );
  }

  gl_FragColor = vec4(fc,0.0);
}
