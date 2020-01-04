import { lookAt, perspective, toradians, vec4 } from "./helperfunctions.js";
export class Camera {
    constructor(canvas) {
        this.lenszoom = 45.0;
        this.dollyz = 12;
        this.isCamera1 = true;
        this.isCamera2 = false;
        this.isCamera3 = false;
        this.isFreeCenter = true;
        this.isFreeFollow = false;
        this.canvas = canvas;
        this.setFreeCamera();
    }
    // Camera 1
    // --------------------------
    // Free-center --
    //      The first parameter of the lookAt function is where the camera is located. This has x set to 0 for center,
    //      The y is set to 6 so that it is above the scene, and the z coordinate is set to the attribute dollyz. dollyz gets changed
    //      in transformCarFunctions to dolly the camera in and out when "s" and "a" keys are pressed, changing the location of the camera.
    //
    //      The second parameter of the lookAt function is what object the camera is looking at. This is set to 0, 0, 0, which is
    //      the center of teh stage. Finally, the last parameter of lookAt is which direction is up, so it is set to y-direction up.
    //
    //      The perspective function first parameter is the fov. This parameter tells how much of the world is visible to the camera.
    //      This is set to lenszoom, which changes in transformCarFunctions when "q" and "w" keys are pressed.
    setFreeCamera() {
        this.view = lookAt(new vec4(0, 6, this.dollyz, 1), new vec4(0, 0, 0, 1), new vec4(0, 1, 0, 0));
        this.p = perspective(this.lenszoom, this.canvas.clientWidth / this.canvas.clientHeight, 1.0, 100.0);
    }
    // Camera 1
    // --------------------------
    // Free-follow --
    //      For the free-follow camera, the camera is still set at the same location.
    //      The second parameter is set to the xoffset and zoffset of the car. The point we want the camera looking at
    //      is always the location of the car.
    //
    //      The perspective fov parameter is still set to lenszoom
    setFreeCameraF(xoffset, zoffset) {
        this.view = lookAt(new vec4(0, 6, this.dollyz, 1), new vec4(xoffset, 0.2, zoffset, 1), new vec4(0, 1, 0, 0));
        this.p = perspective(this.lenszoom, this.canvas.clientWidth / this.canvas.clientHeight, 1.0, 100.0);
    }
    // Camera 2
    // --------------------------
    // Viewpoint --
    //      For the lookAt function, the first parameter (where the camera is located) is set to the car's location.
    //      We always want the camera to be located at the car itself, hence xoffset and zoffset. The second parameter of lookAt
    //      (what the camera is interested in) is set to the car's location plus the next forward direction of the car.
    //      This way the point the camera is looking at is slightly in front of the car.
    //
    //      The fov parameter of the perspective function is set to 20 so that the amount of world in the camera is smaller
    setViewpointCamera(xoffset, zoffset, frontRotation, driverHeadRotation) {
        this.view = lookAt(new vec4(xoffset, 0.2, zoffset, 1), new vec4(xoffset + (Math.sin(toradians(frontRotation + driverHeadRotation)) * .02), 0.2, zoffset + (Math.cos(toradians(frontRotation + driverHeadRotation)) * .02), 1), new vec4(0, 1, 0, 0));
        this.p = perspective(20, this.canvas.clientWidth / this.canvas.clientHeight, 1.0, 100.0);
    }
    // Camera 3
    // --------------------------
    // Chase --
    //      The lookAt function's first parameter is set to the car's offset minus the forward direction of the car scaled
    //      up by 20 (so that it is some distance behind the car).
    //      This makes the location of the camera always set to slightly behind the car and above since the y is set to 6.
    //      The second parameter of lookAt is then set to the offset, or location, of the car because the object the camera
    //      is looking at should be the car itself.
    setChaseCamera(xoffset, zoffset, frontRotation) {
        this.view = lookAt(new vec4(xoffset - (Math.sin(toradians(frontRotation)) * 20), 6, zoffset - (Math.cos(toradians(frontRotation)) * 20), 1), new vec4(xoffset, 0.3, zoffset, 1), new vec4(0, 1, 0, 0));
        this.p = perspective(20.0, this.canvas.clientWidth / this.canvas.clientHeight, 1.0, 100.0);
    }
}
//# sourceMappingURL=Camera.js.map