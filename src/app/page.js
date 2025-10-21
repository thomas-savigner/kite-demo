import Hero3D from "@/components/hero3D";
import KiteCard from "@/components/kiteCard";
import { KITES } from "@/data/models";

// ---- Main page component ----
// This is the main entry point for the application, rendering the hero section and kite cards.
// It showcases a 3D hero kite and a grid of kite models with interactive features.

export default function KiteShowcase() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 px-4 md:px-8 py-8">
      <Hero3D />


      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-white text-2xl md:text-3xl font-semibold">Modèles en démonstration</h2>
          <p className="text-sm text-neutral-400">{KITES.length} modèles (données factices)</p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {KITES.map((k) => (
            <KiteCard key={k.slug} kite={k} />
          ))}
        </div>
      </section>


      <section className="mt-14 space-y-3 text-sm text-neutral-400">
        <h3 className="text-neutral-300 font-semibold">Tech Stack & Astuces</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Next.js (App Router), TailwindCSS, @react-three/fiber, @react-three/drei.</li>
          <li>Geometry procédurale ici pour prototyper. En prod, exportez des .glb/.gltf compressés (Draco/Meshopt) depuis Blender.</li>
          <li>Activez <code>frameloop=&quot;demand&quot;</code> si vous avez beaucoup de viewers, et invalidez lors des interactions pour booster les perfs.</li>
          <li>Pré-réglez <code>dpr={[1, 1.5]}</code>, limitez les lights dynamiques, utilisez des <em>HDRI</em> via <code>&lt;Environment /&gt;</code>.</li>
        </ul>
      </section>
    </main>
  );
}