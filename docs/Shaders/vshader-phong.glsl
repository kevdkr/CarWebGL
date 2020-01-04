#version 300 es

in vec4 vPosition;
in vec4 vNormal;
in vec4 vAmbientDiffuseColor; //material color
in vec4 vSpecularColor;
in float vSpecularExponent;

out vec4 fAmbientDiffuseColor;
out vec4 fSpecularColor;
out float fSpecularExponent;

out vec4 veyepos;
out vec3 V;
out vec3 N;

uniform mat4 model_view;
uniform mat4 projection;

void main() {

    fAmbientDiffuseColor = vAmbientDiffuseColor;
    fSpecularColor = vSpecularColor;
    fSpecularExponent = vSpecularExponent;

    veyepos = model_view*vPosition;

    V = normalize(-veyepos.xyz);

    N = normalize((model_view * vNormal).xyz);

    gl_Position = projection * veyepos;
}