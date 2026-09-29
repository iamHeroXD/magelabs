# MageLabs 3D Asset & Rendering Pipeline

## 1. Design Principles

- **Authentic Scale & Pivot**: 1 unit in Three.js corresponds to 1 meter in real life.
- **Physical Materials (PBR)**: Roughness, metalness, and subtle ambient occlusion simulate phenolic bakelite, brushed aluminum, brass, and insulated PVC plastics.
- **High-Performance Budgets**: Individual instrument vertex counts remain under 12,000 triangles to guarantee 60 FPS performance on student laptops.
- **Dual Pipeline Strategy**:
  1. High-fidelity procedural geometry components for instant loading, zero external network latency, and dynamic properties (e.g. repainting resistor color bands).
  2. Automated Blender pipeline for external GLB ingestion, decimation, and scale normalization.

## 2. Blender Automation Scripts

Located in `blender/scripts/`:

- `process_asset.py`:
  - Run via: `blender --background --python blender/scripts/process_asset.py -- [input] [output]`
  - Clears orphan data, resets scale to meters, sets origin to base center, applies smooth shading, and enables Draco compression.
- `export_assets.py`:
  - Batch exports clean PBR GLB files.
- `validate_assets.py`:
  - Validates triangle budgets (<15k triangles) and material slots.

## 3. Node.js Asset Validator

Run via:
```bash
npm run validate-assets
```
Verifies static assets in `public/` and confirms pipeline readiness.
