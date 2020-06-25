 #define PI 3.141592653589793
 #define PI2 PI * 2.
 #define repeat(p, span) mod(p, span) - (0.5 * span)
 #define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
 #define random(st) fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123)

/*{ "audio": true }*/
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
    // Initial values
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

float linearstep(float begin, float end, float t)
{
  return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float easeInOutQuint(float x)
{
  return x < 0.5 ?( 16. * x * x * x * x * x) :( 1. - pow(-2. * x + 2., 5.) / 2.);
}


void main()
{
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;
vec3 fc;
  p*=10.0;
  float span = max(resolution.x,resolution.y)/min(resolution.x,resolution.y);
  vec2 off = vec2(floor(p.x/span),floor(p.y/span));
  p =mod(p, span) - (0.5 * span);
  float timeOff = length(off*0.1);

  float c =1.0-step(abs(sin(time - timeOff)),length(p));
  float ring = 0.05/abs(mod(time*.4,0.4)-(length(off)*0.02)) + 0.5;
  fc = vec3(c)* vec3(0.2,0.2,0.8)*ring;
  gl_FragColor = vec4(fc,0.0);
}
