/*{
  "audio": true,
  "Frameskip": 10,
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

float linearstep(float begin, float end, float t)
{
  return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float easeInOutQuint(float x)
{
  return x < 0.5 ?( 16. * x * x * x * x * x) :( 1. - pow(-2. * x + 2., 5.) / 2.);
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


void main()
{
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 fc;

  float interval = 1.5;
  float size = 0.1;
  const int l = 20;
  for(int i=0;i<l;i++)
  {
    float cTime = time + (float(i)/ float(l))*interval;
    float t = easeInOutQuint(mod(cTime,interval)/interval);
    float st1 = random(vec2(floor(cTime/interval)+(1.0/float(i))))*2.0 - 1.0;
    float st2 = random(vec2(floor(cTime/interval)+(1.0/float(i))+0.01))*2.0-1.0;
    vec2 center =vec2(st1,st2);
    float c =1.0 - step(size, length(p-center));
    float inc = 1.0-step(t*size,length(p-center));
    float ring = clamp(c-inc,0.0,1.0);
    fc += vec3(ring);

  }

   float w = texture2D(samples,vec2(abs(p.y)),0.0).r;
  // float a = degrees( atan(p.y,p.x))/360.0;
  // float s = texture2D(spectrum,vec2(abs(p.y),0.0)).r;
  // float wave =  0.01 / abs( p.y - sin(p.x+time+w));
  // fc = vec3(wave)*vec3(0.0,0.1,0.5);
  //fc = vec3(1.0);


  //fc += w ;
  gl_FragColor = vec4(fc,0.0);
}
