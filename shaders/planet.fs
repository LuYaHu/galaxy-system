#version 300 es
precision mediump float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texture;

in vec3 lightDirection[8];
in vec3 reflectedLightDirection[8];

in vec3 cameraDirection;

uniform float lightLuminosity[8];

uniform sampler2D textureSampler;

out vec4 outColor;

void main () {
	vec4 textureColor = texture(textureSampler, a_texture);

	float ambientIllumination = 0.01;
	float diffuseIllumination = 1.0 * max(0.0, dot(lightDirection[0], a_normal));

	float gamma = 1.6;

	float brightness = ambientIllumination + diffuseIllumination;

	vec3 fragColor = vec3(0.0,0.0,0.0);
	if (brightness > 0.0) fragColor = pow(pow(vec3(textureColor), vec3(gamma)) * min(1.0, brightness), vec3(1.0/gamma));

	outColor = vec4(fragColor, textureColor[3]);

}
