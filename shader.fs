#version 330 core
  out vec4 FragColor;
  in vec3 ourColor;
  in vec2 TexCoord;

  // GLSL有一个供纹理对象使用的内建数据类型, 叫做采样器, 以纹理类型作为后缀
  uniform sampler2D ourTexture;

  void main()
  {
    //FragColor = vec4(ourColor, 1.0);
    FragColor = texture2D(ourTexture, TexCoord);
  };

