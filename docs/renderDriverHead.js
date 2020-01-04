import { renderObject } from "./renderObject.js";
import { flatten, vec4 } from "./helperfunctions.js";
export class renderDriverHead extends renderObject {
    constructor(gl, program, subdiv) {
        super(gl, program);
        this.gl = gl;
        this.driverHeadPoints = [];
        this.program = program;
        this.subdiv = subdiv;
        let step = (360.0 / subdiv) * (Math.PI / 180.0);
        for (let lat = 0; lat <= Math.PI; lat += step) {
            for (let lon = 0; lon + step <= 2 * Math.PI; lon += step) {
                this.driverHeadPoints.push(new vec4(Math.sin(lat) * Math.cos(lon), Math.sin(lon) * Math.sin(lat), Math.cos(lat), 1.0)); //position
                this.driverHeadPoints.push(new vec4(Math.sin(lat) * Math.cos(lon), Math.sin(lon) * Math.sin(lat), Math.cos(lat), 0.0)); //normal
                this.driverHeadPoints.push(new vec4(Math.sin(lat) * Math.cos(lon + step), Math.sin(lat) * Math.sin(lon + step), Math.cos(lat), 1.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat) * Math.cos(lon + step), Math.sin(lat) * Math.sin(lon + step), Math.cos(lat), 0.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat + step) * Math.cos(lon + step), Math.sin(lon + step) * Math.sin(lat + step), Math.cos(lat + step), 1.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat + step) * Math.cos(lon + step), Math.sin(lon + step) * Math.sin(lat + step), Math.cos(lat + step), 0.0));
                //triangle 2
                this.driverHeadPoints.push(new vec4(Math.sin(lat + step) * Math.cos(lon + step), Math.sin(lon + step) * Math.sin(lat + step), Math.cos(lat + step), 1.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat + step) * Math.cos(lon + step), Math.sin(lon + step) * Math.sin(lat + step), Math.cos(lat + step), 0.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat + step) * Math.cos(lon), Math.sin(lat + step) * Math.sin(lon), Math.cos(lat + step), 1.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat + step) * Math.cos(lon), Math.sin(lat + step) * Math.sin(lon), Math.cos(lat + step), 0.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat) * Math.cos(lon), Math.sin(lon) * Math.sin(lat), Math.cos(lat), 1.0));
                this.driverHeadPoints.push(new vec4(Math.sin(lat) * Math.cos(lon), Math.sin(lon) * Math.sin(lat), Math.cos(lat), 0.0));
            }
        }
        this.points = this.driverHeadPoints;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.points), this.gl.STATIC_DRAW);
    }
    draw() {
        this.gl.vertexAttrib4fv(this.vAmbientDiffuseColor, [0, 0, 0, 1]);
        this.gl.vertexAttrib4fv(this.vSpecularColor, [0.1, 0.1, 0.1, 1.0]);
        this.gl.vertexAttrib1f(this.vSpecularExponent, 10.0);
        super.draw();
    }
}
//# sourceMappingURL=renderDriverHead.js.map