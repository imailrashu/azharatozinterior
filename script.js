const menu=document.querySelector('.menu-toggle');const links=document.querySelector('.nav-links');menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false')}));document.addEventListener('click',e=>{if(!e.target.closest('.nav')&&links.classList.contains('open')){links.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
document.querySelectorAll('img').forEach(img=>{img.addEventListener('error',()=>{img.style.display='none';console.warn('Missing image:',img.getAttribute('src'))})});
const buttons=document.querySelectorAll('.filters button');const imgs=document.querySelectorAll('.gallery img');const groups=document.querySelectorAll('.project-group');buttons.forEach(btn=>btn.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;imgs.forEach(img=>{img.style.display=f==='all'||img.dataset.category===f?'block':'none'});groups.forEach(group=>{group.classList.toggle('hidden',!(f==='all'||group.dataset.group===f))})}));
const lightbox=document.querySelector('.lightbox');const lightboxImg=document.querySelector('.lightbox img');document.querySelectorAll('.gallery img').forEach(img=>img.addEventListener('click',()=>{lightbox.classList.add('open');lightboxImg.src=img.src;lightboxImg.alt=img.alt}));document.querySelector('.lightbox button').addEventListener('click',()=>lightbox.classList.remove('open'));lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.classList.remove('open')});
const revealEls=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}})
  },{threshold:0.01,rootMargin:'0px 0px 160px 0px'});
  revealEls.forEach(el=>observer.observe(el));
}else{
  revealEls.forEach(el=>el.classList.add('show'));
}


// Supabase lead form setup
// Replace these two values with your Supabase Project URL and Anon Public Key.
const SUPABASE_URL = 'https://brricholndptzcllwyuu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dSsFCcmOKvVa_GwEgD8pYA_CO1uVk6R';

const leadForm = document.getElementById('lead-form');
const formStatus = document.getElementById('form-status');
let supabaseClient = null;

if (window.supabase && SUPABASE_URL.startsWith('https://') && !SUPABASE_ANON_KEY.includes('PASTE_')) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

if (leadForm) {
  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!supabaseClient) {
      formStatus.textContent = 'Supabase is not configured yet. Please add your project URL and anon key.';
      formStatus.className = 'form-status error';
      return;
    }

    const submitButton = leadForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const formData = new FormData(leadForm);
    const lead = {
      name: formData.get('name')?.trim(),
      phone: formData.get('phone')?.trim(),
      email: formData.get('email')?.trim() || null,
      service: formData.get('service') || null,
      location: formData.get('location')?.trim() || null,
      budget: formData.get('budget') || null,
      message: formData.get('message')?.trim() || null,
      source: 'azharatozinterior.com'
    };

    const { error } = await supabaseClient.from('client_leads').insert(lead);

    if (error) {
      console.error(error);
      formStatus.textContent = 'Something went wrong. Please call or WhatsApp us.';
      formStatus.className = 'form-status error';
    } else {
      leadForm.reset();
      formStatus.textContent = 'Thank you! Your inquiry has been received. A to Z Interior will contact you soon.';
      formStatus.className = 'form-status success';
    }

    submitButton.disabled = false;
    submitButton.textContent = 'Submit Inquiry';
  });
}
