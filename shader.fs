#version 330 core
  out vec4 FragColor;
  in vec3 ourColor;
  in vec2 TexCoord;

  uniform float change_view;
  // GLSL有一个供纹理对象使用的内建数据类型, 叫做采样器, 以纹理类型作为后缀
  uniform sampler2D texture1;
  uniform sampler2D texture2;

  void main()
  {
    //FragColor = vec4(ourColor, 1.0);
    //FragColor = texture2D(ourTexture, TexCoord) * vec4(ourColor, 1.0);
    FragColor = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), change_view);
    // mix 接受两个值作为参数, 根据第三个参数进行线性插值 0.2
    // 返回80%第一个颜色和20%第二个颜色
  };

