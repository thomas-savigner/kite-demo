"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---- Procedural Delta stunt kite (flat sail + spars + optional tail + lines) ----


export default function KiteModel({ lines = 2, span = 2.2, colors, tail = false, subtleBob = false }) {
    const group = useRef();
    // Simple idle motion for hero
    useFrame((state) => {
        if (!subtleBob || !group.current) return;
        const t = state.clock.getElapsedTime();
        group.current.rotation.z = Math.sin(t * 0.5) * 0.05;
        group.current.position.y = Math.sin(t * 0.8) * 0.05;
    });


    // Scale geometry to span
    const SCALE = span / 2.2; // base design ~2.2m


    const sailGeom = useMemo(() => {
        // Diamond-ish delta: nose, left tip, tail, right tip
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.6);
        shape.lineTo(-1.1, 0);
        shape.lineTo(0, -0.45);
        shape.lineTo(1.1, 0);
        shape.lineTo(0, 0.6);
        return new THREE.ShapeGeometry(shape, 1);
    }, []);


    const bars = useMemo(() => {
        // Carbon spars (spine + leading edge + cross)
        return [
            { from: [0, 0.62, 0], to: [0, -0.48, 0], radius: 0.01 }, // spine
            { from: [-1.1, 0, 0], to: [1.1, 0, 0], radius: 0.012 }, // spreader
            { from: [-1.1, 0, 0], to: [0, 0.6, 0], radius: 0.01 }, // left LE
            { from: [1.1, 0, 0], to: [0, 0.6, 0], radius: 0.01 }, // right LE
        ];
    }, []);


    const bridlePoints = useMemo(() => {
        // 2-line: single tow point bridled from two points near LE
        // 4-line: upper/lower on each wing (schematic)
        if (lines === 2) {
            return [
                { from: [-0.45, 0.25, 0.02], mid: [-0.2, 0.15, 0.1], to: [0, 0.15, 0.5] },
                { from: [0.45, 0.25, 0.02], mid: [0.2, 0.15, 0.1], to: [0, 0.15, 0.5] },
            ];
        }
        return [
            { from: [-0.55, 0.28, 0.02], mid: [-0.4, 0.18, 0.1], to: [-0.2, 0.2, 0.5] },
            { from: [-0.55, -0.05, 0.02], mid: [-0.4, -0.05, 0.1], to: [-0.2, -0.05, 0.5] },
            { from: [0.55, 0.28, 0.02], mid: [0.4, 0.18, 0.1], to: [0.2, 0.2, 0.5] },
            { from: [0.55, -0.05, 0.02], mid: [0.4, -0.05, 0.1], to: [0.2, -0.05, 0.5] },
        ];
    }, [lines]);


    return (
        <group ref={group} scale={SCALE}>
            {/* Sail */}
            <mesh geometry={sailGeom} position={[0, 0, 0]}>
                <meshStandardMaterial roughness={0.6} metalness={0.05} color={colors.primary} />
            </mesh>
            {/* Accent (upper triangle) */}
            <mesh position={[0, 0, 0.001]}>
                <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(0, 0.55); s.lineTo(-0.6, 0.05); s.lineTo(0.6, 0.05); s.lineTo(0, 0.55); return s; })()]} />
                <meshStandardMaterial roughness={0.55} color={colors.secondary} />
            </mesh>
            {/* Spars */}
            {bars.map((b, i) => (
                <Rod key={i} from={b.from} to={b.to} radius={b.radius} />
            ))}
            {/* Bridle & lines */}
            {bridlePoints.map((p, i) => (
                <Bridle key={i} from={p.from} mid={p.mid} to={p.to} />
            ))}
            {/* Tail */}
            {tail && <RibbonTail />}
        </group>
    );
}


function Rod({ from, to, radius = 0.01 }) {
    const geom = useMemo(() => new THREE.CylinderGeometry(radius, radius, 1, 12), [radius]);
    const [pos, quat, len] = useMemo(() => {
        const a = new THREE.Vector3(...from);
        const b = new THREE.Vector3(...to);
        const dir = new THREE.Vector3().subVectors(b, a);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(a, dir.multiplyScalar(0.5));
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, new THREE.Vector3().copy(b).sub(a).normalize());
        return [mid.toArray(), quat, len];
    }, [from, to]);
    return (
        <mesh geometry={geom} position={pos} quaternion={quat} scale={[1, len, 1]}>
            <meshStandardMaterial color="#111827" roughness={0.9} />
        </mesh>
    );
}


function Bridle({ from, mid, to }) {
    // Quadratic curve as thin tube -> use Line2 for simplicity
    const points = useMemo(() => {
        const a = new THREE.Vector3(...from);
        const m = new THREE.Vector3(...mid);
        const b = new THREE.Vector3(...to);
        const curve = new THREE.QuadraticBezierCurve3(a, m, b);
        return curve.getPoints(20);
    }, [from, mid, to]);
    return (
        <line>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial attach="material" linewidth={1} color="#cbd5e1" />
        </line>
    );
}


function RibbonTail() {
    // Simple sinus tail as a line; visually light and cheap
    const pts = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 80; i++) {
            const t = i / 20;
            arr.push(new THREE.Vector3(Math.sin(t) * 0.1, -0.45 - t * 0.15, -0.02));
        }
        return arr;
    }, []);
    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={pts.length}
                    array={new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="#e5e7eb" />
        </line>
    );
}