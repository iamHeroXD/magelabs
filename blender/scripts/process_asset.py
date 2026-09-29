"""
MageLabs Blender Asset Processing Pipeline
Automates mesh cleanup, scale normalization, pivot centering, and PBR material setup.
Run via: blender --background --python process_asset.py -- [input_model] [output_model]
"""

import sys
import bpy
import os

def clean_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def process_model(input_path, output_path):
    print(f"[MageLabs 3D Pipeline] Processing: {input_path}")
    clean_scene()

    ext = os.path.splitext(input_path)[1].lower()
    if ext in ['.glb', '.gltf']:
        bpy.ops.import_scene.gltf(filepath=input_path)
    elif ext == '.obj':
        bpy.ops.wm.obj_import(filepath=input_path)
    elif ext == '.fbx':
        bpy.ops.import_scene.fbx(filepath=input_path)
    else:
        print(f"Unsupported extension: {ext}")
        return False

    # Select all mesh objects
    mesh_objs = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    if not mesh_objs:
        print("No mesh objects found in file.")
        return False

    for obj in mesh_objs:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)

        # 1. Apply all transforms (location, rotation, scale)
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

        # 2. Origin adjustment: move origin to bottom center of bounding box
        bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
        bbox = [obj.matrix_world @ mathutils.Vector(corner) for corner in obj.bound_box]
        min_z = min(v.z for v in bbox)
        obj.location.z -= min_z
        bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)

        # 3. Apply smooth shading
        bpy.ops.object.shade_smooth()

        # 4. Remove loose geometry
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.delete_loose()
        bpy.ops.mesh.remove_doubles(threshold=0.0001)
        bpy.ops.object.mode_set(mode='OBJECT')

    # Export normalized GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_draco_mesh_compression_enable=True
    )
    print(f"[MageLabs 3D Pipeline] Saved normalized asset: {output_path}")
    return True

if __name__ == '__main__':
    args = sys.argv
    if '--' in args:
        user_args = args[args.index('--') + 1:]
        if len(user_args) >= 2:
            import mathutils
            process_model(user_args[0], user_args[1])
        else:
            print("Usage: blender --background --python process_asset.py -- <input_file> <output_file>")
    else:
        print("Expected '--' separator before arguments.")
