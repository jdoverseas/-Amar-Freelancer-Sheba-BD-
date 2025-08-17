// static/script.js

// Data (trimmed lists — expand as needed)
const toolsData = [
  {
    category: "🖼 Image Tools",
    subtitle: "Resize, compress and convert images quickly.",
    tools: [
      { name: "Image Converter", icon: "fa-image", desc: "Convert between JPG, PNG, WebP", url: "#" },
      { name: "Image Compressor", icon: "fa-compress", desc: "Reduce file size", url: "#" },
      { name: "Image Resizer", icon: "fa-expand", desc: "Resize to exact pixels", url: "#" }
    ]
  },
  {
    category: "📄 Document Tools",
    subtitle: "PDF and document helpers.",
    tools: [
      { name: "PDF to Word", icon: "fa-file-word", desc: "Convert PDF to Word", url: "#" },
      { name: "PDF Compressor", icon: "fa-file-pdf", desc: "Reduce PDF size", url: "#" }
    ]
  },
  {
    category: "🧮 Calculator Tools",
    subtitle: "Quick calculators for daily needs.",
    tools: [
      { name: "Loan EMI Calculator", icon: "fa-money-bill", desc: "Estimate EMI", url: "#" },
      { name: "BMI Calculator", icon: "fa-weight", desc: "Body mass index", url: "#" }
    ]
  }
];

// Freelancer services (Bangla groups — sample)
const freelancerServices = [
  {
    name: "নাগরিক সেবা (Citizen Services)",
    items: [
      { name: "জন্ম নিবন্ধন", icon: "🎂", url: "https://citizen.mygov.bd/birth", desc: "অনলাইনে জন্ম সনদ" },
      { name: "পরিচয়পত্র (NID)", icon: "🆔", url: "https://citizen.mygov.bd/nid", desc: "NID আবেদন/আপডেট" }
    ]
  },
  {
    name: "স্বাস্থ্য সেবা (Health Services)",
    items: [
      { name: "টিকা নিবন্ধন", icon: "💉", url: "https://health.mygov.bd/vaccine", desc: "শিশু ও প্রাপ্তবয়স্ক টিকা" },
      { name: "হাসপাতাল রেফারেল", icon: "🏥", url: "https://health.mygov.bd/hospital", desc: "রেফারেল চাওয়া" }
    ]
  }
];

// Render tools to page
function renderTools() {
  const container = document.getElementById('toolsContainer');
  container.innerHTML = '';

  toolsData.forEach(cat => {
    const wrapper = document.createElement('div');
    wrapper.className = 'tool-category';

    wrapper.innerHTML = `
      <div class="section-title">${cat.category}</div>
      <div class="section-sub">${cat.subtitle}</div>
      <div class="tools-grid"></div>
    `;

    const grid = wrapper.querySelector('.tools-grid');
    cat.tools.forEach(t => {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.innerHTML = `
        <i class="fa ${t.icon}" aria-hidden="true"></i>
        <h4>${t.name}</h4>
        <p>${t.desc}</p>
        <a class="use-btn" href="${t.url}" target="_blank" rel="noopener">Use Tool</a>
      `;
      grid.appendChild(card);
    });

    container.appendChild(wrapper);
  });
}

// Render freelancer services
function renderServices() {
  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = '';
  freelancerServices.forEach(s => {
    const card = document.createElement('div');
    card.className = 'service-card';
    let html = `<h4 style="color:var(--primary);margin-bottom:6px">${s.name}</h4>`;
    s.items.forEach(it => {
      html += `<div class="service-item"><strong>${it.icon} ${it.name}</strong><div style="font-size:0.92rem;color:var(--muted)"><a href="${it.url}" target="_blank" rel="noopener">${it.url}</a><div>${it.desc}</div></div></div>`;
    });
    card.innerHTML = html;
    grid.appendChild(card);
  });
}

// Local search + server search fallback
async function performSearch() {
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  if (!q) { alert('Please enter a search term'); return; }

  // Local search count
  let toolsFound = 0, servicesFound = 0;
  toolsData.forEach(cat => cat.tools.forEach(t => {
    if (t.name.toLowerCase().includes(q) || (t.desc && t.desc.toLowerCase().includes(q))) toolsFound++;
  }));
  freelancerServices.forEach(cat => cat.items.forEach(it => {
    if (it.name.toLowerCase().includes(q) || (it.desc && it.desc.toLowerCase().includes(q))) servicesFound++;
  }));

  alert(`Local: ${toolsFound} tools and ${servicesFound} services match "${q}"`);

  // Also send query to server for advanced search or AI suggestions
  try {
    const resp = await fetch('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    });
    const json = await resp.json();
    console.log('Server search response:', json);
  } catch (e) {
    console.error('Server search error', e);
  }
}

// Ask server to query OpenAI (server uses env var)
async function askAI(prompt) {
  if (!prompt || !prompt.trim()) return;
  try {
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const json = await res.json();
    if (json.status === 'success') {
      console.log('AI:', json.response);
      alert('AI: check console for response');
    } else {
      alert('AI error: ' + (json.message || 'unknown'));
    }
  } catch (err) {
    console.error(err);
    alert('Failed to call AI endpoint');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTools();
  renderServices();

  document.getElementById('searchButton').addEventListener('click', performSearch);
  document.getElementById('searchInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') performSearch();
  });
});
