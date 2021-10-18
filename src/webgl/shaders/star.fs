#version 300 es
precision mediump float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texture;

in vec4 eyePosition;
in vec4 eyeNormal;

uniform sampler2D textureSampler;

out vec4 outColor;

void main () {
	vec4 textureColor = texture(textureSampler, a_texture);

	vec4 N = normalize(eyeNormal);
	vec4 L = normalize(-eyePosition);
	vec4 R = reflect(L, N);
	vec4 diffuseIllumination = vec4(vec3(1.0,1.0,1.0) * clamp(dot(N, L), 0.0, 1.0), 1.0);

	outColor = clamp(textureColor * (diffuseIllumination * 0.8 + 0.6), 0.0, 1.0);

}
