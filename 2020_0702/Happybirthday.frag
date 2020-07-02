/*{
  "audio": true,
}*/

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

vec3 solveCubic(float a, float b, float c)
{
   float p = b - a*a / 3.0, p3 = p*p*p;
   float q = a * (2.0*a*a - 9.0*b) / 27.0 + c;
   float d = q*q + 4.0*p3 / 27.0;
   float offset = -a / 3.0;
   if(d >= 0.0) {
      float z = sqrt(d);
      vec2 x = (vec2(z, -z) - q) / 2.0;
      vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
      return vec3(offset + uv.x + uv.y);
   }
   float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
   float m = cos(v), n = sin(v)*1.732050808;
   return vec3(m + m, -n - m, n - m) * sqrt(-p / 3.0) + offset;
}
vec3 sdBezier(vec2 A, vec2 B, vec2 C, vec2 p)
{
   B = mix(B + vec2(1e-4), B, abs(sign(B * 2.0 - A - C)));
   vec2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - p;
   vec3 k = vec3(3.*dot(a,b),2.*dot(a,a)+dot(d,b),dot(d,a)) / dot(b,b);
   vec2 t = clamp(solveCubic(k.x, k.y, k.z).xy, 0.0, 1.0);
   vec2 dp1 = d + (c + b*t.x)*t.x;
   float d1 = dot(dp1, dp1);
   vec2 dp2 = d + (c + b*t.y)*t.y;
   float d2 = dot(dp2, dp2);

   // note: 3rd root is actually never closest, we can just ignore it

#if ENDPOINTS == 1

   // Find closest distance and t
   vec2 r = (d1 < d2) ? vec2(d1, t.x) : vec2(d2, t.y);

   // Find on which side (t=0 or t=1) is extension
   vec2 e = vec2(step(0.,-r.y),step(1.,r.y));

   // Calc. gradient
   vec2 g = 2.*b*r.y + c;

   // Calc. extension to t
   float et = (e.x*dot(-d,g) + e.y*dot(p-C,g))/dot(g,g);

   // Find closest point on curve with extension
   vec2 dp = d + (c + b*r.y)*r.y + et*g;

   // Sign is just cross product with gradient
   float s =  sign(g.x*dp.y - g.y*dp.x);

   return vec3(sqrt(r.x), s*length(dp), r.y + et);

#else

   // If we don't care about endpoint extension, it's simpler.

   vec4 r = (d1 < d2) ? vec4(d1, t.x, dp1) : vec4(d2, t.y, dp2);

   // Sign is just cross product with gradient
   vec2 g = 2.*b*r.y + c;
   float s =  sign(g.x*r.w - g.y*r.z);

   float dist = sqrt(r.x);
   return vec3(dist, s*dist, r.y);

#endif
}

void main()
{
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;

  gl_FragColor = vec4(p,0.0,0.0);
}
