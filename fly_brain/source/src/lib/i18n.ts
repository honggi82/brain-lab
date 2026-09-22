import { createContext, useContext } from 'react';

export type Lang = 'ko' | 'en';

/**
 * Every visible string, in one table.
 *
 * English is the source of truth for the key set: `Dict` is derived from it, so
 * a missing Korean entry is a type error rather than an empty label at runtime.
 * Anatomical and dataset terms (MaleCNS, ThC, FTi, DNp01, body IDs) stay in
 * their published form in both languages, because those are the names the
 * literature and the data files use.
 */
const en = {
  "static.subtitle": "MaleCNS v1.0 · inspect neurons and replay population experiments",
  "static.legend": "Click a soma for its identity · cyan = net excitation · orange = net inhibition · green = stimulus",
  "static.cnsAria": "MaleCNS nervous system. Click a neuron to inspect its identity.",
  "static.inspect": "Click a soma in the 3D view to inspect it, then replay its population. Individual-neuron simulation and search require the local version.",
  "static.loadingRun": "Loading…",
  "error.load": "Could not load the data. Try again.",
  "body.loadModel": "Load full body model (13 MB)",
  "body.loadNote": "The full-resolution body loads on demand on mobile. Experiments and their results remain available.",
  "body.netNote": "Colour intensity and table order use |excitation + signed inhibition| at the final time. Joint posture follows the current frame.",
  "body.midlineNote": "Midline neck/abdomen: bilateral mean for pitch, half of left minus right for lateral axes. This is a visualisation assumption, not measured movement.",
  "circuit.aria": "Connectome populations. Use Tab and Enter to select a stimulus.",
  'app.title': 'FLY CONNECTOME SIMULATOR',
  'app.subtitle': 'MaleCNS v1.0 · brain, optic lobes and nerve cord · click a neuron to stimulate it',
  'app.dataset': 'Dataset ↗',
  'app.langLabel': 'Language',
  'app.manual': 'Manual',
  'app.manualTip': 'Open the manual in a new window',
  'app.manualFile': 'manual/en.html',

  'toolbar.stimulating': 'Stimulating',
  'toolbar.nothing': 'nothing selected',
  'toolbar.seed': 'seed',
  'toolbar.seeds': 'seeds',
  'toolbar.reset': 'Reset',
  'toolbar.play': 'Play',
  'toolbar.pause': 'Pause',
  'toolbar.rerun': 'Re-run',
  'toolbar.running': 'Simulating…',
  'toolbar.clear': 'Clear',
  'toolbar.noSim': 'no simulation',
  'toolbar.hop': 'hop',
  'toolbar.of': 'of',

  'panel.cns': '01 / NERVOUS SYSTEM',
  'panel.cnsSomata': ' somata',
  'panel.cnsEdges': ' synaptic connections',
  'panel.cnsOrient': 'brain above · nerve cord below',
  'panel.body': '02 / BODY',
  'panel.bodyTag': 'Flybody · articulated',
  'panel.bodyPosed': 'joints posed by motor pool balance',
  'panel.bodyDrag': 'drag to rotate · scroll to zoom',
  'panel.experiment': '04 / EXPERIMENT',
  'panel.detail': '05 / DETAIL',
  'panel.loadingAnatomy': 'Loading measured anatomy…',

  'tab.search': 'search',
  'tab.neuron': 'neuron',
  'tab.flow': 'flow',

  'cns.front': 'Front',
  'cns.side': 'Side',
  'cns.orbitOn': 'Orbit on',
  'cns.orbitOff': 'Orbit off',
  'cns.legend': 'Click a soma to stimulate · shift-click to add · cyan = net excitation · orange = net inhibition · green = stimulated',
  'cns.aria': 'MaleCNS central nervous system, click a neuron to stimulate it',

  'body.loading': 'Loading body model…',
  'body.aria': 'Articulated Flybody model posed by the simulation',
  'body.captionDown': 'Joints move with the balance of their motor pools. Cyan = driven, orange = inhibited.',
  'body.captionUp': 'Upstream trace: the limbs the sources of this signal belong to.',
  'body.noMotor': 'No motor neuron reached yet.',
  'body.limb': 'limb',
  'body.drive': 'drive',
  'body.brake': 'brake',
  'body.active': 'active',
  'body.jointBalance': 'Joint balance',
  'body.sensoryReached': 'sensory reached',
  'body.segments': ' segments',
  'body.drivenJoints': ' driven joints',
  'body.triangles': ' triangles',

  'ctrl.experiment': 'Experiment',
  'ctrl.neurons': ' neurons',
  'ctrl.propagation': 'Propagation',
  'ctrl.mode': 'Mode',
  'ctrl.modePath': 'path (hops)',
  'ctrl.modeRate': 'rate (time)',
  'ctrl.direction': 'Direction',
  'ctrl.down': 'downstream (what it drives)',
  'ctrl.up': 'upstream (what drives it)',
  'ctrl.hops': 'Hops',
  'ctrl.decay': 'Per-hop decay',
  'ctrl.duration': 'Duration',
  'ctrl.tau': 'Tau',
  'ctrl.gain': 'Gain',
  'ctrl.stim': 'Stimulus',
  'ctrl.minWeight': 'Min synapses',
  'ctrl.inhibition': 'Inhibition',
  'ctrl.stimulateN': 'Stimulate {n} neurons',
  'ctrl.stimulate1': 'Stimulate 1 neuron',

  'search.placeholder': 'Search type, instance or body ID',
  'search.anyRole': 'any role',
  'search.anyPart': 'any part',
  'search.bothSides': 'both sides',
  'search.left': 'left',
  'search.right': 'right',
  'search.midline': 'midline',
  'search.stimulateAll': 'Stimulate all {n} shown',
  'search.stimTip': 'Stimulate only this neuron',
  'search.stim': 'stim',
  'search.none': 'No match.',
  'search.matching': '{n} matching neurons',

  'insp.empty': 'Click a soma in the 3D view, or pick one from the search list.',
  'insp.loading': 'Loading neuron…',
  'insp.bodyId': 'body ID',
  'insp.role': 'role',
  'insp.superclass': 'superclass',
  'insp.transmitter': 'transmitter',
  'insp.bodyPart': 'body part',
  'insp.synapses': 'synapses',
  'insp.in': 'in',
  'insp.out': 'out',
  'insp.excitatory': 'excitatory',
  'insp.inhibitory': 'inhibitory',
  'insp.neutral': 'neutral',
  'insp.stimulateThis': 'Stimulate this neuron',
  'insp.targets': 'Strongest targets',
  'insp.sources': 'Strongest sources',
  'insp.noPartners': 'none',

  'flow.empty': 'Run a stimulation to see the signal move.',
  'flow.carrying': 'carrying signal now',
  'flow.reached': 'reached in total',
  'flow.descending': 'descending',
  'flow.ascending': 'ascending',
  'flow.motor': 'motor',
  'flow.sensory': 'sensory',
  'flow.strongest': 'Strongest neurons at the end',

  'circuit.title': '03 / CIRCUIT',
  'circuit.tag': 'population level',
  'circuit.loading': 'Loading the circuit…',
  'circuit.min': 'Min synapses',
  'circuit.back': 'Back edges',
  'circuit.shown': 'showing {a} of {b} edges',
  'circuit.pick': 'Click a population to stimulate every neuron in it.',
  'circuit.stimulating': 'stimulating this population',
  'circuit.pickSub': 'nothing selected',
  'circuit.live': 'lit by the running simulation',
  'circuit.idle': 'structure only, no simulation yet',
  'static.badge': 'precomputed build',
  'static.why': 'This hosted copy plays runs computed in advance. Presets and circuit populations work; stimulating a neuron you picked yourself needs the local version.',
  'static.pickedNeuron': 'Selected neuron',
  'static.runIts': 'Run its population',
  'static.noSearch': 'Neuron search needs the local version.',
  'static.cannotCompute': 'This hosted build cannot compute a new run. Hops 1 to 10 are precomputed; every other setting needs the local version.',
  'static.fixed': 'fixed in this build',
  'static.fixedNote': 'In path mode, moving the hop slider replays the current stimulus. The greyed settings are fixed in this hosted build.',
  'circuit.popNeurons': ' neurons',
  'circuit.inbound': 'inbound',
  'circuit.outbound': 'outbound',
  'circuit.none': 'none',
  'circuit.col.sensory': 'sensory input',
  'circuit.col.early': 'first order',
  'circuit.col.central': 'central brain',
  'circuit.col.descending': 'descending',
  'circuit.col.cord': 'nerve cord',
  'circuit.col.motor': 'motor output',
  'circuit.leg.sensory': 'sensory',
  'circuit.leg.early': 'first order',
  'circuit.leg.brain': 'brain region',
  'circuit.leg.bridge': 'descending · ascending',
  'circuit.leg.cord': 'nerve cord',
  'circuit.leg.motor': 'motor',
  'circuit.leg.exc': 'mostly excitatory',
  'circuit.leg.inh': 'mostly inhibitory',
  'circuit.leg.back': 'runs backwards',

  'step.label': 'Step',

  'notes.title': 'What is measured and what is modelled',
  'notes.measuredLabel': 'Measured:',
  'notes.measured': 'the wiring. Every connection comes from MaleCNS v1.0 — {nodes} annotated neurons and {edges} connections between them, with synapse counts as weights. Soma positions, cell types, body-part assignments and neurotransmitter predictions come from the same release. Unannotated segmentation fragments are excluded.',
  'notes.modelledLabel': 'Modelled:',
  'notes.modelled': 'the dynamics. Sign comes from the predicted transmitter (acetylcholine excitatory; GABA, glutamate and histamine inhibitory; amines weakly modulatory), and propagation is either fraction-of-output over discrete hops or a leaky rate unit per neuron. These are assumptions laid on measured wiring, not recorded physiology. Nothing here reproduces spike timing, neuropeptides, gap junctions or synaptic plasticity.',
  'notes.bodyLabel': 'The body:',
  'notes.body': "the full Flybody MuJoCo model — 67 segments, six legs down to the tarsal claws, wings, halteres, antennae and eight abdominal segments — with its kinematic tree intact. 91 of its 102 joints are driven here. A joint's angle is the balance between the motor pools that pull it each way, named from the muscle each MaleCNS motor neuron innervates (Ti extensor against Ti flexor at the knee, Tr extensor against Tr flexor at the trochanter, and so on). The mesh ships unsimplified at all 272,550 triangles, the highest-resolution fly body released publicly — Flybody is built from confocal microscopy at 0.3 to 2 µm, where NeuroMechFly ships segments capped at 2,000 faces each. The paper's 22.6 M-face version was a modelling intermediate and was never released as a mesh. Joint axes and limits are MuJoCo's, unchanged. This is kinematics, not physics: there is no gravity, ground contact or muscle force model.",
  'notes.directionLabel': 'Direction:',
  'notes.direction': "downstream follows axons away from the seed; upstream walks the same graph backwards to find what drives it. A leg stimulus is a downstream run seeded on that leg's sensory neurons; asking what moves a leg is an upstream run seeded on its motor neurons.",
  'notes.credit': 'Dataset: FlyEM / HHMI Janelia, University of Cambridge, MRC Laboratory of Molecular Biology and Google Research.',
  'notes.creditLink': ' MaleCNS data',
  'notes.creditTail': ', CC BY 4.0.',

  'attr.builtWith': 'Built with',
  'attr.by': 'by',
  'attr.license': 'License',
  'attr.data': 'Data',
  'attr.body': 'Body',

  'error.apiHint': 'Start the API first: python -m uvicorn server.app:app --port 8000',

  'role.motor': 'motor',
  'role.sensory': 'sensory',
  'role.sensory_ascending': 'sensory (ascending)',
  'role.descending': 'descending',
  'role.ascending': 'ascending',
  'role.intrinsic': 'intrinsic',
  'role.visual_projection': 'visual projection',
  'role.visual_centrifugal': 'visual centrifugal',
  'role.efferent': 'efferent',
  'role.endocrine': 'endocrine',
  'role.other': 'unclassified',

  'part.front leg': 'front leg',
  'part.middle leg': 'middle leg',
  'part.hind leg': 'hind leg',
  'part.wing': 'wing',
  'part.haltere': 'haltere',
  'part.neck': 'neck',
  'part.abdomen': 'abdomen',
  'part.head': 'head',
  'part.other': 'other',

  'group.optic': 'optic lobe',
  'group.central': 'central brain',
  'group.descending': 'descending',
  'group.vnc': 'nerve cord',
  'group.other': 'other',

  'side.L': 'left',
  'side.R': 'right',
  'side.M': 'midline',

  'preset.giant-fiber.title': 'Giant fibre escape (DNp01)',
  'preset.giant-fiber.detail': 'The best-known descending command neuron. Downstream from the brain into the nerve cord.',
  'preset.descending-all.title': 'Descending sample to body (200)',
  'preset.descending-all.detail': 'The 200 descending neurons with the largest total input plus output synapse count. Use the circuit population for all 1,316.',
  'preset.front-leg-sensory.title': 'Left front leg touched',
  'preset.front-leg-sensory.detail': 'Sensory neurons of the left front leg fire. Two synapses is the local reflex; raise the hops to follow it up to the brain, and the other legs start adjusting too.',
  'preset.front-leg-motor-upstream.title': 'What drives the left front leg?',
  'preset.front-leg-motor-upstream.detail': 'Start at the left front-leg motor neurons and walk upstream to find their controllers.',
  'preset.visual-projection.title': 'Visual projection neurons',
  'preset.visual-projection.detail': 'Optic-lobe output into the central brain, in continuous time.',
  'preset.hind-leg-motor-upstream.title': 'What drives the right hind leg?',
  'preset.hind-leg-motor-upstream.detail': 'Upstream from the right hind-leg motor pool.',
};

export type Dict = Record<keyof typeof en, string>;

const ko: Dict = {
  "static.subtitle": "MaleCNS v1.0 · 뉴런 정보 탐색과 집단 실험 재생",
  "static.legend": "세포체 클릭 시 정보 보기 · 하늘색 = 순흥분 · 주황색 = 순억제 · 초록색 = 자극",
  "static.cnsAria": "MaleCNS 신경계. 뉴런을 클릭하면 정보를 확인합니다.",
  "static.inspect": "3D 화면의 세포체를 클릭해 정보를 확인한 뒤 소속 집단을 재생하세요. 개별 뉴런 계산과 검색은 로컬 버전에서 지원합니다.",
  "static.loadingRun": "불러오는 중…",
  "error.load": "데이터를 불러오지 못했습니다. 다시 시도하세요.",
  "body.loadModel": "전체 몸 모델 불러오기 (13 MB)",
  "body.loadNote": "모바일에서는 고해상도 몸 모델을 선택해서 불러옵니다. 실험과 결과는 그대로 사용할 수 있습니다.",
  "body.netNote": "색상 밝기와 표 순서는 최종 시점의 |흥분 + 음수 억제|를 사용합니다. 관절 자세는 현재 프레임을 따릅니다.",
  "body.midlineNote": "목·배의 중앙 관절: 앞뒤 굽힘은 좌우 평균, 측방 축은 좌우 차이의 절반을 사용합니다. 실측 움직임이 아닌 시각화 가정입니다.",
  "circuit.aria": "커넥톰 집단 회로도. Tab과 Enter로 자극할 집단을 선택하세요.",
  'app.title': '초파리 커넥톰 시뮬레이터',
  'app.subtitle': 'MaleCNS v1.0 · 뇌 · 시엽 · 배신경삭 — 뉴런을 클릭하면 자극합니다',
  'app.dataset': '데이터셋 ↗',
  'app.langLabel': '언어',
  'app.manual': '설명서',
  'app.manualTip': '새 창에서 설명서 열기',
  'app.manualFile': 'manual/ko.html',

  'toolbar.stimulating': '자극 중',
  'toolbar.nothing': '선택 없음',
  'toolbar.seed': '개 자극',
  'toolbar.seeds': '개 자극',
  'toolbar.reset': '처음으로',
  'toolbar.play': '재생',
  'toolbar.pause': '일시정지',
  'toolbar.rerun': '다시 실행',
  'toolbar.running': '계산 중…',
  'toolbar.clear': '지우기',
  'toolbar.noSim': '시뮬레이션 없음',
  'toolbar.hop': '홉',
  'toolbar.of': '/',

  'panel.cns': '01 / 신경계',
  'panel.cnsSomata': '개 세포체',
  'panel.cnsEdges': '개 시냅스 연결',
  'panel.cnsOrient': '위쪽이 뇌 · 아래쪽이 배신경삭',
  'panel.body': '02 / 몸',
  'panel.bodyTag': 'Flybody · 관절 구동',
  'panel.bodyPosed': '운동뉴런 균형으로 관절 자세 결정',
  'panel.bodyDrag': '드래그로 회전 · 스크롤로 확대',
  'panel.experiment': '04 / 실험',
  'panel.detail': '05 / 상세',
  'panel.loadingAnatomy': '실측 해부 데이터 불러오는 중…',

  'tab.search': '검색',
  'tab.neuron': '뉴런',
  'tab.flow': '흐름',

  'cns.front': '정면',
  'cns.side': '측면',
  'cns.orbitOn': '자동회전 켬',
  'cns.orbitOff': '자동회전 끔',
  'cns.legend': '세포체 클릭 시 자극 · Shift+클릭으로 추가 · 하늘색 = 순흥분 · 주황색 = 순억제 · 초록색 = 자극한 뉴런',
  'cns.aria': 'MaleCNS 중추신경계. 뉴런을 클릭하면 자극합니다',

  'body.loading': '몸 모델 불러오는 중…',
  'body.aria': '시뮬레이션이 자세를 결정하는 Flybody 관절 모델',
  'body.captionDown': '관절은 해당 운동뉴런 풀의 균형에 따라 움직입니다. 하늘색 = 구동, 주황색 = 억제.',
  'body.captionUp': '상류 추적: 이 신호의 출처가 속한 부위입니다.',
  'body.noMotor': '아직 도달한 운동뉴런이 없습니다.',
  'body.limb': '부위',
  'body.drive': '구동',
  'body.brake': '제동',
  'body.active': '활성',
  'body.jointBalance': '관절 균형',
  'body.sensoryReached': '도달한 감각뉴런',
  'body.segments': '개 분절',
  'body.drivenJoints': '개 구동 관절',
  'body.triangles': '개 삼각형',

  'ctrl.experiment': '실험',
  'ctrl.neurons': '개 뉴런',
  'ctrl.propagation': '전파 설정',
  'ctrl.mode': '모드',
  'ctrl.modePath': '경로 (홉 단위)',
  'ctrl.modeRate': '발화율 (연속시간)',
  'ctrl.direction': '방향',
  'ctrl.down': '하류 — 무엇을 움직이는가',
  'ctrl.up': '상류 — 무엇이 움직이는가',
  'ctrl.hops': '홉 수',
  'ctrl.decay': '홉당 감쇠',
  'ctrl.duration': '지속 시간',
  'ctrl.tau': '시상수',
  'ctrl.gain': '이득',
  'ctrl.stim': '자극 길이',
  'ctrl.minWeight': '최소 시냅스 수',
  'ctrl.inhibition': '억제 배율',
  'ctrl.stimulateN': '뉴런 {n}개 자극',
  'ctrl.stimulate1': '뉴런 1개 자극',

  'search.placeholder': '타입 · 인스턴스 · body ID로 검색',
  'search.anyRole': '역할 전체',
  'search.anyPart': '부위 전체',
  'search.bothSides': '좌우 전체',
  'search.left': '왼쪽',
  'search.right': '오른쪽',
  'search.midline': '정중선',
  'search.stimulateAll': '표시된 {n}개 모두 자극',
  'search.stimTip': '이 뉴런만 자극',
  'search.stim': '자극',
  'search.none': '결과 없음.',
  'search.matching': '검색된 뉴런 {n}개',

  'insp.empty': '3D 화면에서 세포체를 클릭하거나 검색 목록에서 고르세요.',
  'insp.loading': '뉴런 불러오는 중…',
  'insp.bodyId': 'body ID',
  'insp.role': '역할',
  'insp.superclass': '상위분류',
  'insp.transmitter': '신경전달물질',
  'insp.bodyPart': '담당 부위',
  'insp.synapses': '시냅스',
  'insp.in': '입력',
  'insp.out': '출력',
  'insp.excitatory': '흥분성',
  'insp.inhibitory': '억제성',
  'insp.neutral': '중립',
  'insp.stimulateThis': '이 뉴런 자극',
  'insp.targets': '가장 강한 출력 대상',
  'insp.sources': '가장 강한 입력 출처',
  'insp.noPartners': '없음',

  'flow.empty': '자극을 실행하면 신호가 어디로 퍼지는지 보입니다.',
  'flow.carrying': '개가 현재 신호 보유',
  'flow.reached': '개에 누적 도달',
  'flow.descending': '하행뉴런',
  'flow.ascending': '상행뉴런',
  'flow.motor': '운동뉴런',
  'flow.sensory': '감각뉴런',
  'flow.strongest': '최종 시점에서 가장 강한 뉴런',

  'circuit.title': '03 / 회로도',
  'circuit.tag': '집단 단위',
  'circuit.loading': '회로도 불러오는 중…',
  'circuit.min': '최소 시냅스',
  'circuit.back': '역방향 엣지',
  'circuit.shown': '엣지 {a}개 표시 (전체 {b}개 중)',
  'circuit.pick': '집단을 클릭하면 그 집단의 모든 뉴런이 자극됩니다.',
  'circuit.stimulating': '이 집단을 자극하는 중',
  'circuit.pickSub': '선택 없음',
  'circuit.live': '실행 중인 시뮬레이션이 켠 영역',
  'circuit.idle': '구조만 표시 · 아직 시뮬레이션 없음',
  'static.badge': '미리 계산된 배포본',
  'static.why': '이 온라인 판은 미리 계산해 둔 결과를 재생합니다. 프리셋과 회로도 집단은 그대로 동작하고, 직접 고른 뉴런을 자극하려면 로컬 버전이 필요합니다.',
  'static.pickedNeuron': '선택한 뉴런',
  'static.runIts': '이 뉴런이 속한 집단 재생',
  'static.noSearch': '뉴런 검색은 로컬 버전에서만 됩니다.',
  'static.cannotCompute': '온라인 판은 새로 계산할 수 없습니다. 홉 1~10은 미리 계산되어 있고, 나머지 설정은 로컬 버전이 필요합니다.',
  'static.fixed': '이 배포본에서는 고정',
  'static.fixedNote': '경로 모드에서 홉 슬라이더를 움직이면 현재 자극이 그 홉 수로 다시 재생됩니다. 흐리게 표시된 설정은 이 배포본에서 고정입니다.',
  'circuit.popNeurons': '개 뉴런',
  'circuit.inbound': '들어오는 연결',
  'circuit.outbound': '나가는 연결',
  'circuit.none': '없음',
  'circuit.col.sensory': '감각 입력',
  'circuit.col.early': '1차 처리',
  'circuit.col.central': '중추뇌',
  'circuit.col.descending': '하행',
  'circuit.col.cord': '배신경삭',
  'circuit.col.motor': '운동 출력',
  'circuit.leg.sensory': '감각',
  'circuit.leg.early': '1차 처리',
  'circuit.leg.brain': '뇌 영역',
  'circuit.leg.bridge': '하행 · 상행',
  'circuit.leg.cord': '신경삭',
  'circuit.leg.motor': '운동',
  'circuit.leg.exc': '흥분 우세',
  'circuit.leg.inh': '억제 우세',
  'circuit.leg.back': '역방향',

  'step.label': '단계',

  'notes.title': '무엇이 실측이고 무엇이 모델인가',
  'notes.measuredLabel': '실측:',
  'notes.measured': '배선입니다. 모든 연결은 MaleCNS v1.0에서 왔습니다 — 주석된 뉴런 {nodes}개와 그 사이 연결 {edges}개이며, 가중치는 시냅스 개수입니다. 세포체 좌표, 세포 타입, 담당 부위, 신경전달물질 예측도 같은 릴리스에서 왔습니다. 주석되지 않은 분할 조각은 제외했습니다.',
  'notes.modelledLabel': '모델:',
  'notes.modelled': '동역학입니다. 부호는 예측된 신경전달물질에서 왔고(아세틸콜린은 흥분성, GABA·글루탐산·히스타민은 억제성, 아민류는 약한 조절성), 전파는 홉 단위 출력분율 확산이거나 뉴런당 누출적분 발화율 단위입니다. 이것들은 실측 배선 위에 얹은 가정이지 기록된 생리가 아닙니다. 스파이크 타이밍, 신경펩타이드, 전기적 시냅스, 시냅스 가소성은 어느 것도 재현하지 않습니다.',
  'notes.bodyLabel': '몸:',
  'notes.body': 'Flybody MuJoCo 모델 전체입니다 — 67개 분절, 발톱까지 내려가는 여섯 다리, 날개, 평균곤, 더듬이, 복부 8마디 — 운동학 트리를 그대로 유지합니다. 102개 관절 중 91개가 여기서 구동됩니다. 관절각은 그 관절을 양쪽으로 당기는 운동뉴런 풀의 균형이며, MaleCNS 운동뉴런이 지배하는 근육 이름에서 배정됩니다(무릎의 Ti extensor 대 Ti flexor, 전절의 Tr extensor 대 Tr flexor 등). 메시는 단순화 없이 272,550 삼각형 전량을 싣습니다 — 공개된 초파리 몸 모델 중 최고 해상도입니다. Flybody는 0.3~2 µm 공초점 현미경으로 만들어졌고, NeuroMechFly는 분절당 최대 2,000면으로 제한된 메시를 배포합니다. 논문의 2,260만 면 버전은 모델링 중간 산물이며 메시로 공개된 적이 없습니다. 관절 축과 가동범위는 MuJoCo 원본 그대로입니다. 이것은 운동학이지 물리가 아닙니다: 중력, 지면 접촉, 근육 힘 모델이 없습니다.',
  'notes.directionLabel': '방향:',
  'notes.direction': '하류는 시작 뉴런에서 축삭을 따라 나가고, 상류는 같은 그래프를 거꾸로 걸어 무엇이 그것을 구동하는지 찾습니다. 다리를 자극한다는 것은 그 다리의 감각뉴런에서 시작하는 하류 실행이고, 무엇이 다리를 움직이냐고 묻는 것은 그 다리의 운동뉴런에서 시작하는 상류 실행입니다.',
  'notes.credit': '데이터셋: FlyEM / HHMI Janelia, 케임브리지 대학교, MRC 분자생물학 연구소, Google Research.',
  'notes.creditLink': ' MaleCNS 데이터',
  'notes.creditTail': ', CC BY 4.0.',

  'attr.builtWith': '제작 기반:',
  'attr.by': '·',
  'attr.license': '라이선스',
  'attr.data': '데이터',
  'attr.body': '몸 모델',

  'error.apiHint': 'API를 먼저 실행하세요: python -m uvicorn server.app:app --port 8000',

  'role.motor': '운동',
  'role.sensory': '감각',
  'role.sensory_ascending': '감각 (상행)',
  'role.descending': '하행',
  'role.ascending': '상행',
  'role.intrinsic': '개재',
  'role.visual_projection': '시각 투사',
  'role.visual_centrifugal': '시각 원심',
  'role.efferent': '원심',
  'role.endocrine': '내분비',
  'role.other': '미분류',

  'part.front leg': '앞다리',
  'part.middle leg': '가운뎃다리',
  'part.hind leg': '뒷다리',
  'part.wing': '날개',
  'part.haltere': '평균곤',
  'part.neck': '목',
  'part.abdomen': '배',
  'part.head': '머리',
  'part.other': '기타',

  'group.optic': '시엽',
  'group.central': '중추뇌',
  'group.descending': '하행',
  'group.vnc': '배신경삭',
  'group.other': '기타',

  'side.L': '왼쪽',
  'side.R': '오른쪽',
  'side.M': '정중선',

  'preset.giant-fiber.title': '거대섬유 도피 반응 (DNp01)',
  'preset.giant-fiber.detail': '가장 잘 알려진 하행 명령뉴런입니다. 뇌에서 배신경삭으로 내려가는 하류 실행.',
  'preset.descending-all.title': '하행뉴런 표본 200개 → 몸',
  'preset.descending-all.detail': '입력·출력 시냅스 수 합계가 큰 하행뉴런 200개입니다. 전체 1,316개는 회로도의 하행뉴런 집단을 선택하세요.',
  'preset.front-leg-sensory.title': '왼쪽 앞다리를 건드림',
  'preset.front-leg-sensory.detail': '왼쪽 앞다리 감각뉴런이 발화합니다. 2홉은 국소 반사이고, 홉 수를 올리면 뇌까지 따라갈 수 있습니다 — 그때부터 다른 다리도 자세를 바꿉니다.',
  'preset.front-leg-motor-upstream.title': '무엇이 왼쪽 앞다리를 움직이는가?',
  'preset.front-leg-motor-upstream.detail': '왼쪽 앞다리 운동뉴런에서 시작해 상류로 거슬러 올라가 제어자를 찾습니다.',
  'preset.visual-projection.title': '시각 투사뉴런',
  'preset.visual-projection.detail': '시엽에서 중추뇌로 들어가는 출력을 연속시간으로 봅니다.',
  'preset.hind-leg-motor-upstream.title': '무엇이 오른쪽 뒷다리를 움직이는가?',
  'preset.hind-leg-motor-upstream.detail': '오른쪽 뒷다리 운동뉴런 풀에서 상류로 추적합니다.',
};

export const STRINGS: Record<Lang, Dict> = { en, ko };

export const LangContext = createContext<Lang>('ko');

/**
 * Embedded in the lab website, the language is the site's, not ours: it stores
 * 'ko' or 'en' under this key and defaults to English. Standalone, the
 * simulator keeps its own preference.
 */
export const SITE_LANG_KEY = 'brainlab-language-v2';
export const OWN_LANG_KEY = 'fly-sim-lang';
export const EMBEDDED = window.self !== window.top;

export function readLang(): Lang {
  try {
    const key = EMBEDDED ? SITE_LANG_KEY : OWN_LANG_KEY;
    const saved = localStorage.getItem(key);
    if (saved === 'ko' || saved === 'en') return saved;
  } catch { /* private mode or blocked storage */ }
  return EMBEDDED ? 'en' : 'ko';
}

export function writeLang(next: Lang): void {
  try { localStorage.setItem(OWN_LANG_KEY, next); } catch { /* not essential */ }
}

export type Translate = {
  lang: Lang;
  /** Look up a key; `vars` fills {name} placeholders. */
  t: (key: keyof Dict, vars?: Record<string, string | number>) => string;
  /** Labels that arrive from the API as raw data values. */
  role: (value: string) => string;
  part: (value: string) => string;
  group: (value: string) => string;
  /** "L front leg" and friends, as the engine keys limbs. */
  limb: (value: string) => string;
};

export function useT(): Translate {
  const lang = useContext(LangContext);
  const table = STRINGS[lang];

  const t = (key: keyof Dict, vars?: Record<string, string | number>) => {
    const text = table[key] ?? STRINGS.en[key] ?? String(key);
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, (match, name) =>
      name in vars ? String(vars[name]) : match);
  };

  const lookup = (prefix: string) => (value: string) => {
    const key = `${prefix}.${value}` as keyof Dict;
    return table[key] ?? STRINGS.en[key] ?? value;
  };

  const part = lookup('part');
  const limb = (value: string) => {
    // The engine keys limbs as "<side> <part>", e.g. "L front leg".
    const match = value.match(/^([LRM]) (.+)$/);
    if (!match) return part(value);
    const side = table[`side.${match[1]}` as keyof Dict] ?? match[1];
    return lang === 'ko' ? `${side} ${part(match[2])}` : `${match[1]} ${part(match[2])}`;
  };

  return { lang, t, role: lookup('role'), part, group: lookup('group'), limb };
}
