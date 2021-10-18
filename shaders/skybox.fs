#version 300 es
precision mediump float;

uniform sampler2D textureSampler;
in vec2 a_texture;

out vec4 outColor;

void main () {
	vec4 textureColor = texture(textureSampler, a_texture);

	float gamma = 0.6;
	float brightness = 0.6;

	outColor = pow(textureColor, vec4(1.0/gamma)) * brightness;
}
