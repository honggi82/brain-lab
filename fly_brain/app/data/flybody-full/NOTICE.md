# Flybody-derived body model

Source: https://github.com/TuragaLab/flybody
Creators: Google DeepMind and HHMI Janelia. License: Apache License 2.0; see LICENSE.

The original MuJoCo model and OBJ geometry were converted by FlyConnectomeSim's build_flybody.py to model.json/model.bin: 67 bodies, 102 joints, 85 mesh parts and 272,550 triangles. This is a derived format. The published model identifies decimation as false and retains the original joint axes and ranges.

BRAIN Lab's September 2026 renderer maps bilateral neck and abdomen activity to the central joints using a declared visualisation convention. Geometry and precomputed neural results are unchanged. It does not run MuJoCo physics or reproduce measured movement.

The original model.json does not record the upstream commit that produced the geometry. The bundled manifest records file hashes, not a newly inferred source revision.
