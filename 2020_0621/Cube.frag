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

vec3 rotate(vec3 p, float angle, vec3 axis)
{
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}

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

float sphere(vec3 p)
{
  return length(p)-0.1;
}

vec3 getNormalSphere(vec3 p)
{
  float d = 0.001;
  return normalize(vec3(
    sphere(p+vec3(d,0.0,0.0))-sphere(p+vec3(-d,0.0,0.0)),
    sphere(p+vec3(0.0,d,0.0))-sphere(p+vec3(0.0,-d,0.0)),
    sphere(p+vec3(0.0,0.0,d))-sphere(p+vec3(0.0,0.0,-d))
    ));
}

vec3 onRep(vec3 p,float interval)
{
  return mod(p,interval)-interval*0.5;
}

void main()
{
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 fc;
  float fov =2.5;
  vec3 cPos = vec3(0.0,0.0,-3);
  vec3 dir = normalize(vec3(p,fov));
  vec3 light = vec3(0.0,-0.5,0.5);
  float depth= 0.0;
  float col = 0.0;

  for(int i=0;i<64;i++)
  {
    vec3 rayPos = cPos + dir * depth;
    float d = sphere(onRep(rayPos,0.5));
    //float d = sphere(rayPos);
    if(d<0.001)
    {
      vec3 n = getNormalSphere(rayPos);
      float l = dot(n,-light);
      fc = vec3(l);
      break;
    }
    depth += d;
  }
  gl_FragColor = vec4(fc,0.0);
}
