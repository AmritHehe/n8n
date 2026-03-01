"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return val;
  }

  float warpedFbm(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + t * 0.08),
      fbm(p + vec2(5.2, 1.3) + t * 0.06)
    );
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.04),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.05)
    );
    return fbm(p + 3.5 * r);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y) * 2.5;
    float t = u_time;

    // ── Smoke: domain-warped FBM ──
    float f = warpedFbm(p, t);
    f = smoothstep(0.2, 0.7, f);

    // Vignette
    vec2 vc = uv - 0.5;
    float vig = 1.0 - dot(vc, vc) * 1.0;
    vig = clamp(vig, 0.0, 1.0);

    // Bayer dither
    vec2 dc = floor(mod(gl_FragCoord.xy, 4.0));
    float bayer = (dc.x * 4.0 + dc.y) / 16.0;
    float val = f * vig;
    float dithered = smoothstep(bayer - 0.1, bayer + 0.1, val);

    // ── Electricity: bright veins that follow the smoke ──
    // Use sin() of the FBM to create sharp vein/crack patterns
    float rawF = warpedFbm(p, t); // unsmoothed version
    
    // Multiple vein layers at different scales
    float vein1 = 1.0 - abs(sin(rawF * 12.0 + t * 0.3));
    float vein2 = 1.0 - abs(sin(rawF * 8.0 - t * 0.2));
    float vein3 = 1.0 - abs(sin(rawF * 18.0 + t * 0.5));

    // Sharpen the veins — make them thin bright lines
    vein1 = pow(vein1, 12.0);
    vein2 = pow(vein2, 10.0);
    vein3 = pow(vein3, 16.0);

    // Combine — main veins + secondary + fine detail
    float elec = vein1 * 1.0 + vein2 * 0.5 + vein3 * 0.3;
    elec = clamp(elec, 0.0, 1.0);

    // Flickering
    float flicker = noise(p * 6.0 + t * 3.0);
    elec *= 0.6 + flicker * 0.4;

    // Stronger near smoke, fades at edges
    elec *= smoothstep(0.1, 0.4, f) * vig;

    // ── Composite ──
    vec3 blue = vec3(0.376, 0.647, 0.98);
    vec3 lightBlue = vec3(0.576, 0.773, 0.992);
    vec3 electricWhite = vec3(0.8, 0.9, 1.0);
    vec3 bg = vec3(0.012, 0.012, 0.012);

    // Dither layer
    vec3 ditherCol = mix(blue, lightBlue, f * 0.6);
    float ditherAlpha = dithered * 0.09;

    // Electricity — visible bright veins
    float elecAlpha = elec * 0.06;
    vec3 elecCol = mix(lightBlue, electricWhite, elec);

    // Final
    vec3 col = bg;
    col = mix(col, ditherCol, ditherAlpha);
    col = col + elecCol * elecAlpha;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderDither() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
        if (!gl) return;

        let animId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type);
            if (!s) return null;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error("Shader compile error:", gl.getShaderInfoLog(s));
                gl.deleteShader(s);
                return null;
            }
            return s;
        };

        const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1,
        ]), gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, "u_resolution");
        const uTime = gl.getUniformLocation(program, "u_time");

        const start = performance.now();

        const draw = () => {
            const t = (performance.now() - start) / 1000;
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, t);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.deleteBuffer(buf);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
