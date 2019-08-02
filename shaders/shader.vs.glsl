#version 300 es

in vec2 vertPos;
in vec2 vidTexture;
uniform vec2 resolution;
out vec2 texCoordinate;

void main (void) {
  vec2 zeroToOne = vertPos / resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  texCoordinate = vidTexture;
}
