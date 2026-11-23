# V16 Lethe: Evaporation · assets (round 10)

**Round 10:** the page now loads `models/glb/*.glb` (the same nine Poly Haven CC0 props, simplified and meshopt-compressed with textures embedded, and the same three Microsoft Rocketbox MIT avatars converted from FBX), `models/rocketbox/clips.bin` (the same six Rocketbox clips, 16-bit), `models/hdri/cobblestone_street_night_256.hdr` (the same Poly Haven CC0 HDRI, resized) and two poster stills in `media/` rendered from the page itself. Sources and licences are unchanged and listed below. The per-model folders, FBX files and JSON clips below are only used by `index.r9.html`.

Everything under `models/` was downloaded on 23 Nov 2026. Nothing was purchased. `models/` is 13 MB (24 MB in round 8).
Earlier pages are kept as `index.r6.html`, `index.r7.html`, `index.r8.html` (and `r4.r6.js`, `r4.r7.js`, `r4.r8.js`).

**`index.r8.html` no longer runs from this folder.** Round 9 converted the textures to WebP and replaced the animation files, so
the round 8 originals (JPEG/PNG textures, the three animation FBX files, the original `.gltf` files) were moved, not deleted,
to `versions/round6/V16-r8-assets/models/` (17 MB). Copy them back over `models/` to run the round 8 page.

## 3D models
| File | Use on the page | Source | Licence |
|---|---|---|---|
| models/rocketbox/Business_Male_01.fbx | The three team members and the worker on the dock: a rigged, skinned adult in a dark suit (22k vertices, 80 bones). A plain face plate is added in code | Microsoft Rocketbox avatar library, https://github.com/microsoft/Microsoft-Rocketbox (Assets/Avatars/Professions/Business_Male_01) | **MIT**, © 2020 Microsoft. Licence text in `models/rocketbox/LICENSE-Rocketbox.md` |
| models/rocketbox/Male_Adult_08.fbx | The client: in the room, on the street, in the drive | Microsoft Rocketbox (Assets/Avatars/Adults/Male_Adult_08) | MIT |
| models/rocketbox/Female_Adult_05.fbx | **New.** The woman in the room: she argues and points, later sleeps, afterwards sits at the table | Microsoft Rocketbox (Assets/Avatars/Adults/Female_Adult_05) | MIT |
| models/rocketbox/clips/*.json | Motion-captured clips, trimmed and resampled from the library's FBX animation files into small JSON files (0.5 MB in total, against 4.1 MB for three FBX files in round 8). `walk` = m_walk_neutral, `idle` = m_idle_breathe_01, `sit` = m_sit_chair_idle_look_around, **new:** `argue` = f_gestic_talk_angry_01 (6.6 to 10.4 s), `sad` = m_gestic_listen_sad_01 (4.6 to 8.6 s), `sitf` = f_sit_table_idle_waiting_01 (2 to 6 s) | Microsoft Rocketbox (Assets/Animations) | MIT |
| models/rocketbox/m005_*, m014_*, f005_* (.webp), and `s512/` | Colour and normal maps for the three avatars, converted from the library's 2k TGA files to 1k WebP and desaturated to fit the page's cold palette. `s512/` holds 512 px copies for the low quality tier | Microsoft Rocketbox (each avatar's Textures folder) | MIT |
| models/street_lamp_01/ | Street lamp on the street; three more at the facility (medium and high tier) | Poly Haven, https://polyhaven.com/a/street_lamp_01 | CC0 |
| models/old_bed_frame/ | Bed frame in the room | Poly Haven, https://polyhaven.com/a/old_bed_frame | CC0 |
| models/WoodenChair_01/ | Two chairs at the table: hers, and his, pulled out | Poly Haven, https://polyhaven.com/a/WoodenChair_01 | CC0 |
| models/WoodenTable_02/ | Small bedside table | Poly Haven, https://polyhaven.com/a/WoodenTable_02 | CC0 |
| models/Barrel_01/ | Barrel by the front door; three at the loading dock | Poly Haven, https://polyhaven.com/a/Barrel_01 | CC0 |
| models/concrete_road_barrier_02/ | Two road barriers on the street (not loaded on the low tier) | Poly Haven, https://polyhaven.com/a/concrete_road_barrier_02 | CC0 |
| models/Television_01/ | **New.** The television left on in the room | Poly Haven, https://polyhaven.com/a/Television_01 | CC0 |
| models/hanging_picture_frame_01/ | **New.** Two pictures on the back wall, not quite straight | Poly Haven, https://polyhaven.com/a/hanging_picture_frame_01 | CC0 |
| models/trashbag/ | **New.** Three rubbish bags in the room | Poly Haven, https://polyhaven.com/a/trashbag | CC0 |

All Poly Haven models are the 1k glTF versions. Round 9 converted their textures to WebP and rewrote the image paths inside
each `.gltf`; the small props (barrel, table, chair, television, picture frame, rubbish bag, barrier) were also reduced to
512 px. Colour maps of the chair, table, bed, television, picture frame and rubbish bag were desaturated.

## Textures (PBR sets: colour, normal, roughness)
| Files | Use | Source | Licence |
|---|---|---|---|
| models/tex/asphalt_04_* | Wet road on the street, the drive and the facility yard | Poly Haven, https://polyhaven.com/a/asphalt_04 | CC0 |
| models/tex/plaster_grey_04_* | Building facade, room walls | Poly Haven, https://polyhaven.com/a/plaster_grey_04 | CC0 |
| models/tex/concrete_wall_008_* | Pavement, door step, chimneys, loading dock, annex | Poly Haven, https://polyhaven.com/a/concrete_wall_008 | CC0 |
| models/tex/corrugated_iron_02_* | Factory halls, saw-tooth roofs, roller shutters | Poly Haven, https://polyhaven.com/a/corrugated_iron_02 | CC0 |

`models/tex/` holds 1k WebP files (medium and high tier); `models/tex512/` holds 512 px copies (low tier).

## HDRI
| File | Use | Source | Licence |
|---|---|---|---|
| models/hdri/cobblestone_street_night_1k.hdr | Image-based lighting and reflections, high tier | Poly Haven, https://polyhaven.com/a/cobblestone_street_night | CC0 |
| models/hdri/cobblestone_street_night_512.hdr | The same, resized to 512x256 (0.44 MB against 1.76 MB), medium and low tier | as above | CC0 |

The HDRI is graded to cold monochrome in code before use, so the page keeps the VOSS palette.

## Built in code (own work)
- **The van.** No free-licensed realistic van could be downloaded without a login. It is modelled in `index.html`.
- **The room** (round 9): walls with a real window opening and a door opening, door, skirting, bare bulb on its cord, mattress,
  two duvets (thrown back; over someone asleep), pillow, table, cup, plates, bottles, laundry, papers, curtain, television
  cabinet.
- The building facade (now with a real opening where the lit window is), window frames, sills, front door, downpipes.
- The rings and their particles in the drive; the single seat. The ring names are HTML, not textures.
- The facility: halls, saw-tooth roofs, chimneys, tanks, pipes, loading bays, fence, steam, beacons.
- The face plates on the team. Rain, light beams, glows, sky.

## Portraits (unchanged)
| File | Use | Source | Licence |
|---|---|---|---|
| media/p1.jpg | Card "A landlord" | Mixkit "Old and depressed man portrait" #33539, https://mixkit.co/free-stock-video/old-and-depressed-man-portrait-33539/ (frame still) | Mixkit Free Stock Video License, https://mixkit.co/license/#videoFree |
| media/p2.jpg | Card "A relative" | Mixkit "Homeless man portrait" #6341, https://mixkit.co/free-stock-video/homeless-man-portrait-6341/ (frame still) | Mixkit Free Stock Video License |
| media/p3.jpg | Card "A neighbour" | Mixkit "Light-eyed young woman portrait" #33431, https://mixkit.co/free-stock-video/light-eyed-young-woman-portrait-33431/ (frame still) | Mixkit Free Stock Video License |

The portrait subjects are stock models. Their eyes are covered as a design device, and every quote is fiction.

## Code and type
| Item | Source | Licence |
|---|---|---|
| Three.js r149 as an ES module, with GLTFLoader, FBXLoader, RGBELoader, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, SkeletonUtils | https://cdn.jsdelivr.net/npm/three@0.149.0/ (import map in `index.html`) | MIT |
| r4.js | Shared loop (paused when the tab is hidden), references toggle, toast, simplex noise (Ashima) | Own work; noise is MIT (Ashima Arts) |
| Inter (body, new in round 9), Inter Tight (headings), JetBrains Mono (labels) | Google Fonts | SIL Open Font License 1.1 |

## Not done
- **No Draco, meshopt or KTX2.** None of those tools is installed here, and fetching them was outside this round's rule
  (no outbound except free assets). Geometry is plain glTF and FBX; textures are WebP instead of KTX2. The three avatar files
  stay in FBX.
- The avatar library ships one level of detail per export file (about 22k vertices). There is no lower-polygon figure on the
  low tier; it gets smaller textures and half-rate animation instead.
- The page must be served over http(s). Opened as a local `file://` page, browsers block the model and HDRI requests.

Lethe is a placeholder brand for a class exercise.
