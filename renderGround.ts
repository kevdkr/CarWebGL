import {renderObject} from "./renderObject.js";
import {flatten, vec4} from "./helperfunctions.js";

export class renderGround extends renderObject {

    groundPoints:vec4[];
    gl:WebGLRenderingContext;
    program:WebGLProgram;

    constructor(gl:WebGLRenderingContext, program:WebGLProgram) {
        super(gl, program);
        this.gl = gl;
        this.groundPoints = [];
        this.program = program;

        this.groundPoints.push(new vec4(4.0,0,-4.0,1.0)); //top right
        this.groundPoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
        this.groundPoints.push(new vec4(4.0, 0, 4.0, 1.0)); //bottom right
        this.groundPoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
        this.groundPoints.push(new vec4(-4.0, 0, 4.0, 1.0));
        this.groundPoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
        this.groundPoints.push(new vec4(-4.0, 0, 4.0, 1.0));
        this.groundPoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
        this.groundPoints.push(new vec4(-4.0, 0, -4.0, 1.0)); // top left
        this.groundPoints.push(new vec4(0.0, 1.0, 0.0, 0.0));
        this.groundPoints.push(new vec4(4.0, 0, -4.0, 1.0)); // top left
        this.groundPoints.push(new vec4(0.0, 1.0, 0.0, 0.0));

        this.points = this.groundPoints;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.points), this.gl.STATIC_DRAW);

    }

    draw() {
        this.gl.vertexAttrib4fv(this.vAmbientDiffuseColor, [0.5, 1, 0.5, 1]);
        this.gl.vertexAttrib4fv(this.vSpecularColor, [0.1, 0.1, 0.1, 0.1]);
        this.gl.vertexAttrib1f(this.vSpecularExponent, 30.0);
        super.draw();
    }

}