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

export function initShaders(gl:WebGLRenderingContext, vertexShaderId:string, fragmentShaderId:string): WebGLProgram {
    let vertShdr:WebGLShader;
    let fragShdr:WebGLShader;

    let vertElem:HTMLScriptElement = <HTMLScriptElement>document.getElementById(vertexShaderId);
    if (!vertElem) {
        alert("Unable to load vertex shader " + vertexShaderId);
        return -1;
    } else {
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

    let fragElem:HTMLScriptElement = <HTMLScriptElement>document.getElementById(fragmentShaderId);
    if (!fragElem) {
        alert("Unable to load vertex shader " + fragmentShaderId);
        return -1;
    } else {
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

    let program:WebGLProgram = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let msg:string = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog(program) + "</pre>";
        alert(msg);
        return -1;
    }

    return program;
}

// Get a file as a string using  AJAX
function loadFileAJAX(name:string) :string {
    let xhr:XMLHttpRequest = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.send(null);
    return xhr.status == okStatus ? xhr.responseText : null;
}



export function initFileShaders(gl:WebGLRenderingContext, vShaderName:string, fShaderName:string):WebGLProgram {
    function getShader(gl:WebGLRenderingContext, shaderName:string, type:GLenum) :WebGLShader {
        let shader:WebGLShader = gl.createShader(type),
            shaderScript = loadFileAJAX(shaderName);
        if (!shaderScript) {
            alert("Could not find shader source: "+shaderName);
        }
        gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    let vertexShader:WebGLShader = getShader(gl, vShaderName, gl.VERTEX_SHADER),
        fragmentShader = getShader(gl, fShaderName, gl.FRAGMENT_SHADER),
        program = gl.createProgram();

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

export function toradians(degrees:number ):number {
    return degrees * Math.PI / 180.0;
}

export function todegrees(radians:number):number{
    return radians * 180.0 / Math.PI;
}

//----------------------------------------------------------------------------
//
//  Vector Constructors
//


//use for texture coordinates
export class vec2 extends Array{

    constructor(x:number = 0.0, y:number = 0.0){
        super();
        this.push(x);
        this.push(y);
    }
}

export class vec3 extends Array{

    constructor(x:number = 0.0, y:number = 0.0, z:number = 0.0){
        super();
        this.push(x);
        this.push(y);
        this.push(z);

    }

    //dot product
    dot(other: vec3) :number {

        let sum:number = 0.0;
        for (let i = 0; i < this.length; ++i) {
            sum += this[i] * other[i];
        }

        return sum;
    }

    //cross product
    cross(other: vec3): vec3{
        return new vec3(
            this[1]*other[2] - this[2]*other[1],
            this[2]*other[0] - this[0]*other[2],
            this[0]*other[1] - this[1]*other[0]
        );

    }
}

export class vec4 extends Array{


    constructor(x:number = 0.0, y:number = 0.0, z:number = 0.0, w:number = 0.0){
        super();
        this.push(x);
        this.push(y);
        this.push(z);
        this.push(w);
    }

    //dot product
    dot(other: vec4): number {

        let sum:number = 0.0;
        for (let i = 0; i < this.length; ++i) {
            sum += this[i] * other[i];
        }

        return sum;
    }

    //cross product
    cross(other: vec4): vec4{
        return new vec4(
            this[1]*other[2] - this[2]*other[1],
            this[2]*other[0] - this[0]*other[2],
            this[0]*other[1] - this[1]*other[0],
            0.0
        );

    }

    // return a unit length vector pointing in the same direction as this vector
    normalize(): vec4{
        let len:number = Math.sqrt( this.dot(this) );

        if ( !isFinite(len) ) {
            throw "normalize: vector " + this + " has zero length";
        }

        for ( let i = 0; i < this.length; ++i ) {
            this[i] /= len;
        }
        return this;
    }

    // is other identical to this vector?
    equals(other:vec4):boolean{
        return this[0] == other[0] &&
            this[1] == other[1] &&
            this[2] == other[2] &&
            this[3] == other[3];
    }

    // return this vector minus other component-wise
    subtract(other:vec4):vec4{
        return new vec4(
            this[0] - other[0],
            this[1] - other[1],
            this[2] - other[2],
            this[3] - other[3]
        );
    }

    //add this vector to other component-wise
    add(other:vec4):vec4{
        return new vec4(
            this[0] + other[0],
            this[1] + other[1],
            this[2] + other[2],
            this[3] + other[3]
        );
    }

    //convert this vector to a 1D array of floats (which is actually just v)
    flatten(): number[]{
        return this;
    }
}



//----------------------------------------------------------------------------

export class mat4
{
    m: number[][]; //4x4 matrix stored as rows
    constructor(v:vec4 = new vec4(1.0, 0.0,  0.0,   0.0 ),
                n:vec4 = new vec4(0.0, 1.0,  0.0,   0.0 ),
                u:vec4 = new vec4(0.0, 0.0,  1.0,   0.0 ),
                t:vec4 = new vec4(0.0, 0.0,  0.0,   1.0 )){
        //use the incoming vectors as rows in this 2D array
        this.m = [v.flatten(), n.flatten(), u.flatten(), t.flatten()];
    }


    //overloaded multiplication function
    //multiply this*other
    mult(other:mat4):mat4;
    mult(other:vec4):vec4;
    mult(other:mat4|vec4):mat4|vec4{

        if(other instanceof mat4){
            let result = new mat4();
            for ( let i = 0; i < 4; ++i ) {

                for ( let j = 0; j < 4; ++j ) {
                    let sum = 0.0;
                    for ( let k = 0; k < 4; ++k ) {
                        sum += this.m[i][k] * other.m[k][j];
                    }
                    result.m[i][j] = sum;
                }
            }
            return result;
        }else if(other instanceof vec4){
            let result = new vec4();
            for(let i = 0; i < 4; i++) {
                let sum = 0.0;
                for(let j=0; j< 4; j++) {
                    sum += this.m[i][j] * other[j];
                }
                result[i] = sum;
            }
            return result;
        }else{
            throw "illegal type in multiplication: " + other;
        }
    }

    //convert 4x4 matrix into 1D 16 element array of floats
    flatten():number[]{
        let t:number[][] = this.transpose().m;
        let floats:number[] = new Array( 16 );
        let idx = 0;
        for ( let i = 0; i < 4; ++i ) {
            for ( let j = 0; j < 4; ++j ) {
                floats[idx++] = t[i][j];
            }
        }
        return floats;
    }

    //return transposed matrix
    transpose():mat4{
        let result:mat4 = new mat4();
        for ( let i:number = 0; i < result.m.length; ++i ) {

            for ( let j:number = 0; j < this.m[i].length; ++j ) {
                result.m[i][j] = ( this.m[j][i] );
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
export function translate( x:number, y:number, z:number ): mat4
{
    if ( Array.isArray(x) && x.length == 3 ) {
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
export function rotate( angle:number, axis: vec4 ): mat4
{


    let [x,y,z] = axis.normalize();

    let c = Math.cos( toradians(angle) );
    let omc = 1.0 - c;
    let s = Math.sin( toradians(angle) );

    return new mat4(
        new vec4( x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s, 0.0 ),
        new vec4( x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s, 0.0 ),
        new  vec4( x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c,   0.0 ),
        new vec4(0,0,0,1)
    );

}

//produce a rotation matrix around the x axis by the supplied angle in degrees
export function rotateX(theta:number) :mat4{
    let c = Math.cos( toradians(theta) );
    let s = Math.sin( toradians(theta) );
    return new mat4(
        new vec4(1.0,  0.0,  0.0, 0.0),
        new vec4(0.0,  c,  -s, 0.0),
        new vec4(0.0, s,  c, 0.0),
        new vec4(0.0,  0.0,  0.0, 1.0 ));
}

//produce a rotation matrix around the y axis by the supplied angle in degrees
export function rotateY(theta):mat4 {
    let c = Math.cos( toradians(theta) );
    let s = Math.sin( toradians(theta) );
    return new mat4(
        new vec4(c, 0.0, s, 0.0),
        new vec4(0.0, 1.0,  0.0, 0.0),
        new vec4(-s, 0.0,  c, 0.0),
        new vec4(0.0, 0.0,  0.0, 1.0 ));
}

//produce a rotation matrix around the z axis by the supplied angle in degrees
export function rotateZ(theta: number): mat4 {
    let c = Math.cos( toradians(theta) );
    let s = Math.sin( toradians(theta) );
    return new mat4(
        new vec4(c, -s, 0.0, 0.0),
        new vec4( s,  c, 0.0, 0.0),
        new vec4 (0.0,  0.0, 1.0, 0.0),
        new vec4 (0.0,  0.0, 0.0, 1.0 ));
}


//----------------------------------------------------------------------------
//produce a scaling matrix by the supplied factors along each axis
export function scalem( x:number, y:number, z:number )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    let result:mat4 = new mat4();
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
export function lookAt( eye:vec4, at:vec4, up:vec4 ): mat4
{
    if ( eye.equals(at) ) {
        return new mat4();
    }

    let v:vec4 = eye.subtract(at).normalize();  // view direction vector
    let n:vec4 = up.cross(v).normalize();  //side vector
    let u:vec4 = v.cross(n).normalize(); //corrected up vector
    let t:vec4 = new vec4(0,0,0,1);
    return new mat4(n,u,v,t).mult(translate(-eye[0], -eye[1], -eye[2])) as mat4;


}
//----------------------------------------------------------------------------
//
//  Projection Matrix Generators
//

//Produce a orthographic projection matrix with the supplied boundary planes
export function ortho( left:number, right:number, bottom:number, top:number, near:number, far:number ): mat4
{
    if ( left == right ) { throw "ortho(): left and right are equal"; }
    if ( bottom == top ) { throw "ortho(): bottom and top are equal"; }
    if ( near == far )   { throw "ortho(): near and far are equal"; }

    let w:number = right - left;
    let h:number = top - bottom;
    let d:number = far - near;

    let result:mat4 = new mat4();
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
export function perspective( fovy:number, aspect:number, near:number, far:number ): mat4
{
    let f:number = 1.0 / Math.tan( toradians(fovy) / 2 );
    let d:number = far - near;

    let result:mat4 = new mat4();
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
export function flatten(vecs:vec2[]|vec4[]):Float32Array
{

    //how many total floats are in this array of vec4s?
    let floats = new Float32Array(  vecs.length * 4 );

    let idx = 0;
    for ( let i = 0; i < vecs.length; ++i ) {
        for ( let j = 0; j < vecs[i].length; ++j ) {
            floats[idx++] = vecs[i][j];
        }
    }

    return floats;
}





