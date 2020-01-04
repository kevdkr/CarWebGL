export class renderObject {
    constructor(gl, program) {
        this.points = [];
        this.gl = gl;
        this.program = program;
        this.bufferId = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);
        this.vPosition = gl.getAttribLocation(program, "vPosition");
        this.vNormal = gl.getAttribLocation(program, "vNormal");
        this.vAmbientDiffuseColor = gl.getAttribLocation(program, "vAmbientDiffuseColor");
        this.vSpecularColor = gl.getAttribLocation(program, "vSpecularColor");
        this.vSpecularExponent = gl.getAttribLocation(program, "vSpecularExponent");
    }
    draw() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);
        this.gl.vertexAttribPointer(this.vPosition, 4, this.gl.FLOAT, false, 32, 0);
        this.gl.enableVertexAttribArray(this.vPosition);
        this.gl.vertexAttribPointer(this.vNormal, 4, this.gl.FLOAT, false, 32, 16);
        this.gl.enableVertexAttribArray(this.vNormal);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.points.length / 2);
    }
}
//# sourceMappingURL=renderObject.js.map