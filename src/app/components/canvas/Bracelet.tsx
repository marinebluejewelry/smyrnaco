"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Bracelet — 3D Three-Strand Braided Bracelet (scroll-driven assembly).
//
// Anatomy: 3 strands woven in a braid pattern around a ring.
//   Strand 0 (gold):     108 beads (36 sets × 3 wide) + 2 end caps = 110
//   Strand 1 (dark mix):  108 beads
//   Strand 2 (dark mix):  108 beads
//   Total:                326 beads, 2 draw calls (gold mesh + dark mesh).
//
// Braid math: Each strand follows a sinusoidal helical path with 120 degree
// phase offsets, creating genuine 3D over/under crossings.
//
// Three-phase strand-by-strand assembly:
//   Phase 1 (t 0.00→0.40): Gold strand threads into braid shape.
//   Phase 2 (t 0.25→0.70): First dark strand weaves through gold.
//   Phase 3 (t 0.50→1.00): Second dark strand completes the braid.
//
// Performance: 2 draw calls, ~326 matrix updates per frame.
// ---------------------------------------------------------------------------

// ── Bracelet anatomy constants ───────────────────────────────────────────────

const SETS_PER_STRAND = 84;     // vertical sets along each strand
const BEADS_PER_SET = 3;        // horizontal beads per set
const BEADS_PER_STRAND = SETS_PER_STRAND * BEADS_PER_SET; // 108

const GOLD_ENDCAP_COUNT = 0;
const TOTAL_GOLD = BEADS_PER_STRAND + GOLD_ENDCAP_COUNT;  // 110
const TOTAL_DARK = BEADS_PER_STRAND * 2;                   // 216
const TOTAL_BEADS = TOTAL_GOLD + TOTAL_DARK;               // 326

// ── Bead geometry ────────────────────────────────────────────────────────────

const BEAD_RADIUS = 0.038;
const BEAD_SPACING = 0.055;      // center-to-center for 3-wide column
const ENDCAP_RADIUS = 0.055;

// ── Braid path parameters ────────────────────────────────────────────────────

const BRAID_AMPLITUDE = 0.12;   // radial + vertical weave depth
const BRAID_FREQUENCY = 5;      // crossings per revolution

// ── Ring + scatter ───────────────────────────────────────────────────────────

const DEFAULT_RING_RADIUS = 0.9;
const DEFAULT_SCATTER_RADIUS = 2.5;

// ── Animation timing ─────────────────────────────────────────────────────────

const ASSEMBLY_THRESHOLD = 0.95;

// Phase 1: Gold strand (strand 0)
const P1_START = 0.0;
const P1_END = 0.40;
const P1_STAGGER = 0.25;

// Phase 2: Dark strand 1 (strand 1)
const P2_START = 0.25;
const P2_END = 0.70;
const P2_STAGGER = 0.25;

// Phase 3: Dark strand 2 (strand 2)
const P3_START = 0.50;
const P3_END = 1.0;
const P3_STAGGER = 0.25;

// ── Dark bead color palette ──────────────────────────────────────────────────

//const DARK_PALETTE = [
 // [0.165, 0.227, 0.290],  // deep navy     #2a3a4a
 // [0.290, 0.353, 0.227],  // olive-green    #4a5a3a
 // [0.227, 0.165, 0.290],  // dark purple    #3a2a4a
 // [0.176, 0.290, 0.290],  // dark teal      #2d4a4a
//];

// ── Utility functions ────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/** Compute per-bead eased progress within a phase window. */
function phasedLocalT(
  globalT: number,
  beadIndex: number,
  beadCount: number,
  phaseStart: number,
  phaseEnd: number,
  intraStagger: number,
): number {
  const phaseDuration = phaseEnd - phaseStart;
  const phaseT = Math.max(0, Math.min(1, (globalT - phaseStart) / phaseDuration));
  const beadOffset = (beadIndex / Math.max(beadCount - 1, 1)) * intraStagger;
  const localT = Math.max(0, Math.min(1, (phaseT - beadOffset) / (1 - intraStagger)));
  return easeOutBack(localT);
}

/** Generate scatter positions on a sphere with seeded randomness. */
function generateScatterPositions(
  count: number,
  scatterRadius: number,
  seedOffset: number,
): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * seededRandom(i * 3 + seedOffset) - 1);
    const theta = seededRandom(i * 3 + 1 + seedOffset) * Math.PI * 2;
    const r = scatterRadius * (0.3 + 0.7 * seededRandom(i * 3 + 2 + seedOffset));
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

/** Generate scatter scales (random 0.6→1.4) with seeded randomness. */
function generateScatterScales(count: number, seedOffset: number): Float32Array {
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    scales[i] = 0.6 + seededRandom(i * 7 + seedOffset) * 0.8;
  }
  return scales;
}

// ---------------------------------------------------------------------------
// braidBeadPosition — Parametric 3D braid path.
//
// Each strand follows a sinusoidal helical path around a ring of radius R.
// Three strands are phase-offset by 120 degrees (2*PI/3) so they weave
// over and under each other. The sin/cos pair for radial/vertical creates
// genuine 3D crossings.
// ---------------------------------------------------------------------------

function braidBeadPosition(
  ringRadius: number,
  strandIdx: number,   // 0, 1, or 2
  setIdx: number,      // 0..35
  widthIdx: number,    // 0, 1, 2 (across the 3-wide column)
): [number, number, number] {
  const baseAngle = (setIdx / SETS_PER_STRAND) * Math.PI * 2;
  const strandPhase = strandIdx * ((Math.PI * 2) / 3); // 120 degree offset

  // Braid weave — radial (in/out) + vertical (up/down)
  const radialOffset = BRAID_AMPLITUDE * Math.sin(BRAID_FREQUENCY * baseAngle + strandPhase);
  const verticalOffset = BRAID_AMPLITUDE * Math.cos(BRAID_FREQUENCY * baseAngle + strandPhase);

  // Radial direction at this angle on the ring
  const rx = Math.cos(baseAngle);
  const rz = Math.sin(baseAngle);

  // Width offset: 3 beads stacked perpendicular to ring plane (Y-axis)
  const widthY = (widthIdx - 1) * BEAD_SPACING;

  // Final position
  const x = ringRadius * rx + rx * radialOffset;
  const y = verticalOffset + widthY;
  const z = ringRadius * rz + rz * radialOffset;

  return [x, y, z];
}

// ── Responsive configs ───────────────────────────────────────────────────────

const DESKTOP = { position: [0, 0, 0] as [number, number, number], scale: 1.6 };
const MOBILE = { position: [0, 0.5, 0] as [number, number, number], scale: 1.8 };

// ── Props ────────────────────────────────────────────────────────────────────

interface BraceletProps {
  /** Radius of the final bracelet ring in world units (default 0.9) */
  ringRadius?: number;
  /** Scatter radius — how far beads spread in state A (default 2.5) */
  scatterRadius?: number;
  /** Mutable ref holding assembly progress 0→1, driven by parent */
  progressRef: React.MutableRefObject<number>;
  /** Fires when assembly crosses the completion threshold */
  onAssemblyComplete?: (complete: boolean) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export function Bracelet({
  ringRadius = DEFAULT_RING_RADIUS,
  scatterRadius = DEFAULT_SCATTER_RADIUS,
  progressRef,
  onAssemblyComplete,
}: BraceletProps) {
  const goldMeshRef = useRef<THREE.InstancedMesh>(null!);
  const darkMeshRef = useRef<THREE.InstancedMesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const dummy = useRef(new THREE.Object3D());
  const { viewport } = useThree();

  // ── Progress is driven by parent via progressRef prop ──────────────────
  const wasComplete = useRef(false);

  // ── Pre-compute gold braid positions (strand 0: 108 beads + 2 end caps) ──
  const goldRingPositions = useMemo(() => {
    const positions = new Float32Array(TOTAL_GOLD * 3);

    // Strand 0 beads: 36 sets × 3 wide = 108
    for (let s = 0; s < SETS_PER_STRAND; s++) {
      for (let w = 0; w < BEADS_PER_SET; w++) {
        const idx = s * BEADS_PER_SET + w;
        const [x, y, z] = braidBeadPosition(ringRadius, 0, s, w);
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;
      }
    }

    // End caps at 0 degrees and 180 degrees along the gold strand path
    const ecBase = BEADS_PER_STRAND;
    const [ex0, ey0, ez0] = braidBeadPosition(ringRadius, 0, 0, 1);
    positions[ecBase * 3] = ex0;
    positions[ecBase * 3 + 1] = ey0;
    positions[ecBase * 3 + 2] = ez0;

    const [ex1, ey1, ez1] = braidBeadPosition(ringRadius, 0, 18, 1);
    positions[(ecBase + 1) * 3] = ex1;
    positions[(ecBase + 1) * 3 + 1] = ey1;
    positions[(ecBase + 1) * 3 + 2] = ez1;

    return positions;
  }, [ringRadius]);

  // ── Pre-compute dark braid positions (strands 1 & 2: 108 + 108 = 216) ────
  const darkRingPositions = useMemo(() => {
    const positions = new Float32Array(TOTAL_DARK * 3);

    // Strand 1: indices 0..107
    for (let s = 0; s < SETS_PER_STRAND; s++) {
      for (let w = 0; w < BEADS_PER_SET; w++) {
        const idx = s * BEADS_PER_SET + w;
        const [x, y, z] = braidBeadPosition(ringRadius, 1, s, w);
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;
      }
    }

    // Strand 2: indices 108..215
    for (let s = 0; s < SETS_PER_STRAND; s++) {
      for (let w = 0; w < BEADS_PER_SET; w++) {
        const idx = BEADS_PER_STRAND + s * BEADS_PER_SET + w;
        const [x, y, z] = braidBeadPosition(ringRadius, 2, s, w);
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;
      }
    }

    return positions;
  }, [ringRadius]);

  // ── Scatter positions & scales ─────────────────────────────────────────────
  const goldScatterPositions = useMemo(
    () => generateScatterPositions(TOTAL_GOLD, scatterRadius, 0),
    [scatterRadius],
  );
  const goldScatterScales = useMemo(
    () => generateScatterScales(TOTAL_GOLD, 100),
    [],
  );

  const darkScatterPositions = useMemo(
    () => generateScatterPositions(TOTAL_DARK, scatterRadius, 300),
    [scatterRadius],
  );
  const darkScatterScales = useMemo(
    () => generateScatterScales(TOTAL_DARK, 600),
    [],
  );

  // ── Per-instance colors for dark mesh (4-color palette) ────────────────────
 // useEffect(() => {
 //   if (!darkMeshRef.current) return;

  //  const colors = new Float32Array(TOTAL_DARK * 3);
  //  for (let i = 0; i < TOTAL_DARK; i++) {
  //    const paletteIdx = Math.floor(seededRandom(i * 13 + 42) * DARK_PALETTE.length);
   //   colors[i * 3] = DARK_PALETTE[paletteIdx][0];
  //    colors[i * 3 + 1] = DARK_PALETTE[paletteIdx][1];
   //   colors[i * 3 + 2] = DARK_PALETTE[paletteIdx][2];
   // }

   // darkMeshRef.current.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
 // }, []);

  // ── Responsive position target ─────────────────────────────────────────────
  const currentPos = useRef<[number, number, number]>([...DESKTOP.position]);
  const currentScale = useRef(DESKTOP.scale);

  // ── Animation loop ─────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!goldMeshRef.current || !darkMeshRef.current || !groupRef.current) return;

    const t = progressRef.current;
    const obj = dummy.current;

    // ── Phase 1: Gold strand (strand 0) — 108 beads + 2 end caps ──────────
    // Stagger by set index (all 3 beads in a width-column arrive together)
    for (let i = 0; i < BEADS_PER_STRAND; i++) {
      const setIdx = Math.floor(i / BEADS_PER_SET);
      const easedT = phasedLocalT(t, setIdx, SETS_PER_STRAND, P1_START, P1_END, P1_STAGGER);
      const i3 = i * 3;

      const x = THREE.MathUtils.lerp(goldScatterPositions[i3], goldRingPositions[i3], easedT);
      const y = THREE.MathUtils.lerp(goldScatterPositions[i3 + 1], goldRingPositions[i3 + 1], easedT);
      const z = THREE.MathUtils.lerp(goldScatterPositions[i3 + 2], goldRingPositions[i3 + 2], easedT);
      const s = THREE.MathUtils.lerp(goldScatterScales[i] * BEAD_RADIUS, BEAD_RADIUS, easedT);

      obj.position.set(x, y, z);
      obj.scale.set(s, s, s);
      obj.rotation.set(easedT * Math.PI * 2 + i * 0.05, easedT * Math.PI + i * 0.02, 0);
      obj.updateMatrix();
      goldMeshRef.current.setMatrixAt(i, obj.matrix);
    }

    // End caps — arrive with the first/last set of the gold strand
    for (let e = 0; e < GOLD_ENDCAP_COUNT; e++) {
      const capSetIdx = e === 0 ? 0 : SETS_PER_STRAND - 1;
      const easedT = phasedLocalT(t, capSetIdx, SETS_PER_STRAND, P1_START, P1_END, P1_STAGGER);
      const idx = BEADS_PER_STRAND + e;
      const i3 = idx * 3;

      const x = THREE.MathUtils.lerp(goldScatterPositions[i3], goldRingPositions[i3], easedT);
      const y = THREE.MathUtils.lerp(goldScatterPositions[i3 + 1], goldRingPositions[i3 + 1], easedT);
      const z = THREE.MathUtils.lerp(goldScatterPositions[i3 + 2], goldRingPositions[i3 + 2], easedT);
      const s = THREE.MathUtils.lerp(goldScatterScales[idx] * ENDCAP_RADIUS, ENDCAP_RADIUS, easedT);

      obj.position.set(x, y, z);
      obj.scale.set(s, s, s);
      obj.rotation.set(easedT * Math.PI + e, easedT * Math.PI * 0.5, 0);
      obj.updateMatrix();
      goldMeshRef.current.setMatrixAt(idx, obj.matrix);
    }

    // ── Phase 2: Dark strand 1 (indices 0..107 in dark mesh) ──────────────
    for (let i = 0; i < BEADS_PER_STRAND; i++) {
      const setIdx = Math.floor(i / BEADS_PER_SET);
      const easedT = phasedLocalT(t, setIdx, SETS_PER_STRAND, P2_START, P2_END, P2_STAGGER);
      const i3 = i * 3;

      const x = THREE.MathUtils.lerp(darkScatterPositions[i3], darkRingPositions[i3], easedT);
      const y = THREE.MathUtils.lerp(darkScatterPositions[i3 + 1], darkRingPositions[i3 + 1], easedT);
      const z = THREE.MathUtils.lerp(darkScatterPositions[i3 + 2], darkRingPositions[i3 + 2], easedT);
      const s = THREE.MathUtils.lerp(darkScatterScales[i] * BEAD_RADIUS, BEAD_RADIUS, easedT);

      obj.position.set(x, y, z);
      obj.scale.set(s, s, s);
      obj.rotation.set(easedT * Math.PI * 2 + i * 0.05, easedT * Math.PI + i * 0.02, 0);
      obj.updateMatrix();
      darkMeshRef.current.setMatrixAt(i, obj.matrix);
    }

    // ── Phase 3: Dark strand 2 (indices 108..215 in dark mesh) ────────────
    for (let i = 0; i < BEADS_PER_STRAND; i++) {
      const meshIdx = BEADS_PER_STRAND + i;
      const setIdx = Math.floor(i / BEADS_PER_SET);
      const easedT = phasedLocalT(t, setIdx, SETS_PER_STRAND, P3_START, P3_END, P3_STAGGER);
      const i3 = meshIdx * 3;

      const x = THREE.MathUtils.lerp(darkScatterPositions[i3], darkRingPositions[i3], easedT);
      const y = THREE.MathUtils.lerp(darkScatterPositions[i3 + 1], darkRingPositions[i3 + 1], easedT);
      const z = THREE.MathUtils.lerp(darkScatterPositions[i3 + 2], darkRingPositions[i3 + 2], easedT);
      const s = THREE.MathUtils.lerp(darkScatterScales[meshIdx] * BEAD_RADIUS, BEAD_RADIUS, easedT);

      obj.position.set(x, y, z);
      obj.scale.set(s, s, s);
      obj.rotation.set(easedT * Math.PI * 2 + meshIdx * 0.05, easedT * Math.PI + meshIdx * 0.02, 0);
      obj.updateMatrix();
      darkMeshRef.current.setMatrixAt(meshIdx, obj.matrix);
    }

    // ── Mark instance matrices for GPU upload ──────────────────────────────
    goldMeshRef.current.instanceMatrix.needsUpdate = true;
    darkMeshRef.current.instanceMatrix.needsUpdate = true;

    // ── Responsive smooth transitions ──────────────────────────────────────
    const isMobile = viewport.width < 6;
    const target = isMobile ? MOBILE : DESKTOP;
    const lerpFactor = 1 - Math.pow(0.001, delta);

    currentPos.current[0] = THREE.MathUtils.lerp(currentPos.current[0], target.position[0], lerpFactor);
    currentPos.current[1] = THREE.MathUtils.lerp(currentPos.current[1], target.position[1], lerpFactor);
    currentPos.current[2] = THREE.MathUtils.lerp(currentPos.current[2], target.position[2], lerpFactor);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, target.scale, lerpFactor);

    groupRef.current.position.set(...currentPos.current);
    groupRef.current.scale.setScalar(currentScale.current);

    // ── Notify parent about assembly completion (debounced) ────────────────
    const complete = t >= ASSEMBLY_THRESHOLD;
    if (complete !== wasComplete.current) {
      wasComplete.current = complete;
      onAssemblyComplete?.(complete);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Tilt the ring so it is not perfectly edge-on to camera */}
      <group rotation={[Math.PI * 0.15, 0, Math.PI * 0.05]}>

        {/* ── Gold strand beads (110 instances: 108 strand + 2 end caps) ── */}
        <instancedMesh
          ref={goldMeshRef}
          args={[undefined, undefined, TOTAL_GOLD]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.02}
            envMapIntensity={1.5}
          />
        </instancedMesh>

        {/* ── Dark strand beads (216 instances: strand 1 + strand 2) ────── */}
        <instancedMesh
          ref={darkMeshRef}
          args={[undefined, undefined, TOTAL_DARK]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial
            color="#fff"
            metalness={0.58}
            roughness={0.18}
            envMapIntensity={0.6}
          />
        </instancedMesh>

      </group>
    </group>
  );
}

export default Bracelet;