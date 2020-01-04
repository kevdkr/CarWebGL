"use strict";
let gl;
let canvas;
let program;
let umv;
let uproj;
let xoffset;
let yoffset;
let zoffset;
let xgroundoffset;
let ygroundoffset;
let zgroundoffset;
let ground;
let sphere;
let car;
let wheel;
let headlight;
let camera;
let driverHead;
let driverEye;
let driverHeadRotation;
let frontRotation;
let frontTireRotation;
let zTireRotation;
let xgroundedge;
let zgroundedge;
let isMovingForward;
let isMovingBackward;
let light;
let headlight_color;
let siren_red;
let siren_blue;
let blueSirenRotation;
let redSirenRotation;
let isSirenRotating;
//uniform indices for light properties
let light_position;
let light_color;
let ambient_light;
let light_direction;
let cutoff_angle;
import { vec4, flatten, translate, rotateY, rotateZ, toradians, scalem, initFileShaders } from './helperfunctions.js';
import { renderGround } from './renderGround.js';
import { renderWheel } from "./renderWheel.js";
import { renderCar } from "./renderCar.js";
import { Camera } from "./Camera.js";
import { renderDriverHead } from "./renderDriverHead.js";
import { renderDriverEye } from "./renderDriverEye.js";
import { renderSphere } from "./renderSphere.js";
import { renderHeadlight } from "./renderHeadlight.js";
window.onload = function init() {
    isMovingForward = isMovingBackward = false;
    xgroundedge = 3.6 * 2;
    zgroundedge = 4.0 * 2;
    frontRotation = 90;
    frontTireRotation = 0;
    zTireRotation = 0;
    light = 0;
    headlight_color = 0;
    siren_red = 0;
    siren_blue = 0;
    redSirenRotation = 180;
    blueSirenRotation = 0;
    isSirenRotating = false;
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("webGL isn't available");
    }
    program = initFileShaders(gl, "Shaders/vshader-phong.glsl", "Shaders/fshader-phong.glsl");
    gl.useProgram(program);
    umv = gl.getUniformLocation(program, "model_view");
    uproj = gl.getUniformLocation(program, "projection");
    light_position = gl.getUniformLocation(program, "light_position");
    light_color = gl.getUniformLocation(program, "light_color");
    ambient_light = gl.getUniformLocation(program, "ambient_light");
    light_direction = gl.getUniformLocation(program, "light_direction");
    cutoff_angle = gl.getUniformLocation(program, "cutoff_angle");
    xoffset = yoffset = zoffset = 0;
    xgroundoffset = ygroundoffset = zgroundoffset = 0;
    window.addEventListener("keydown", keydown);
    window.addEventListener("keydown", switchCameras);
    window.addEventListener("keydown", controlFreeCamera);
    window.addEventListener("keydown", controlViewpointCamera);
    window.addEventListener("keydown", controlLights);
    ground = new renderGround(gl, program);
    sphere = new renderSphere(gl, program, 60);
    car = new renderCar(gl, program, 15);
    wheel = new renderWheel(gl, program);
    camera = new Camera(canvas);
    driverHead = new renderDriverHead(gl, program, 15);
    driverEye = new renderDriverEye(gl, program, 15);
    headlight = new renderHeadlight(gl, program);
    driverHeadRotation = 0;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    window.setInterval(update, 16);
};
function keydown(event) {
    switch (event.key) {
        case "ArrowUp":
            isMovingBackward = false;
            isMovingForward = true;
            xoffset += Math.sin(toradians(frontRotation)) * .02;
            zoffset += Math.cos(toradians(frontRotation)) * .02;
            break;
        case "ArrowDown":
            isMovingForward = false;
            isMovingBackward = true;
            xoffset -= Math.sin(toradians(frontRotation)) * .02;
            zoffset -= Math.cos(toradians(frontRotation)) * .02;
            break;
        case "ArrowRight":
            if (frontTireRotation >= -15) {
                frontTireRotation -= 1;
            }
            break;
        case "ArrowLeft":
            if (frontTireRotation <= 15) {
                frontTireRotation += 1;
            }
            break;
        case " ":
            isMovingBackward = false;
            isMovingForward = false;
            break;
    }
}
function switchCameras(event) {
    switch (event.key) {
        case "1":
            camera.isCamera2 = false;
            camera.isCamera3 = false;
            camera.isCamera1 = true;
            break;
        case "2":
            camera.isCamera1 = false;
            camera.isCamera3 = false;
            camera.isCamera2 = true;
            break;
        case "3":
            camera.isCamera1 = false;
            camera.isCamera2 = false;
            camera.isCamera3 = true;
            break;
    }
}
function controlFreeCamera(event) {
    if (camera.isCamera1 == true) {
        switch (event.key) {
            case "q":
                if (camera.lenszoom <= 100) {
                    camera.lenszoom += .5;
                }
                break;
            case "w":
                if (camera.lenszoom >= 10) {
                    camera.lenszoom -= .5;
                }
                break;
            case "s":
                if (camera.dollyz <= 20) {
                    camera.dollyz += .1;
                }
                break;
            case "a":
                if (camera.dollyz >= 1) {
                    camera.dollyz -= .1;
                }
                break;
            case "f":
                if (camera.isFreeFollow == true) {
                    camera.isFreeCenter = true;
                    camera.isFreeFollow = false;
                }
                else if (camera.isFreeCenter == true) {
                    camera.isFreeFollow = true;
                    camera.isFreeCenter = false;
                }
                break;
            case "r":
                camera = new Camera(canvas);
                break;
        }
    }
}
function controlViewpointCamera(event) {
    switch (event.key) {
        case "z":
            if (driverHeadRotation <= 45) {
                driverHeadRotation += 1;
            }
            break;
        case "x":
            if (driverHeadRotation >= -45) {
                driverHeadRotation -= 1;
            }
            break;
    }
}
function controlLights(event) {
    switch (event.key) {
        case "0":
            if (light == 0) {
                light = 1;
            }
            else if (light == 1) {
                light = 0;
            }
            break;
        case "9":
            if (headlight_color == 0) {
                headlight_color = 1;
            }
            else if (headlight_color == 1) {
                headlight_color = 0;
            }
            break;
        case "8":
            if (siren_red == 0 && siren_blue == 0) {
                siren_red = 1;
                siren_blue = 1;
                isSirenRotating = true;
            }
            else if (siren_red == 1 && siren_blue == 1) {
                siren_red = 0;
                siren_blue = 0;
                isSirenRotating = false;
            }
            break;
    }
}
function update() {
    if (xoffset < xgroundedge && xoffset > -xgroundedge && zoffset < zgroundedge - .3 && zoffset > -zgroundedge + .5) {
        if (isMovingForward == true) {
            frontRotation += frontTireRotation / 10;
            xoffset += Math.sin(toradians(frontRotation)) * .02;
            zoffset += Math.cos(toradians(frontRotation)) * .02;
            zTireRotation -= 1.0;
        }
        else if (isMovingBackward == true) {
            frontRotation -= frontTireRotation / 10;
            xoffset -= Math.sin(toradians(frontRotation)) * .02;
            zoffset -= Math.cos(toradians(frontRotation)) * .02;
            zTireRotation += 1.0;
        }
    }
    if (isSirenRotating == true) {
        if (redSirenRotation >= 360) {
            redSirenRotation -= 360;
        }
        if (blueSirenRotation >= 360) {
            blueSirenRotation -= 360;
        }
        blueSirenRotation += 2;
        redSirenRotation += 2;
    }
    requestAnimationFrame(render);
}
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (camera.isCamera1 == true) {
        if (camera.isFreeCenter == true) {
            camera.setFreeCamera();
        }
        else if (camera.isFreeFollow == true) {
            camera.setFreeCameraF(xoffset, zoffset);
        }
    }
    if (camera.isCamera2 == true) {
        camera.setViewpointCamera(xoffset, zoffset, frontRotation, driverHeadRotation);
    }
    if (camera.isCamera3 == true) {
        camera.setChaseCamera(xoffset, zoffset, frontRotation);
    }
    gl.uniformMatrix4fv(uproj, false, camera.p.flatten());
    let groundmv = camera.view;
    groundmv = groundmv.mult(translate(xgroundoffset, ygroundoffset, zgroundoffset));
    groundmv = groundmv.mult(scalem(2, 2, 2));
    gl.uniformMatrix4fv(umv, false, groundmv.flatten());
    ground.draw();
    let carmv = camera.view;
    carmv = carmv.mult(translate(xoffset, yoffset + .3, zoffset));
    carmv = carmv.mult(rotateY(frontRotation));
    carmv = carmv.mult(scalem(0.3, 0.3, 0.5));
    gl.uniformMatrix4fv(umv, false, carmv.flatten());
    car.draw();
    let rightFrontWheelmv = carmv;
    rightFrontWheelmv = rightFrontWheelmv.mult(translate(-1.0, -0.43, 0.6));
    rightFrontWheelmv = rightFrontWheelmv.mult(rotateY(frontTireRotation - 90));
    rightFrontWheelmv = rightFrontWheelmv.mult(rotateZ(zTireRotation));
    rightFrontWheelmv = rightFrontWheelmv.mult(scalem(3.5, 3.5, 5.0));
    gl.uniformMatrix4fv(umv, false, rightFrontWheelmv.flatten());
    wheel.draw();
    let leftFrontWheelmv = carmv;
    leftFrontWheelmv = leftFrontWheelmv.mult(translate(1.0, -0.43, 0.6));
    leftFrontWheelmv = leftFrontWheelmv.mult(rotateY(frontTireRotation + 90));
    leftFrontWheelmv = leftFrontWheelmv.mult(rotateZ(-zTireRotation));
    leftFrontWheelmv = leftFrontWheelmv.mult(scalem(3.5, 3.5, 5.0));
    gl.uniformMatrix4fv(umv, false, leftFrontWheelmv.flatten());
    wheel.draw();
    let rightBackWheelmv = carmv;
    rightBackWheelmv = rightBackWheelmv.mult(translate(-1.0, -0.43, -0.6));
    rightBackWheelmv = rightBackWheelmv.mult(rotateY(-90));
    rightBackWheelmv = rightBackWheelmv.mult(rotateZ(zTireRotation));
    rightBackWheelmv = rightBackWheelmv.mult(scalem(3.5, 3.5, 5.0));
    gl.uniformMatrix4fv(umv, false, rightBackWheelmv.flatten());
    wheel.draw();
    let leftBackWheelmv = carmv;
    leftBackWheelmv = leftBackWheelmv.mult(translate(1.0, -0.43, -0.6));
    leftBackWheelmv = leftBackWheelmv.mult(rotateY(90));
    leftBackWheelmv = leftBackWheelmv.mult(rotateZ(-zTireRotation));
    leftBackWheelmv = leftBackWheelmv.mult(scalem(3.5, 3.5, 5.0));
    gl.uniformMatrix4fv(umv, false, leftBackWheelmv.flatten());
    wheel.draw();
    let driverHeadmv = carmv;
    driverHeadmv = driverHeadmv.mult(translate(0.00, 1.2, .3));
    driverHeadmv = driverHeadmv.mult(scalem(0.5, 0.5, 0.3));
    driverHeadmv = driverHeadmv.mult(rotateY(driverHeadRotation));
    gl.uniformMatrix4fv(umv, false, driverHeadmv.flatten());
    driverHead.draw();
    let driverLeftEyemv = driverHeadmv;
    driverLeftEyemv = driverLeftEyemv.mult(translate(0.5, .35, 0.6));
    driverLeftEyemv = driverLeftEyemv.mult(scalem(0.2, 0.2, 0.2));
    gl.uniformMatrix4fv(umv, false, driverLeftEyemv.flatten());
    driverEye.draw();
    let driverRightEyemv = driverHeadmv;
    driverRightEyemv = driverRightEyemv.mult(translate(-0.5, 0.35, 0.6));
    driverRightEyemv = driverRightEyemv.mult(scalem(0.2, 0.2, 0.2));
    gl.uniformMatrix4fv(umv, false, driverRightEyemv.flatten());
    driverEye.draw();
    let leftHeadlightmv = carmv;
    leftHeadlightmv = leftHeadlightmv.mult(translate(.3, .3, .83));
    gl.uniformMatrix4fv(umv, false, leftHeadlightmv.flatten());
    headlight.draw();
    let rightHeadlightmv = carmv;
    rightHeadlightmv = rightHeadlightmv.mult(translate(-.3, .3, .83));
    gl.uniformMatrix4fv(umv, false, rightHeadlightmv.flatten());
    headlight.draw();
    let blueSirenmv = carmv;
    blueSirenmv = blueSirenmv.mult(translate(0.1, 1, -0.2));
    blueSirenmv = blueSirenmv.mult(rotateY(blueSirenRotation));
    gl.uniformMatrix4fv(umv, false, blueSirenmv.flatten());
    headlight.draw();
    let redSirenmv = carmv;
    redSirenmv = redSirenmv.mult(translate(-0.1, 1, -0.2));
    redSirenmv = redSirenmv.mult(rotateY(redSirenRotation));
    gl.uniformMatrix4fv(umv, false, redSirenmv.flatten());
    headlight.draw();
    // ground objects -----------------------------------------------------
    let spheremv = camera.view;
    spheremv = spheremv.mult(translate(-7, 0.2, 7));
    spheremv = spheremv.mult(scalem(0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(umv, false, spheremv.flatten());
    sphere.draw();
    let spheremv2 = camera.view;
    spheremv2 = spheremv2.mult(translate(7, 0.2, -7));
    spheremv2 = spheremv2.mult(scalem(0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(umv, false, spheremv2.flatten());
    sphere.draw();
    let spheremv3 = camera.view;
    spheremv3 = spheremv3.mult(translate(7, 0.2, 7));
    spheremv3 = spheremv3.mult(scalem(0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(umv, false, spheremv3.flatten());
    sphere.draw();
    let spheremv4 = camera.view;
    spheremv4 = spheremv4.mult(translate(-7, 0.2, -7));
    spheremv4 = spheremv4.mult(scalem(0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(umv, false, spheremv4.flatten());
    sphere.draw();
    for (let i = 5; i < 20; i += 5) {
        let newspheremv = camera.view;
        if (i % 2 == 0) {
            newspheremv = newspheremv.mult(translate(i / 5, 0.2, -i / 5));
            newspheremv = newspheremv.mult(scalem(0.5, 0.5, 0.5));
            gl.uniformMatrix4fv(umv, false, newspheremv.flatten());
            sphere.draw();
        }
        else {
            newspheremv = newspheremv.mult(translate(-i / 5, 0.2, i / 5));
            newspheremv = newspheremv.mult(scalem(0.5, 0.5, 0.5));
            gl.uniformMatrix4fv(umv, false, newspheremv.flatten());
            sphere.draw();
            newspheremv = newspheremv.mult(translate(i / 4 + 2, 0.2, i / 4 + 2));
            gl.uniformMatrix4fv(umv, false, newspheremv.flatten());
            sphere.draw();
        }
    }
    // end ground objects ---------------------------------------------------------------------
    let light_positions = [];
    let light_colors = [];
    light_positions.push(camera.view.mult(new vec4(100, 100, 100, 1))); //overhead light
    light_positions.push(leftHeadlightmv.mult(new vec4(0, 0, 0, 1)));
    light_positions.push(rightHeadlightmv.mult(new vec4(0, 0, 0, 1)));
    light_positions.push(blueSirenmv.mult(new vec4(0, 0, 0, 1)));
    light_positions.push(redSirenmv.mult(new vec4(0, 0, 0, 1)));
    light_colors.push(new vec4(light, light, light, 1));
    light_colors.push(new vec4(headlight_color, headlight_color, headlight_color, 1));
    light_colors.push(new vec4(headlight_color, headlight_color, headlight_color, 1));
    light_colors.push(new vec4(0, 0, siren_blue, 1));
    light_colors.push(new vec4(siren_red, 0, 0, 1));
    gl.uniform4fv(light_position, flatten(light_positions));
    gl.uniform4fv(light_color, flatten(light_colors));
    let light_directions = [];
    light_directions.push(new vec4(0, -1, 0, 0));
    light_directions.push(leftHeadlightmv.mult(new vec4(0, 0, 90, 0)));
    light_directions.push(rightHeadlightmv.mult(new vec4(0, 0, 90, 0)));
    light_directions.push(blueSirenmv.mult(new vec4(blueSirenRotation, 0, 0, 0)));
    light_directions.push(redSirenmv.mult(new vec4(redSirenRotation, 0, 0, 0)));
    let cutoff_angles = [];
    cutoff_angles.push(Math.cos(toradians(180)));
    cutoff_angles.push(Math.cos(toradians(20)));
    cutoff_angles.push(Math.cos(toradians(20)));
    cutoff_angles.push(Math.cos(toradians(40)));
    cutoff_angles.push(Math.cos(toradians(40)));
    gl.uniform4fv(light_direction, flatten(light_directions));
    gl.uniform1fv(cutoff_angle, cutoff_angles);
    gl.uniform4fv(ambient_light, [.1, .1, .1, 1]);
}
//# sourceMappingURL=transformCarFunctions.js.map