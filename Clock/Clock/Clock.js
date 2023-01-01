var VSHADER_SOURCE = `
   attribute vec4 a_Position; 
   uniform mat4 u_ModelMatrix; 
   void main() { 
     gl_Position = u_ModelMatrix * a_Position; 
  }`;

var FSHADER_SOURCE = `  
   void main() {
   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
   }`;



var SecsStep=-200;
var MinsStep=SecsStep/60.0;
var HoursStep=MinsStep/60.0;

var HoursAngle=0.0;
var MinsAngle=0.0;
var SecsAngle=0.0;

function main() {
    var canvas = document.getElementById('myCanvas');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var n = initVertexBuffers(gl);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var modelMatrix = new Matrix4();

    var tick = function () {
        animate();
        draw(gl, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick, canvas);
    };
    tick();
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.0, 
        0.0, 0.2, 
        0.0, 0.0, 
        0.0, 0.4,
        0.0, 0.0, 
        0.0, 0.6,
    ]);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
}

function draw(gl, modelMatrix, u_ModelMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    modelMatrix.setRotate(HoursAngle,0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINES, 0, 2);

    modelMatrix.setRotate(MinsAngle,0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINES, 2, 2);

    modelMatrix.setRotate(SecsAngle,0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINES, 4, 2);


}

var g_last = Date.now();
function animate() {
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;

    HoursAngle = HoursAngle + (HoursStep * elapsed) / 1000.0;
    MinsAngle = MinsAngle + (MinsStep * elapsed) / 1000.0;
    SecsAngle = SecsAngle + (SecsStep * elapsed) / 1000.0;
}