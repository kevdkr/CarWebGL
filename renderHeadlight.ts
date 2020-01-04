import {renderObject} from "./renderObject.js";
import {flatten, toradians, vec4} from "./helperfunctions.js";

export class renderHeadlight extends renderObject {

    headlightPoints:vec4[];
    gl:WebGLRenderingContext;
    program:WebGLProgram;

    constructor(gl:WebGLRenderingContext, program:WebGLProgram) {
        super(gl, program);
        this.gl = gl;
        this.headlightPoints = [];
        this.program = program;

        // triangle fan
        this.headlightPoints.push(new vec4(0, 0, .1, 1));
        this.headlightPoints.push(new vec4(1.0, 0.0, 0.0, 0.0));

        for(let i = 0; i < 360; i++){

            if(i > 350){
                this.headlightPoints.push(new vec4(Math.cos(toradians(i))/6, Math.sin(toradians(i))/6, .1, 1));
                this.headlightPoints.push(new vec4(1, 0, 0, 0.0));
            }
            this.headlightPoints.push(new vec4(Math.cos(toradians(i))/6, Math.sin(toradians(i))/6, .1, 1));
            this.headlightPoints.push(new vec4(1, 0, 0,0.0));
        }

        // triangle strip
        for(let i = 0; i < 360; i++){
            this.headlightPoints.push(new vec4(Math.cos(i)/6, Math.sin(i)/6, .1, 1));
            this.headlightPoints.push(new vec4(Math.cos(i)/6, Math.sin(i)/6, .1,0.0));

            this.headlightPoints.push(new vec4(Math.cos(i)/6, Math.sin(i)/6, -.1, 1));
            this.headlightPoints.push(new vec4(Math.cos(i)/6, Math.sin(i)/6, -.1, 0.0));
        }


        this.points = this.headlightPoints;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.points), this.gl.STATIC_DRAW);
    }

    draw() {

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);

        this.gl.vertexAttribPointer(this.vPosition, 4, this.gl.FLOAT, false, 32, 0);
        this.gl.enableVertexAttribArray(this.vPosition);

        this.gl.vertexAttribPointer(this.vNormal, 4, this.gl.FLOAT, false, 32, 16);
        this.gl.enableVertexAttribArray(this.vNormal);

        this.gl.vertexAttrib4fv(this.vAmbientDiffuseColor, [1, 1, 1, 1]);
        this.gl.vertexAttrib4fv(this.vSpecularColor, [1.0, 1.0, 1.0, 1.0]);
        this.gl.vertexAttrib1f(this.vSpecularExponent, 30.0);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 360*2);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 360*2, (360*2)+(360*3));
    }


}