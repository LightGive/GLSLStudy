/*{
  "audio": true,
  "Frameskip": 10,
}*/

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform float volume;
void main()

{
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;

float c = 0.05/length(p+vec2(volume));
  gl_FragColor=vec4(vec3(c),0.0);
}
