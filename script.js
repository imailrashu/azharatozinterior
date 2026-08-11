const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (menu && links) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav') && links.classList.contains('open')) {
      links.classList.remove('open');
      links.setAttribute('aria-expanded', 'false');
    }
  });
}

const buttons = document.querySelectorAll('.filters button');
const cards = document.querySelectorAll('.showcase-card');
buttons.forEach(button => button.addEventListener('click', () => {
  buttons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  cards.forEach(card => {
    card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
  });
}));

const lightbox = document.querySelector('.lightbox');
const closeLightbox = document.querySelector('.lightbox button');
if (lightbox && closeLightbox) {
  closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  });
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });
}

document.querySelectorAll('.reveal').forEach(element => element.classList.add('show'));

// SEO: add a canonical URL and LocalBusiness structured data without changing the visual UI.
(() => {
  const canonicalUrl = 'https://www.azharatozinterior.com/';
  if (!document.querySelector('link[rel="canonical"]')) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    '@id': canonicalUrl + '#business',
    name: 'A to Z Interior',
    url: canonicalUrl,
    logo: canonicalUrl + 'logo-01.jpg',
    image: canonicalUrl + 'bedrooms-01.jpg',
    telephone: '+91-7044204914',
    description: 'A to Z Interior provides custom home interiors, modular kitchens, wardrobes, bedrooms, TV units, wall panels, furniture and renovation services in Kolkata.',
    foundingDate: '2016',
    areaServed: {
      '@type': 'City',
      name: 'Kolkata'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      addressCountry: 'IN'
    },
    serviceType: [
      'Home Interior Design',
      'Modular Kitchen Design',
      'Wardrobe Design',
      'Bedroom Interior Design',
      'TV Unit Design',
      'Wall Panel Design',
      'Custom Furniture'
    ]
  };
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify(structuredData);
  document.head.appendChild(schema);
})();

const SUPABASE_URL = 'https://brricholndptzcllwyuu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dSsFCcmOKvVa_GwEgD8pYA_CO1uVk6R';
const leadForm = document.getElementById('lead-form');
const formStatus = document.getElementById('form-status');
let supabaseClient = null;

if (window.supabase && SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

if (leadForm) {
  leadForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submitButton = leadForm.querySelector('button[type="submit"]');
    if (!supabaseClient) {
      formStatus.textContent = 'Online inquiry storage is unavailable. Please call or WhatsApp us.';
      formStatus.className = 'form-status error';
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    formStatus.textContent = '';
    const data = new FormData(leadForm);
    const lead = {
      name: data.get('name')?.trim(),
      phone: data.get('phone')?.trim(),
      email: data.get('email')?.trim() || null,
      service: data.get('service') || null,
      location: data.get('location')?.trim() || null,
      budget: data.get('budget') || null,
      message: data.get('message')?.trim() || null,
      source: 'azharatozinterior.com'
    };
    try {
      const { error } = await supabaseClient.from('client_leads').insert(lead);
      if (error) throw error;
      leadForm.reset();
      formStatus.textContent = 'Thank you! Your inquiry has been received. A to Z Interior will contact you soon.';
      formStatus.className = 'form-status success';
    } catch (error) {
      console.error('Lead submission error:', error);
      formStatus.textContent = 'Something went wrong. Please call or WhatsApp us.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Inquiry';
    }
  });
}
