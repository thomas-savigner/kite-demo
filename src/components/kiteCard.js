"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import KiteModel from "./kiteModel";

// ---- Card viewer ----
export default function KiteCard({ kite }) {
    const [variant, setVariant] = useState({ colors: kite.colors, tail: kite.tail });
    return (
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
                <div>
                    <h3 className="text-white font-semibold">{kite.name}</h3>
                    <p className="text-xs text-neutral-400">{kite.brand} • {kite.lines} lignes • {kite.span} m</p>
                </div>
                <div className="text-white font-bold">{kite.price} €</div>
            </div>
            <div className="relative h-56 rounded-xl overflow-hidden bg-black">
                <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.2, 2.2], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[2, 2, 2]} intensity={0.8} />
                    <KiteModel lines={kite.lines} span={kite.span} colors={variant.colors} tail={variant.tail} />
                    <Environment preset="studio" />
                    <ContactShadows position={[0, -0.55, 0]} opacity={0.5} blur={2.8} scale={3} far={2} />
                    <OrbitControls enablePan={false} minDistance={1.3} maxDistance={3} />
                </Canvas>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setVariant(v => ({ ...v, colors: { primary: kite.colors.primary, secondary: kite.colors.secondary } }))}
                    className="px-2 py-1 text-xs rounded-md bg-neutral-800 text-white border border-neutral-700"
                >Couleurs d’origine</button>
                <button
                    onClick={() => setVariant(v => ({ ...v, colors: { primary: "#0071d8", secondary: "#ffffff" } }))}
                    className="px-2 py-1 text-xs rounded-md bg-neutral-800 text-white border border-neutral-700"
                >Bleu/Blanc</button>
                <button
                    onClick={() => setVariant(v => ({ ...v, colors: { primary: "#111827", secondary: "#00f2fc" } }))}
                    className="px-2 py-1 text-xs rounded-md bg-neutral-800 text-white border border-neutral-700"
                >Noir/Cyan</button>
                <label className="ml-auto flex items-center gap-2 text-xs text-neutral-300">
                    <input type="checkbox" checked={variant.tail} onChange={(e) => setVariant(v => ({ ...v, tail: e.target.checked }))} />
                    Queue
                </label>
            </div>
        </div>
    );
}