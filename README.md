# Typescript + WebGL
### A live demo can be found <a href="https://kevdkr.github.io/CarWebGL/index.html"> here</a>

This is a demonstration of transformation matrices, phong lighting, and changing cameras in WebGL using Typescript

## GLSL shaders: 
### Data is passed through the vertex shader
```glsl
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
```
### Then to the fragment shader
```glsl
#version 300 es
precision mediump float;

in vec4 fAmbientDiffuseColor;
in vec4 fSpecularColor;
in float fSpecularExponent;

out vec4 color;

in vec4  veyepos;
in vec3 V;
in vec3 N;

uniform vec4[5] light_position;
uniform vec4[5] light_color;

uniform vec4[5] light_direction;
uniform float[5] cutoff_angle;

uniform vec4 ambient_light;

void main() {

    vec3 fV = normalize(V);
    vec3 fN = normalize(N);

    // ambient term
    vec4 amb = fAmbientDiffuseColor * ambient_light;

    //diffuse term
    vec4 diff = vec4(0, 0, 0, 0);
    vec4 spec = vec4(0, 0, 0, 0);
    for (int i = 0; i < 5; i++) {
        if(dot(normalize(light_position[i] - veyepos), normalize(-light_direction[i])) >= cutoff_angle[i]) {
            vec3 L = normalize(light_position[i].xyz - veyepos.xyz);
            vec3 H = normalize(L+fV);
            diff += max(0.0, dot(L, fN)) * fAmbientDiffuseColor * light_color[i];
            if(dot(L,fN) > 0.0){
                spec += pow(max(0.0, dot(fN,H)), fSpecularExponent) * fSpecularColor * light_color[i];
            }
        }
    }

    color = amb + diff + spec;
}
```
Here is where the Phong lighting equation takes place. 

If the headlights are turned on, it also calculates how much of the scene should be lit up by the headlights.

```glsl
if (dot( normalize(H - S), normalize(-lightDirection)) >= Math.cos(theta))
```

- H - S gives the vector from the surface point to the headlight point. 
- Taking the dot product of H - S and the lightDirection gives the cosine of the angle **to** the surface **from** the light source. 
- This can be compared with the cosine of the chosen cutoff angle. If the cosine of the angle calculated from the dot product is greater than or equal to the cosine of the cutoff angle, the surface should be lit. Otherwise, the surface does not get lit. 
