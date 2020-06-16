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
uniform sampler2D backbuffer;

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
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}


void main()
{
  // vec2 uv = gl_FragCoord.xy/resolution.xy;
  // vec2 p = (gl_FragCoord.xy*2.0- resolution.xy)/min(resolution.x,resolution.y);
  // vec3 fc = vec3(0.1,.4,.3);
  //
  // p = p*rot(time*.1);
  // float pixelCnt = abs(sin(time)*30.*0.5+30.);
  // vec2 pixelres = vec2(floor(p.x*pixelCnt),floor(p.y*pixelCnt));
  // vec3 hor = vec3(0.1 / noise(vec2(random(vec2(pixelres.y))*10.+time)))* vec3(0.0,0.1,0.8);
  // vec3 ver = vec3(0.1 / noise(vec2(random(vec2(pixelres.x))*10.+time)))* vec3(0.0,0.8,0.0);
  // hor*= 10./length(pixelres.x-sin(time)*pixelCnt);
  // ver*= 10./length(pixelres.y- cos(time)*pixelCnt);
  // vec3 mos = hor + ver;
  //
  // vec4 a = texture2D(spectrum, mod(p * .39 - time * .19, .7));
  // fc = mos* a.x * 7.0;
  // //gl_FragColor = a;
  // gl_FragColor = vec4(fc,1.0);

  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;

  float a = atan(p.y, p.x);
  float l = length(p);
  p += fbm(vec2(p + l * 20. + a * sin(time * .3) * 10.)) * .2;

  p = vec2(length(p - .1));
  p -= time * .3;
gl_FragColor = vec4(0.1,0.4,1.0,1.0);

  gl_FragColor = vec4(
    texture2D(spectrum, mod(p * .39 - time * .19, .7)).r,
    texture2D(spectrum, mod(p * .31 - time * .13, .54)).r,
    texture2D(spectrum, mod(p * .37 - time * .17, .6)).r,
    1.
  ) + texture2D(backbuffer, uv)*.8;
}
