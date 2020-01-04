//////////////////////////////////////////////////////////////////////////////
//
//  Angel.js
//
//////////////////////////////////////////////////////////////////////////////
// adapted liberally from Angel's Interactive Computer Graphics 7th Edition by Nathan Gossett
//----------------------------------------------------------------------------
//
//  Helper functions
//
export function initShaders(gl, vertexShaderId, fragmentShaderId) {
    let vertShdr;
    let fragShdr;
    let vertElem = document.getElementById(vertexShaderId);
    if (!vertElem) {
        alert("Unable to load vertex shader " + vertexShaderId);
        return -1;
    }
    else {
        vertShdr = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShdr, vertElem.textContent);
        gl.compileShader(vertShdr);
        if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
            var msg = "Vertex shader failed to compile.  The error log is:"
                + "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
            alert(msg);
            return -1;
        }
    }
    let fragElem = document.getElementById(fragmentShaderId);
    if (!fragElem) {
        alert("Unable to load vertex shader " + fragmentShaderId);
        return -1;
    }
    else {
        fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShdr, fragElem.textContent);
        gl.compileShader(fragShdr);
        if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
            var msg = "Fragment shader failed to compile.  The error log is:"
                + "<pre>" + gl.getShaderInfoLog(fragShdr) + "</pre>";
            alert(msg);
            return -1;
        }
    }
    let program = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog(program) + "</pre>";
        alert(msg);
        return -1;
    }
    return program;
}
// Get a file as a string using  AJAX
function loadFileAJAX(name) {
    let xhr = new XMLHttpRequest(), okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.send(null);
    return xhr.status == okStatus ? xhr.responseText : null;
}
export function initFileShaders(gl, vShaderName, fShaderName) {
    function getShader(gl, shaderName, type) {
        let shader = gl.createShader(type), shaderScript = loadFileAJAX(shaderName);
        if (!shaderScript) {
            alert("Could not find shader source: " + shaderName);
        }
        gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    let vertexShader = getShader(gl, vShaderName, gl.VERTEX_SHADER), fragmentShader = getShader(gl, fShaderName, gl.FRAGMENT_SHADER), program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
        return null;
    }
    return program;
}
//----------------------------------------------------------------------------
export function toradians(degrees) {
    return degrees * Math.PI / 180.0;
}
export function todegrees(radians) {
    return radians * 180.0 / Math.PI;
}
//----------------------------------------------------------------------------
//
//  Vector Constructors
//
//use for texture coordinates
export class vec2 extends Array {
    constructor(x = 0.0, y = 0.0) {
        super();
        this.push(x);
        this.push(y);
    }
}
export class vec3 extends Array {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        super();
        this.push(x);
        this.push(y);
        this.push(z);
    }
    //dot product
    dot(other) {
        let sum = 0.0;
        for (let i = 0; i < this.length; ++i) {
            sum += this[i] * other[i];
        }
        return sum;
    }
    //cross product
    cross(other) {
        return new vec3(this[1] * other[2] - this[2] * other[1], this[2] * other[0] - this[0] * other[2], this[0] * other[1] - this[1] * other[0]);
    }
}
export class vec4 extends Array {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 0.0) {
        super();
        this.push(x);
        this.push(y);
        this.push(z);
        this.push(w);
    }
    //dot product
    dot(other) {
        let sum = 0.0;
        for (let i = 0; i < this.length; ++i) {
            sum += this[i] * other[i];
        }
        return sum;
    }
    //cross product
    cross(other) {
        return new vec4(this[1] * other[2] - this[2] * other[1], this[2] * other[0] - this[0] * other[2], this[0] * other[1] - this[1] * other[0], 0.0);
    }
    // return a unit length vector pointing in the same direction as this vector
    normalize() {
        let len = Math.sqrt(this.dot(this));
        if (!isFinite(len)) {
            throw "normalize: vector " + this + " has zero length";
        }
        for (let i = 0; i < this.length; ++i) {
            this[i] /= len;
        }
        return this;
    }
    // is other identical to this vector?
    equals(other) {
        return this[0] == other[0] &&
            this[1] == other[1] &&
            this[2] == other[2] &&
            this[3] == other[3];
    }
    // return this vector minus other component-wise
    subtract(other) {
        return new vec4(this[0] - other[0], this[1] - other[1], this[2] - other[2], this[3] - other[3]);
    }
    //add this vector to other component-wise
    add(other) {
        return new vec4(this[0] + other[0], this[1] + other[1], this[2] + other[2], this[3] + other[3]);
    }
    //convert this vector to a 1D array of floats (which is actually just v)
    flatten() {
        return this;
    }
}
//----------------------------------------------------------------------------
export class mat4 {
    constructor(v = new vec4(1.0, 0.0, 0.0, 0.0), n = new vec4(0.0, 1.0, 0.0, 0.0), u = new vec4(0.0, 0.0, 1.0, 0.0), t = new vec4(0.0, 0.0, 0.0, 1.0)) {
        //use the incoming vectors as rows in this 2D array
        this.m = [v.flatten(), n.flatten(), u.flatten(), t.flatten()];
    }
    mult(other) {
        if (other instanceof mat4) {
            let result = new mat4();
            for (let i = 0; i < 4; ++i) {
                for (let j = 0; j < 4; ++j) {
                    let sum = 0.0;
                    for (let k = 0; k < 4; ++k) {
                        sum += this.m[i][k] * other.m[k][j];
                    }
                    result.m[i][j] = sum;
                }
            }
            return result;
        }
        else if (other instanceof vec4) {
            let result = new vec4();
            for (let i = 0; i < 4; i++) {
                let sum = 0.0;
                for (let j = 0; j < 4; j++) {
                    sum += this.m[i][j] * other[j];
                }
                result[i] = sum;
            }
            return result;
        }
        else {
            throw "illegal type in multiplication: " + other;
        }
    }
    //convert 4x4 matrix into 1D 16 element array of floats
    flatten() {
        let t = this.transpose().m;
        let floats = new Array(16);
        let idx = 0;
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                floats[idx++] = t[i][j];
            }
        }
        return floats;
    }
    //return transposed matrix
    transpose() {
        let result = new mat4();
        for (let i = 0; i < result.m.length; ++i) {
            for (let j = 0; j < this.m[i].length; ++j) {
                result.m[i][j] = (this.m[j][i]);
            }
        }
        return result;
    }
}
//----------------------------------------------------------------------------
//
//  Basic Transformation Matrix Generators
//
//produce a translation matrix
export function translate(x, y, z) {
    if (Array.isArray(x) && x.length == 3) {
        z = x[2];
        y = x[1];
        x = x[0];
    }
    let result = new mat4();
    result.m[0][3] = x;
    result.m[1][3] = y;
    result.m[2][3] = z;
    return result;
}
//----------------------------------------------------------------------------
//produce a rotation matrix around the supplied axis by the supplied angle in degrees
export function rotate(angle, axis) {
    let [x, y, z] = axis.normalize();
    let c = Math.cos(toradians(angle));
    let omc = 1.0 - c;
    let s = Math.sin(toradians(angle));
    return new mat4(new vec4(x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0), new vec4(x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0), new vec4(x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0), new vec4(0, 0, 0, 1));
}
//produce a rotation matrix around the x axis by the supplied angle in degrees
export function rotateX(theta) {
    let c = Math.cos(toradians(theta));
    let s = Math.sin(toradians(theta));
    return new mat4(new vec4(1.0, 0.0, 0.0, 0.0), new vec4(0.0, c, -s, 0.0), new vec4(0.0, s, c, 0.0), new vec4(0.0, 0.0, 0.0, 1.0));
}
//produce a rotation matrix around the y axis by the supplied angle in degrees
export function rotateY(theta) {
    let c = Math.cos(toradians(theta));
    let s = Math.sin(toradians(theta));
    return new mat4(new vec4(c, 0.0, s, 0.0), new vec4(0.0, 1.0, 0.0, 0.0), new vec4(-s, 0.0, c, 0.0), new vec4(0.0, 0.0, 0.0, 1.0));
}
//produce a rotation matrix around the z axis by the supplied angle in degrees
export function rotateZ(theta) {
    let c = Math.cos(toradians(theta));
    let s = Math.sin(toradians(theta));
    return new mat4(new vec4(c, -s, 0.0, 0.0), new vec4(s, c, 0.0, 0.0), new vec4(0.0, 0.0, 1.0, 0.0), new vec4(0.0, 0.0, 0.0, 1.0));
}
//----------------------------------------------------------------------------
//produce a scaling matrix by the supplied factors along each axis
export function scalem(x, y, z) {
    if (Array.isArray(x) && x.length == 3) {
        z = x[2];
        y = x[1];
        x = x[0];
    }
    let result = new mat4();
    result.m[0][0] = x;
    result.m[1][1] = y;
    result.m[2][2] = z;
    return result;
}
//----------------------------------------------------------------------------
//
//  ModelView Matrix Generators
//
//produce a orientation matrix with camera positioned at location "eye", pointed at location "at", and "up" as the up direction
export function lookAt(eye, at, up) {
    if (eye.equals(at)) {
        return new mat4();
    }
    let v = eye.subtract(at).normalize(); // view direction vector
    let n = up.cross(v).normalize(); //side vector
    let u = v.cross(n).normalize(); //corrected up vector
    let t = new vec4(0, 0, 0, 1);
    return new mat4(n, u, v, t).mult(translate(-eye[0], -eye[1], -eye[2]));
}
//----------------------------------------------------------------------------
//
//  Projection Matrix Generators
//
//Produce a orthographic projection matrix with the supplied boundary planes
export function ortho(left, right, bottom, top, near, far) {
    if (left == right) {
        throw "ortho(): left and right are equal";
    }
    if (bottom == top) {
        throw "ortho(): bottom and top are equal";
    }
    if (near == far) {
        throw "ortho(): near and far are equal";
    }
    let w = right - left;
    let h = top - bottom;
    let d = far - near;
    let result = new mat4();
    result.m[0][0] = 2.0 / w;
    result.m[1][1] = 2.0 / h;
    result.m[2][2] = -2.0 / d;
    result.m[0][3] = -(left + right) / w;
    result.m[1][3] = -(top + bottom) / h;
    result.m[2][3] = -(near + far) / d;
    return result;
}
//----------------------------------------------------------------------------
// produce a perspective projection matrix
// fovy: vertical field of view angle
// aspect: aspect ration (width / height)
// near: distance to near cutting plane
// far: distance to far cutting plane
export function perspective(fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(toradians(fovy) / 2);
    let d = far - near;
    let result = new mat4();
    result.m[0][0] = f / aspect;
    result.m[1][1] = f;
    result.m[2][2] = -(near + far) / d;
    result.m[2][3] = -2 * near * far / d;
    result.m[3][2] = -1;
    result.m[3][3] = 0.0;
    return result;
}
//----------------------------------------------------------------------------
//
//  Matrix Functions
//
// convert an array of vec2 or vec4 objects to a 1D array of floats to send to graphics memory
export function flatten(vecs) {
    //how many total floats are in this array of vec4s?
    let floats = new Float32Array(vecs.length * 4);
    let idx = 0;
    for (let i = 0; i < vecs.length; ++i) {
        for (let j = 0; j < vecs[i].length; ++j) {
            floats[idx++] = vecs[i][j];
        }
    }
    return floats;
}
//# sourceMappingURL=helperfunctions.js.map