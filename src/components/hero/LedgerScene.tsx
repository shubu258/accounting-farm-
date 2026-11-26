"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Line } from "@react-three/drei";
import * as THREE from "three";
import type { Line2 } from "three-stdlib";

/* ------------------------------------------------------------------ *
 *  "The Ledger Model"
 *  A machined desk-model of a firm's numbers: satin-metal columns on a
 *  ruled plinth form a 3D bar chart that rises left→right. A lime trend
 *  line runs across the front series. Two glass ledger sheets float
 *  above, fed by fine data threads from the figures below.
 * ------------------------------------------------------------------ */

const COLS = 14;
const ROWS = 6;
const GAP = 0.46;
const W = 0.2;
const SPAN_X = (COLS - 1) * GAP;
const SPAN_Z = (ROWS - 1) * GAP;

const BG = "#08201a";
const LIME = "#cfe98e";
const CLAY = "#c97a52";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Each row is a series, each column a period. Row 0 sits at the back (−z); the camera looks from +z,
 * so back series stand taller and the front series stays readable. Steady growth, quarterly rhythm.
 */
function baseHeight(c: number, r: number) {
  const x = c / (COLS - 1);
  const back = 1 - r / (ROWS - 1);
  const rise = 0.35 + 2.25 * Math.pow(x, 1.45) * (0.5 + 0.5 * back);
  const rhythm = 0.09 * Math.sin(c * 1.57 + r * 0.8);
  return Math.max(0.12, rise + rhythm);
}

/** The highlighted series, second from the front: brass columns, lime caps and the trend line. */
const TREND_ROW = ROWS - 2;
const TREND = Array.from({ length: COLS }, (_, c) => ({ c, r: TREND_ROW }));

// Glass ledger sheets hover over the back half of the chart.
const SHEET_Y = 3.25;
const SHEET_X = 0.55;
const SHEET_Z = -0.45;

const pos = (c: number, r: number) => [c * GAP - SPAN_X / 2, (r * GAP - SPAN_Z / 2)] as const;

type Pointer = { x: number; y: number };

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

function Ledger({ pointer, reduced }: { pointer: React.RefObject<Pointer>; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const columns = useRef<THREE.InstancedMesh>(null);
  const caps = useRef<THREE.InstancedMesh>(null);
  const trend = useRef<Line2>(null);
  const trendGhost = useRef<Line2>(null);
  const sheets = useRef<THREE.Group>(null);
  const pulses = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { size } = useThree();

  const cells = useMemo(() => {
    const out: { c: number; r: number; h: number; d: number; hi: boolean }[] = [];
    const hiSet = new Set(TREND.map((t) => `${t.c}:${t.r}`));
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        out.push({
          c,
          r,
          h: baseHeight(c, r),
          d: Math.hypot(c / (COLS - 1), (r / (ROWS - 1)) * 0.6),
          hi: hiSet.has(`${c}:${r}`),
        });
      }
    }
    return out;
  }, []);

  const colGeo = useMemo(() => {
    const g = new THREE.BoxGeometry(W, 1, W);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  // Per-instance tint: the highlighted series takes a sage-green metal.
  useEffect(() => {
    const m = columns.current!;
    const base = new THREE.Color("#eef2ec");
    const brass = new THREE.Color("#bfdc95");
    cells.forEach((cell, i) => m.setColorAt(i, cell.hi ? brass : base));
    m.instanceColor!.needsUpdate = true;
  }, [cells]);

  const trendPoints = useMemo(
    () =>
      TREND.map(({ c, r }) => {
        const [x, z] = pos(c, r);
        return new THREE.Vector3(x, baseHeight(c, r) + 0.16, z);
      }),
    [],
  );
  const trendCurve = useMemo(() => new THREE.CatmullRomCurve3(trendPoints, false, "centripetal"), [trendPoints]);
  const trendSmooth = useMemo(() => trendCurve.getPoints(160), [trendCurve]);

  // Data threads: from trend figures, converging up into the lower ledger sheet.
  const threads = useMemo(
    () =>
      [3, 7, 11].map((k) => {
        const p = trendPoints[k];
        const end = new THREE.Vector3(SHEET_X + (p.x - SHEET_X) * 0.4, SHEET_Y - 0.02, SHEET_Z + 0.45);
        return [p.clone(), end];
      }),
    [trendPoints],
  );

  // Fine base-plate grid between column rows.
  const grid = useMemo(() => {
    const pts: number[] = [];
    const ex = SPAN_X / 2 + GAP * 0.9;
    const ez = SPAN_Z / 2 + GAP * 0.9;
    for (let c = 0; c <= COLS; c++) {
      const x = c * GAP - SPAN_X / 2 - GAP / 2;
      pts.push(x, 0.001, -ez, x, 0.001, ez);
    }
    for (let r = 0; r <= ROWS; r++) {
      const z = r * GAP - SPAN_Z / 2 - GAP / 2;
      pts.push(-ex, 0.001, z, ex, 0.001, z);
    }
    // measurement ticks along the front edge
    for (let c = 0; c < COLS * 2; c++) {
      const x = (c / 2) * GAP - SPAN_X / 2;
      const len = c % 2 === 0 ? 0.14 : 0.07;
      pts.push(x, 0.001, ez + 0.08, x, 0.001, ez + 0.08 + len);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  // Ruled lines engraved on each glass sheet, plus a clay margin rule.
  const sheetW = 2.7;
  const sheetD = 1.75;
  const rules = useMemo(() => {
    const pts: number[] = [];
    for (let i = 1; i < 9; i++) {
      const z = -sheetD / 2 + (i * sheetD) / 9;
      pts.push(-sheetW / 2 + 0.18, 0, z, sheetW / 2 - 0.18, 0, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  const margin = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const x = -sheetW / 2 + 0.55;
    g.setAttribute("position", new THREE.Float32BufferAttribute([x, 0, -sheetD / 2 + 0.12, x, 0, sheetD / 2 - 0.12], 3));
    return g;
  }, []);

  const start = useRef<number | null>(null);

  useFrame((state, dt) => {
    const now = state.clock.elapsedTime;
    if (start.current === null) start.current = now;
    const t = reduced ? 99 : now - start.current;

    // Columns grow in as a wave from the front-left corner, then breathe.
    const m = columns.current!;
    const capM = caps.current!;
    let capIndex = 0;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const g = easeOut(clamp01((t - 0.25 - cell.d * 1.1) / 1.5));
      const breathe = reduced ? 0 : 0.05 * Math.sin(now * 0.7 + cell.c * 0.45 + cell.r * 0.3);
      const h = Math.max(0.0001, (cell.h + breathe) * g);
      const [x, z] = pos(cell.c, cell.r);
      dummy.position.set(x, 0, z);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      if (cell.hi) {
        dummy.position.set(x, h + 0.012, z);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        capM.setMatrixAt(capIndex++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
    capM.instanceMatrix.needsUpdate = true;

    // Trend line draws on after the chart settles, then flows.
    const draw = clamp01((t - 1.6) / 1.6);
    if (trend.current) {
      const mat = trend.current.material;
      mat.opacity = draw;
      mat.dashOffset -= reduced ? 0 : dt * 0.25;
    }
    if (trendGhost.current) trendGhost.current.material.opacity = 0.35 * draw;

    // Sheets descend into place and hover.
    if (sheets.current) {
      const s = easeOut(clamp01((t - 1.0) / 2.0));
      sheets.current.position.y = SHEET_Y + (1 - s) * 1.2 + (reduced ? 0 : Math.sin(now * 0.6) * 0.05);
      sheets.current.rotation.y = -0.12 + (reduced ? 0 : Math.sin(now * 0.35) * 0.025);
      sheets.current.children.forEach((child) => {
        child.traverse((o) => {
          const mat = (o as THREE.Mesh).material as THREE.Material | undefined;
          if (mat && "opacity" in mat && mat.userData.baseOpacity !== undefined) {
            mat.opacity = mat.userData.baseOpacity * s;
          }
        });
      });
    }

    // Pulses climb the data threads.
    if (pulses.current) {
      pulses.current.children.forEach((p, k) => {
        const [a, b] = threads[k];
        const f = reduced ? 0.5 : (now * 0.32 + k * 0.33) % 1;
        p.position.lerpVectors(a, b, f);
        p.position.y += 0;
        (p as THREE.Mesh).scale.setScalar(draw * (0.6 + 0.4 * Math.sin(f * Math.PI)));
      });
    }

    // Pointer parallax.
    if (group.current) {
      const px = reduced ? 0 : pointer.current.x;
      const py = reduced ? 0 : pointer.current.y;
      const k = 1 - Math.pow(0.0015, dt);
      const sway = reduced ? 0 : Math.sin(now * 0.12) * 0.06;
      group.current.rotation.y += (-0.42 + sway + px * 0.16 - group.current.rotation.y) * k;
      group.current.rotation.x += (py * 0.05 - group.current.rotation.x) * k;
    }
  });

  // Composition: on wide screens the model sits right of the headline.
  const aspect = size.width / Math.max(1, size.height);
  const wide = aspect > 1.15;
  const offsetX = wide ? Math.min(3.2, 1.3 + (aspect - 1.15) * 2.1) : 0;
  const scale = wide ? 0.66 : Math.max(0.42, aspect * 0.62);
  const offsetY = wide ? 0.45 : -0.35;

  const hiCount = cells.filter((c) => c.hi).length;

  return (
    <group position={[offsetX, offsetY, 0]} scale={scale}>
      <group ref={group} rotation={[0, -0.42, 0]}>
        {/* Base plate */}
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <boxGeometry args={[SPAN_X + GAP * 2.6, 0.12, SPAN_Z + GAP * 2.6]} />
          <meshStandardMaterial color="#0f3127" roughness={0.75} metalness={0.15} />
        </mesh>
        <lineSegments geometry={grid}>
          <lineBasicMaterial color="#e9efe4" transparent opacity={0.11} />
        </lineSegments>

        {/* Columns */}
        <instancedMesh ref={columns} args={[colGeo, undefined, cells.length]} castShadow receiveShadow>
          <meshStandardMaterial metalness={0.78} roughness={0.3} envMapIntensity={1.7} />
        </instancedMesh>

        {/* Lime caps on trend columns */}
        <instancedMesh ref={caps} args={[undefined, undefined, hiCount]}>
          <boxGeometry args={[W * 1.02, 0.02, W * 1.02]} />
          <meshBasicMaterial color={LIME} toneMapped={false} />
        </instancedMesh>

        {/* Trend line */}
        <Line
          ref={trendGhost}
          points={trendSmooth}
          color={LIME}
          lineWidth={0.6}
          transparent
          opacity={0}
          position={[0, -0.12, 0]}
        />
        <Line
          ref={trend}
          points={trendSmooth}
          color={LIME}
          lineWidth={1.8}
          dashed
          dashSize={0.9}
          gapSize={0.12}
          transparent
          opacity={0}
          toneMapped={false}
        />

        {/* Data threads */}
        {threads.map((pts, i) => (
          <Line key={i} points={pts} color="#e9efe4" lineWidth={0.6} transparent opacity={0.35} />
        ))}
        <group ref={pulses}>
          {threads.map((_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color={LIME} toneMapped={false} />
            </mesh>
          ))}
        </group>

        {/* Glass ledger sheets */}
        <group ref={sheets} position={[SHEET_X, SHEET_Y, SHEET_Z]}>
          {[0, 1].map((k) => (
            <group key={k} position={[k * 0.38, k * 0.42, -k * 0.3]} rotation={[0, k * 0.08, 0]}>
              <mesh castShadow>
                <boxGeometry args={[sheetW, 0.035, sheetD]} />
                <meshPhysicalMaterial
                  color="#dfeee2"
                  transmission={1}
                  thickness={0.35}
                  roughness={0.14}
                  ior={1.45}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  transparent
                  opacity={0}
                  userData={{ baseOpacity: 1 }}
                />
              </mesh>
              <lineSegments geometry={rules} position={[0, 0.02, 0]}>
                <lineBasicMaterial color="#f4f7ef" transparent opacity={0} userData={{ baseOpacity: 0.42 }} />
              </lineSegments>
              <lineSegments geometry={margin} position={[0, 0.021, 0]}>
                <lineBasicMaterial color={CLAY} transparent opacity={0} userData={{ baseOpacity: 0.9 }} />
              </lineSegments>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

function Rig({ pointer, reduced }: { pointer: React.RefObject<Pointer>; reduced: boolean }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.9, 0), []);
  const home = useMemo(() => new THREE.Vector3(6.4, 6.0, 10.2), []);
  useFrame(({ camera }, dt) => {
    const k = 1 - Math.pow(0.002, dt);
    const px = reduced ? 0 : pointer.current.x;
    const py = reduced ? 0 : pointer.current.y;
    camera.position.x += (home.x + px * 0.5 - camera.position.x) * k;
    camera.position.y += (home.y + py * 0.35 - camera.position.y) * k;
    camera.position.z += (home.z - camera.position.z) * k;
    camera.lookAt(target);
  });
  return null;
}

export default function LedgerScene({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Stop rendering when the hero is off screen.
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);

    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        shadows="percentage"
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [6.4, 6.0, 10.2], fov: 30, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          onReady?.();
        }}
      >
        <fog attach="fog" args={[BG, 17, 34]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[4.5, 9, 3.5]}
          intensity={2.6}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-6, 3, -5]} intensity={0.7} color={LIME} />

        {/* Studio lighting baked into an env map — no network HDRs. */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#fff1dc" position={[-6, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 1.2, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#d9f0b8" position={[6, 1.5, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 0.8, 1]} />
          <Lightformer form="ring" intensity={0.8} position={[0, 2, 8]} scale={3} />
        </Environment>

        <Ledger pointer={pointer} reduced={reduced} />
        <Rig pointer={pointer} reduced={reduced} />
      </Canvas>
    </div>
  );
}
