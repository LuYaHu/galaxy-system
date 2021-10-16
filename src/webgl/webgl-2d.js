var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

// 用于传入平移量
uniform vec2 u_translation;

// 用于传入平移量
uniform vec2 u_rotation;

// all shaders have a main function
void main() {
   // 旋转位置
  vec2 rotatedPosition = vec2(a_position.x * u_rotation.y + a_position.y * u_rotation.x,
                              a_position.y * u_rotation.y - a_position.x * u_rotation.x);

  // 加上平移量
  vec2 position = rotatedPosition + u_translation;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#glcanvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl, [
    vertexShaderSource,
    fragmentShaderSource,
  ]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  var resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var rotationLocation = gl.getUniformLocation(program, "u_rotation");

  // Create a buffer
  var positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  var translation = [100, 150];
  var rotation = [0, 1];
  var color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();

  // Setup a ui.
  webglLessonsUI.setupSlider("#x", {
    slide: updatePosition(0),
    max: gl.canvas.width,
  });
  webglLessonsUI.setupSlider("#y", {
    slide: updatePosition(1),
    max: gl.canvas.height,
  });

  webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 });

  function updatePosition(index) {
    return function (event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    var angleInRadians = (angleInDegrees * Math.PI) / 180;
    rotation[0] = Math.sin(angleInRadians);
    rotation[1] = Math.cos(angleInRadians);
    drawScene();
  }

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Update the position buffer with rectangle positions
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    // Set a random color.
    gl.uniform4fv(colorLocation, color);

    // Set translation
    gl.uniform2fv(translationLocation, translation);

    // Set rotation
    gl.uniform2fv(rotationLocation, rotation);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 18;
    gl.drawArrays(primitiveType, offset, count);
  }
}

// Fill the buffer with the values that define a "F".
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
        // 左竖
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,

        // 上横
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,

        // 中横
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90
    ]),
    gl.STATIC_DRAW
  );
}

main();