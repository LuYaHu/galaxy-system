// 创建变量跟踪正方形的当前旋转
var cubeRotation = 0.0;
main();

//
// Start here
//
function main() {
  const canvas = document.querySelector("#glcanvas");
  // 初始化WebGL上下文
  // 创建一个WebGL2RenderingContext
  const gl = canvas.getContext("webgl2");

  // 确认WebGL支持性
  if (!gl) {
    alert("无法初始化WebGL, 你的浏览器, 操作系统或硬件可能不支持WebGL");
    return;
  }

  // change webgl to webgl2
  // #version 300 es 必须位于着色器代码的第一行. 前面不允许有任何注释或空行
  // 使用WebGL2的着色器语法GLSL ES 3.000 如果没有则是默认为GLSL ES 1.00
  //
  // Vertex shader program

  const vsSource = `#version 300 es

    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 aVertexPosition;
    in vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    out highp vec2 vTextureCoord;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program
  const fsSource = `#version 300 es

    // fragment shader don't have a default precision so we need
    // to pick one. highp is a good default. It means "hight precision"

    precision highp float;

    in highp vec2 vTextureCoord;

    // we need to declare an output for the fragment shader
    out vec4 outColor;

    uniform sampler2D uSampler;

    void main() {
      outColor = texture(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      // vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
    },
  };
  // Here's where we call te routine that builds all
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  const texture = initTextures(gl, "http://localhost:8080/cubeTexture.png");
  // 需要使用一个简单的web服务来使得WebGL可以加载本地图片
  // servez

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001; // convert to sceonds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, texture, deltaTime);

    requestAnimationFrame(render);
    // requestAnimationFrame 要求浏览器再每一帧上调用函数"render"
    // 自页面加载以来经过的时间 (以毫秒为单位)
    // 转换为秒, 从中减去以计算deltaTime自渲染最后一帧以来的秒数
  }
  requestAnimationFrame(render);
}
// 创建对象
function initBuffers(gl) {
  // 顶点数组对象: 告诉属性如何从缓冲区中取出数据
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var vertices = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var cubeVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
  var textureCoordinates = [
    // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  // EBO
  var cubeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  var cubeVertexIndices = [
    //front
    0, 1, 2, 0, 2, 3,
    //back
    4, 5, 6, 4, 6, 7,
    //top
    8, 9, 10, 8, 10, 11,
    // bottom
    12, 13, 14, 12, 14, 15,
    //right
    16, 17, 18, 16, 18, 19,
    //left
    20, 21, 22, 20, 22, 23,
  ];

  // Now send the element array to GL
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cubeVertexIndices),
    gl.STATIC_DRAW
  );

  gl.bindVertexArray(null);
  return {
    position: positionBuffer,
    // color: cubeVerticesColorBuffer,
    indices: cubeVerticesIndexBuffer,
    textureCoord: cubeVerticesTextureCoordBuffer,
    vao: vao,
  };
}

//
// 加载纹理
//
function initTextures(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  // 把新创建的纹理对象绑定到gl.TEXTURE_2D来让它成为当前操作纹理
  // 调用texImage2D() 把已经加载的图片图形数据写到纹理
  // GL_TEXTURE_2D 生成与当前绑定的纹理对象在同一目标上的纹理
  // 第二个参数为纹理指定多级渐远纹理的级别
  // 第三个参数为把纹理存储为何种格式, RGB
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  const image = new Image();
  // 允许跨域访问
  image.crossOrigin = "anonymous";
  //image.onload = function () {
  //  gl.bindTexture(gl.TEXTURE_2D, texture);
  //  gl.texImage2D(
  //    gl.TEXTURE_2D,
  //    level,
  //    internalFormat,
  //    srcFormat,
  //    srcType,
  //    image
  //  );
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );
    // No, it's not a power of 2. Turn of mips and set
    // wrapping to clamp to edge
    // 放大与缩小时过滤方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 生成多级渐进纹理
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  image.src = url;
  return texture;
}

// 绘制场景
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want tho see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.

  const modelViewMatrix = mat4.create();

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0] // amount to translate
  );
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    cubeRotation, // amount to translate
    [0, 0, 1] // axis to rotate around
  );
  // 将modelViewMatrix的当前值cubeRotation绕Z轴旋转
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    cubeRotation * 0.7, // amount to translate
    [0, 1, 0] // axis to rotate around
  );

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3; // pull out 3 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32 bits float data
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position); // ??? 暂时不知道怎么使用VAO控制
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord); // 暂时不知道怎么使用VAO控制
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // 让画布大小匹配显示区域的大小
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  // 将裁剪空间的-1~+1映射到x轴的0~gl.canvas.width和y轴0~gl.canvas.height
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  // Specify the texture to map onto the faces.
  //
  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
}
//
// 初始化着色器程序, 让WebGL知道如何绘制我们的数据
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // 创建着色器程序

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // 创建失败, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

//
// 创建指定类型的着色器, 上传source源码并编译
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
