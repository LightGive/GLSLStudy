 #define PI 3.141592653589793
 #define random(st) fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123)

precision mediump float;
uniform float time;
uniform vec2 resolution;

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

void main()
{
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  float st = step(0.4,length(p));
  float interval = 0.05;
  float lineCount = 25.;
  float t = floor((time/interval));
  float ran = random(vec2(t));
  float a = degrees(atan(p.y,p.x))/360.*lineCount;
  float c = 1.0 -(2./length(p));
  float n = step(0.84, noise(vec2(ran,a)*lineCount))+c;
  vec3 fc;
  fc =  vec3(n);
  gl_FragColor = vec4(fc,0.0);
}
