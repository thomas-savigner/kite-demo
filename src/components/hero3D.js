"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import KiteModel from "./kiteModel";

// ---- Hero with animated kite ----


export default function Hero3D() {
    const heroColors = { primary: "#0071d8", secondary: "#00c8fc" };
    return (
        <div className="relative w-full h-[60vh] md:h-[70vh] bg-black rounded-3xl overflow-hidden border border-neutral-800">
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 2.2], fov: 40 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 2, 2]} intensity={0.9} />
                <KiteModel lines={2} span={2.3} colors={heroColors} tail subtleBob />
                <Environment preset="city" />
                <ContactShadows position={[0, -0.55, 0]} opacity={0.45} blur={3} scale={4} far={2} />
                <OrbitControls enablePan={false} minDistance={1.5} maxDistance={3} />
            </Canvas>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight">Catalogue 3D — Cerfs-volants pilotables</h1>
                <p className="mt-4 max-w-2xl text-neutral-300">Démonstrateur Next.js + Three.js. Faites tourner chaque modèle, comparez les variantes, imaginez votre micro‑catalogue 3D.</p>
            </div>
        </div>
    );
}