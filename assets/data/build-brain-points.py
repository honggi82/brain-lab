"""Build assets/data/brain-points.bin for the projects-page particle brain.

Samples points on the real anatomical surfaces of about_brain/models/brain.glb
(Brain Project / Z-Anatomy / BodyParts3D, CC BY-SA 4.0 — see
about_brain/ATTRIBUTION.md). Only cortex, cerebellum and brainstem meshes are
used; vertex coordinates are not modified, only sampled.

    pip install DracoPy numpy
    python assets/data/build-brain-points.py

Output layout (little-endian):
    0   4s   magic b"BRP1"
    4   u32  point count N
    8   f32  position scale (int16 / 32767 * scale = model units, centred)
    12  u32  reserved (0)
    16  i16  xyz[N*3]     position, x = right, y = up, z = anterior
    ..  i8   nxyz[N*3]    outward surface normal * 127
    ..  u8   region[N]    0 frontal 1 parietal 2 temporal 3 occipital 4 limbic
                          5 insula 6 other cortex 7 cerebellum 8 brainstem
    ..  u8   flags[N]     bit0 = sulcus / fissure surface (folds, drawn dimmer)
"""
import json
import os
import struct

import DracoPy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
GLB = os.path.join(SITE, "about_brain", "models", "brain.glb")
OUT = os.path.join(HERE, "brain-points.bin")
N_POINTS = 52000
SEED = 20260924

REGION = {"Frontal lobe": 0, "Parietal lobe": 1, "Temporal lobe": 2, "Occipital lobe": 3,
          "Limbic lobe": 4, "Insula": 5}


def read_glb(path):
    data = open(path, "rb").read()
    jlen = struct.unpack_from("<I", data, 12)[0]
    gltf = json.loads(data[20:20 + jlen])
    boff = 20 + jlen
    blen = struct.unpack_from("<I", data, boff)[0]
    return gltf, data[boff + 8:boff + 8 + blen]


def region_of(extras):
    cat = extras.get("bx_cat")
    if cat == "cerebellum":
        return 7
    if cat == "brainstem":
        return 8
    return REGION.get(extras.get("bx_region"), 6)


def main():
    gltf, blob = read_glb(GLB)
    tris, regions, flags = [], [], []
    for node in gltf["nodes"]:
        ex = node.get("extras", {})
        if ex.get("bx_cat") not in ("cortex", "cerebellum", "brainstem") or "mesh" not in node:
            continue
        name = node.get("name", "").lower()
        sulcus = ("sulc" in name or "fis" in name) and "gyr" not in name
        for prim in gltf["meshes"][node["mesh"]]["primitives"]:
            bv = gltf["bufferViews"][prim["extensions"]["KHR_draco_mesh_compression"]["bufferView"]]
            off = bv.get("byteOffset", 0)
            mesh = DracoPy.decode(blob[off:off + bv["byteLength"]])
            v = np.asarray(mesh.points, dtype=np.float64).reshape(-1, 3)
            f = np.asarray(mesh.faces, dtype=np.int64).reshape(-1, 3)
            tris.append(v[f])
            regions.append(np.full(len(f), region_of(ex), np.uint8))
            flags.append(np.full(len(f), 1 if sulcus else 0, np.uint8))
    tri = np.concatenate(tris)
    reg = np.concatenate(regions)
    flg = np.concatenate(flags)

    # outward orientation of face normals: point away from the owning structure's
    # side of the brain centre (meshes are closed shells, winding is not uniform)
    e1, e2 = tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0]
    cr = np.cross(e1, e2)
    area = 0.5 * np.linalg.norm(cr, axis=1)
    ok = area > 1e-9
    tri, reg, flg, cr, area = tri[ok], reg[ok], flg[ok], cr[ok], area[ok]
    nrm = cr / np.linalg.norm(cr, axis=1, keepdims=True)
    cent = tri.mean(axis=1)

    rng = np.random.default_rng(SEED)
    pick = rng.choice(len(tri), size=N_POINTS, p=area / area.sum())
    r1, r2 = rng.random(N_POINTS), rng.random(N_POINTS)
    s = np.sqrt(r1)
    a, b, c = 1 - s, s * (1 - r2), s * r2
    t = tri[pick]
    pos = t[:, 0] * a[:, None] + t[:, 1] * b[:, None] + t[:, 2] * c[:, None]
    n = nrm[pick]

    lo, hi = pos.min(0), pos.max(0)
    centre = (lo + hi) / 2
    pos -= centre
    out_dir = cent[pick] - centre
    n *= np.sign((n * out_dir).sum(1, keepdims=True) + 1e-12)

    # glTF is y-up; determine which horizontal axis is anterior-posterior (the
    # longest) and map it to z, left-right to x.
    ext = hi - lo
    horiz = [0, 2]
    ap = max(horiz, key=lambda i: ext[i])
    lr = min(horiz, key=lambda i: ext[i])
    pos = pos[:, [lr, 1, ap]]
    n = n[:, [lr, 1, ap]]
    # frontal lobe must sit at +z
    front = reg[pick] == 0
    if pos[front, 2].mean() < 0:
        pos[:, 2] *= -1
        n[:, 2] *= -1
        pos[:, 0] *= -1
        n[:, 0] *= -1

    scale = float(np.abs(pos).max())
    q = np.round(pos / scale * 32767).astype("<i2")
    qn = np.round(n * 127).astype("i1")
    with open(OUT, "wb") as fh:
        fh.write(struct.pack("<4sIfI", b"BRP1", N_POINTS, scale, 0))
        fh.write(q.tobytes())
        fh.write(qn.tobytes())
        fh.write(reg[pick].astype(np.uint8).tobytes())
        fh.write(flg[pick].astype(np.uint8).tobytes())
    counts = np.bincount(reg[pick], minlength=9)
    print("wrote", OUT, os.path.getsize(OUT), "bytes; extent", np.round(ext, 1),
          "axes lr/up/ap =", lr, 1, ap, "; points per region", counts.tolist())


if __name__ == "__main__":
    main()
