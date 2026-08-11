const nodes = [
  {
    id: 'castle-algorithms',
    title: 'Castle Algorithms: Chapter 1',
    type: 'main',
    x: '18%',
    y: '16%',
    xp: 120,
    status: 'unlocked',
    requirements: [],
  },
  {
    id: 'fortress-data',
    title: 'Fortress Data Structures',
    type: 'main',
    x: '42%',
    y: '30%',
    xp: 140,
    status: 'locked',
    requirements: ['castle-algorithms'],
  },
  {
    id: 'watchtower-ai',
    title: 'Watchtower AI Workshop',
    type: 'side',
    x: '32%',
    y: '52%',
    xp: 60,
    status: 'locked',
    requirements: ['castle-algorithms'],
  },
  {
    id: 'sanctum-systems',
    title: 'Sanctum Systems Design',
    type: 'main',
    x: '56%',
    y: '58%',
    xp: 160,
    status: 'locked',
    requirements: ['fortress-data'],
  },
  {
    id: 'camp-ethics',
    title: 'Hidden Camp: Ethics Seminar',
    type: 'side',
    x: '44%',
    y: '72%',
    xp: 50,
    status: 'locked',
    requirements: ['fortress-data'],
  },
];

const mapNodes = document.getElementById('mapNodes');
const detailTitle = document.getElementById('detailTitle');
const detailStatus = document.getElementById('detailStatus');
const detailXp = document.getElementById('detailXp');
const detailReq = document.getElementById('detailReq');
const completeButton = document.getElementById('completeButton');
const totalXpElement = document.getElementById('totalXp');
const currentLevel = document.getElementById('currentLevel');
const levelProgress = document.getElementById('levelProgress');
const progressLabel = document.getElementById('progressLabel');

let selectedNodeId = null;
const BASE_XP = 0;
const LEVEL_STEP = 250;
let state = {
  xp: BASE_XP,
  completed: [],
};

function loadState() {
  const stored = localStorage.getItem('academicAdventureState');
  if (stored) {
    state = JSON.parse(stored);
  }
}

function saveState() {
  localStorage.setItem('academicAdventureState', JSON.stringify(state));
}

function getNodeById(id) {
  return nodes.find((node) => node.id === id);
}

function updateUnlockedStates() {
  nodes.forEach((node) => {
    if (state.completed.includes(node.id)) {
      node.status = 'completed';
      return;
    }
    const requirementsMet = node.requirements.every((req) => state.completed.includes(req));
    node.status = requirementsMet ? 'unlocked' : 'locked';
  });
}

function calculateLevel(xp) {
  return Math.floor(xp / LEVEL_STEP) + 1;
}

function renderHud() {
  totalXpElement.textContent = state.xp;
  const level = calculateLevel(state.xp);
  currentLevel.textContent = level;
  const progress = ((state.xp % LEVEL_STEP) / LEVEL_STEP) * 100;
  levelProgress.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  progressLabel.textContent = `${Math.round(progress)}% to next level`;
}

function renderNodes() {
  mapNodes.innerHTML = '';
  nodes.forEach((node) => {
    const nodeButton = document.createElement('button');
    nodeButton.setAttribute('type', 'button');
    nodeButton.className = `node-button group absolute flex items-center gap-3 rounded-full border px-3 py-2 text-left text-xs shadow-lg shadow-slate-950/20 transition ${node.type === 'main' ? 'border-cyan-400/20 bg-slate-900/80' : 'border-amber-400/20 bg-slate-950/80'} ${node.status === 'locked' ? 'locked' : ''} ${node.status === 'completed' ? 'completed bg-emerald-950/80 border-emerald-400/30' : ''}`;
    nodeButton.style.left = node.x;
    nodeButton.style.top = node.y;
    nodeButton.style.transform = 'translate(-50%, -50%)';
    nodeButton.dataset.id = node.id;
    nodeButton.innerHTML = `
      <span class="node-dot ${node.type === 'main' ? 'bg-cyan-400' : 'bg-amber-400'}"></span>
      <span class="font-semibold text-slate-100">${node.title}</span>
    `;
    nodeButton.addEventListener('click', () => selectNode(node.id));
    mapNodes.appendChild(nodeButton);
  });
}

function selectNode(id) {
  selectedNodeId = id;
  const node = getNodeById(id);
  if (!node) return;
  detailTitle.textContent = node.title;
  detailStatus.textContent = node.status === 'completed' ? 'Completed' : node.status === 'unlocked' ? 'Unlocked' : 'Locked';
  detailXp.textContent = `${node.xp} XP`;
  detailReq.textContent = node.requirements.length > 0 ? node.requirements.map((req) => getNodeById(req).title).join(', ') : 'No prerequisites.';
  completeButton.disabled = node.status !== 'unlocked';
  completeButton.textContent = node.status === 'completed' ? 'Quest Completed' : 'Complete Quest';
}

function completeSelectedNode() {
  if (!selectedNodeId) return;
  const node = getNodeById(selectedNodeId);
  if (!node || node.status !== 'unlocked') return;

  state.completed.push(node.id);
  state.xp += node.xp;
  updateUnlockedStates();
  renderNodes();
  renderHud();
  selectNode(node.id);
  saveState();
}

completeButton.addEventListener('click', completeSelectedNode);

function initialize() {
  loadState();
  updateUnlockedStates();
  renderHud();
  renderNodes();
  const selected = nodes.find((node) => state.completed.includes(node.id)) || nodes[0];
  selectNode(selected.id);
}

initialize();
