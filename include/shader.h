#ifndef SHADER_H
#define SHADER_H

// include glad to get all needed OpenGL libraries
#include <glad/glad.h>

#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

// shader class save id of shader program.
// load saved shader code from disk
// "use" for activate shader program
// "set" can search for location of uniform and set up it.
class Shader
{
    public:
        // program ID
        unsigned int ID;

        // Constructor load and create shader
        Shader(const GLchar* vertexPath, const GLchar* fragmentPath)
        {
            // 1. load vertex and fragment shader code from file.
            std::string vertexCode;
            std::string fragmentCode;
            std::ifstream vShaderFile;
            std::ifstream fShaderFile;
            // make sure ifstream object can throw exception.
            vShaderFile.exceptions (std::ifstream::failbit | std::ifstream::badbit);
            fShaderFile.exceptions (std::ifstream::failbit | std::ifstream::badbit);
            try
            {
                // open file
                vShaderFile.open(vertexPath);
                fShaderFile.open(fragmentPath);
                std::stringstream vShaderStream, fShaderStream;
                // read buffer from file and load it to stream.
                vShaderStream << vShaderFile.rdbuf();
                fShaderStream << fShaderFile.rdbuf();
                // close file processer.
                vShaderFile.close();
                fShaderFile.close();
                // transform stream to string.
                vertexCode = vShaderStream.str();
                fragmentCode = fShaderStream.str();
            }catch(std::ifstream::failure e)
            {
                std::cout << "ERROR::SHADER::FILE_NOT_SUCCESFULLY_READ" << std::endl;
            }
            const char* vShaderCode = vertexCode.c_str();
            const char* fShaderCode = fragmentCode.c_str();
            // 2. compile the shader
            unsigned int vertex, fragment;
            int success;
            char infoLog[512];

            // vertex shader
            vertex = glCreateShader(GL_VERTEX_SHADER);
            glShaderSource(vertex, 1, &vShaderCode, NULL);
            glCompileShader(vertex);
            // print compile status
            glGetShaderiv(vertex, GL_COMPILE_STATUS, &success);
            if(!success)
            {
                glGetShaderInfoLog(vertex, 512, NULL, infoLog);
                std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << std::endl;
            }

            // fragment shader
            fragment = glCreateShader(GL_FRAGMENT_SHADER);
            glShaderSource(fragment, 1, &fShaderCode, NULL);
            glCompileShader(fragment);
            // print compile status
            glGetShaderiv(fragment, GL_COMPILE_STATUS, &success);
            if(!success)
            {
                glGetShaderInfoLog(fragment, 512, NULL, infoLog);
                std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" << infoLog << std::endl;
            }

            // shader program
            ID = glCreateProgram();
            glAttachShader(ID, vertex);
            glAttachShader(ID, fragment);
            glLinkProgram(ID);
            glGetProgramiv(ID, GL_LINK_STATUS, &success);
            if(!success)
            {
                glGetProgramInfoLog(ID, 512, NULL, infoLog);
                std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n" << infoLog << std::endl;
            }

            // delete shaders after linking succeeded;
            glDeleteShader(vertex);
            glDeleteShader(fragment);
        }
        // use/activate shader program.
        void use()
        {
            glUseProgram(ID);
        }
        // uniform tool function.
        void setBool(const std::string &name, bool value) const
        {
            glUniform1i(glGetUniformLocation(ID, name.c_str()), (int)value);
        }
        void setInt(const std::string &name, int value) const
        {
            glUniform1i(glGetUniformLocation(ID, name.c_str()), value);
        }
        void setFloat(const std::string &name, float value) const
        {
            glUniform1f(glGetUniformLocation(ID, name.c_str()), value);
        }
        void setColor(const std::string &name, float value, float value1, float value2, float value3) const
        {
            glUniform4f(glGetUniformLocation(ID, name.c_str()), value, value1, value2, value3);
        }
};

#endif
