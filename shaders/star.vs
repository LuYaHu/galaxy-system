#version 300 es
uniform mat4 Model;
uniform mat4 View;
uniform mat4 Projection;

in vec3 vertexPosition;
in vec3 vertexNormal;
in vec2 vertexTexture;

out vec3 a_position;
out vec3 a_normal;
out vec2 a_texture;

out vec4 eyePosition;
out vec4 eyeNormal;

void main() {
	a_position = vertexPosition;
	a_normal = vertexNormal;
	a_texture = vertexTexture;

	mat4 PVM = Projection * View * Model;
	gl_Position = eyePosition = PVM * vec4(vertexPosition, 1.0);
	eyeNormal = PVM * vec4(normalize(vertexNormal), 0.0);
}
