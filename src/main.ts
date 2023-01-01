const main = () => {
  const canvas = document.querySelector("#canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("<canvas> element does not found.");
  }

  const gl = canvas.getContext("webgl");

  if (!gl) {
    throw new Error("Failed initializing WebGL.");
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 1);
  // 初期化前に初期値をセット
  // プリセット値の指定

  gl.clear(gl.COLOR_BUFFER_BIT);
  // カラーバッファの初期化
  // COLOR_BUFFER_BITは、さっきセットした色で初期化するというもの

  const initShader = (
    type: "VERTEX_SHADER" | "FRAGMENT_SHADER",
    source: string
  ) => {
    const shader = gl.createShader(gl[type]);

    if (!shader) {
      throw new Error("Failed to create shader.");
    }

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        `Shader compile failed at: ${gl.getShaderInfoLog(shader)}`
      );
    }

    return shader;
  };

  const vertexShader = initShader(
    "VERTEX_SHADER",
    `
    attribute vec4 a_position;
    attribute vec3 a_color;
    varying vec4 vColor;

    void main() {
      gl_Position = a_position;
      vColor = vec4(a_color, 1.0);
    }
  `
  ); // 頂点シェーダーを作る

  const triangleShader = initShader(
    "FRAGMENT_SHADER",
    `
    precision mediump float;

    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `
  ); // フラグメントシェーダーを作る

  const program = gl.createProgram(); // WebGLプログラムの作成

  if (!program) {
    throw new Error("Failed to create program.");
  }

  gl.attachShader(program, vertexShader); // シェーダーをプログラムへ接続
  gl.attachShader(program, triangleShader); // too

  gl.linkProgram(program); // シェーダーをリンク

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Shader link failed at: ${gl.getProgramInfoLog(program)}`);
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    throw new Error(`Validating failed at: ${gl.getProgramInfoLog(program)}`);
  }

  gl.useProgram(program); // プログラムの起動(使用するプログラムをWebGLへ手伝う)

  // -------------- //

  const positions = [
    -0.15, 0.5, 0.416, -0.5, -0.716, -0.5, 0.1, 0.3, 0.666, -0.5, -0.316, -0.5,
  ];
  // 各頂点の座標を記述している
  // 単なる一次元配列のため、どこからどこまでが1つの頂点なのかを教えなければならない

  const colors = [
    0.123, 0.88, 0.224, 0.123, 0.88, 0.224, 0.123, 0.88, 0.224, 0.632, 0.89,
    0.666, 0.632, 0.89, 0.666, 0.632, 0.89, 0.666,
  ];

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const pindex = gl.getAttribLocation(program, "a_position"); // WebGLプログラムでの頂点属性の場所を指定
  const psize = 2; // 頂点毎の要素数 XY座標だけなので2
  const type = gl.FLOAT; // 浮動小数点数なのでgl.FLOAT
  const normalized = false; // 厳密な範囲へ正規化するかどうか
  const stride = 0; // 頂点始端同士のオフセット数と先頭からのオフセット数。
  const offset = 0;

  gl.enableVertexAttribArray(pindex);
  gl.vertexAttribPointer(pindex, psize, type, normalized, stride, offset);

  const colorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const cindex = gl.getAttribLocation(program, "a_color");
  const csize = 3; //  頂点属性の有効化
  gl.enableVertexAttribArray(cindex);
  gl.vertexAttribPointer(cindex, csize, type, normalized, stride, offset);

  gl.drawArrays(gl.TRIANGLES, 0, 3); // (図形, 何個めの頂点から始めるか, 頂点の数)
  gl.drawArrays(gl.TRIANGLES, 3, 3);
};

window.onload = main;
