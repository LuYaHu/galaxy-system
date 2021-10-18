#version 300 es
//IN
uniform mat4 Model;
uniform mat4 View;
uniform mat4 Projection;

in vec3 vertexPosition;
in vec3 vertexNormal;
in vec2 vertexTexture;

uniform vec3 lightPosition[8];


//OUT
out vec3 a_position;
out vec3 a_normal;
out vec2 a_texture;

out vec3 lightDirection[8];

void main() {
	mat4 PV = Projection * View;
	mat4 PVM = Projection * View * Model;

	gl_Position = PVM * vec4(vertexPosition, 1.0);

	a_position = vec3(Model * gl_Position);
	a_normal = normalize(vec3(Model * vec4(vertexNormal, 0.0)));
	a_texture = vertexTexture;

	for (int i = 0; i < 8; i++) {
		lightDirection[i] = normalize(lightPosition[i] - a_position);
	}
}
