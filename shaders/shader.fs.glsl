#version 300 es

precision mediump float;
uniform sampler2D frame;
in vec2 texCoordinate;
out vec4 renderableOutput;

void main (void) {
  renderableOutput = texture(frame, texCoordinate);
}
