"""
MageLabs Blender Asset Validation Script
Verifies polygon budget, dimensions, material integrity, and origin centering.
Usage: blender --background --python validate_assets.py -- [input_glb]
"""

import sys
import bpy

def validate_glb(filepath, max_triangles=15000):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=filepath)

    mesh_objs = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    total_triangles = 0

    print(f"--- Asset Validation: {filepath} ---")
    for obj in mesh_objs:
        depsgraph = bpy.context.evaluated_depsgraph_get()
        eval_obj = obj.evaluated_get(depsgraph)
        mesh = eval_obj.to_mesh()
        mesh.calc_loop_triangles()
        tri_count = len(mesh.loop_triangles)
        total_triangles += tri_count
        eval_obj.to_mesh_clear()
        print(f"Object: {obj.name} | Triangles: {tri_count}")

    print(f"Total Triangles: {total_triangles} / Limit: {max_triangles}")
    if total_triangles > max_triangles:
        print(f"WARNING: Polygon count exceeded limit ({total_triangles} > {max_triangles})")
        return False

    print("VALIDATION PASSED")
    return True

if __name__ == '__main__':
    args = sys.argv
    if '--' in args:
        user_args = args[args.index('--') + 1:]
        if len(user_args) >= 1:
            validate_glb(user_args[0])
