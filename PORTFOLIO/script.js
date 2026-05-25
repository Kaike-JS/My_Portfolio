/**
 * Kaike_Dev Portfolio — Core Script Engine v3
 * Arquitetura modularizada, sem duplicações de escopo e otimizada para produção.
 */
document.addEventListener('DOMContentLoaded', () => {

    // ── 1. GESTÃO DO PRELOADER ──────────────────────────────────────────────
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("loaded");
            document.body.classList.remove("no-scroll");
        }, 1000);
    }

    // ── 2. SCROLL DINÂMICO PARA NAVBAR PREMIUM ──────────────────────────────
    const navbar = document.querySelector('.navbar');
    const navContainer = document.getElementById('nav-container');

    function checkScroll() {
        if (!navbar || !navContainer) return;
        
        if (window.scrollY > 40) {
            navbar.classList.add('nav-scrolled');
            if (window.innerWidth >= 992) {
                navContainer.classList.remove('py-lg-3');
                navContainer.classList.add('py-lg-2');
            }
        } else {
            navbar.classList.remove('nav-scrolled');
            if (window.innerWidth >= 992) {
                navContainer.classList.remove('py-lg-2');
                navContainer.classList.add('py-lg-3');
            }
        }
    }
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll();

    // ── 3. REVEAL EFFECT DIGITAL HACKER (LOGO) ──────────────────────────────
    const logo = document.querySelector('.glitch-logo');
    if (logo) {
        const chars = '01XYZ<>/_[]{}*#+$@';
        let originalText = logo.innerText;
        let logoInterval = null;

        logo.addEventListener('mouseover', () => {
            let iteration = 0;
            clearInterval(logoInterval);
            
            logoInterval = setInterval(() => {
                logo.innerText = originalText
                    .split("")
                    .map((char, index) => {
                        if(index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
                
                if(iteration >= originalText.length) {
                    clearInterval(logoInterval);
                }
                iteration += 1 / 3;
            }, 30);
        });
    }

    // ── 4. ACIONADORES HARDWARE-DEPENDENTES (DESKTOPap ONLY) ──────────────────
    const isDesktop = window.matchMedia('(pointer: fine)').matches;

    if (isDesktop) {
        // Cursor customizado com interpolação linear (LERP)
        const dot = document.createElement('div');
        const circle = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        circle.className = 'custom-cursor-circle';
        document.body.appendChild(dot);
        document.body.appendChild(circle);

        let mx = -100, my = -100;
        let cx = -100, cy = -100;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; 
            my = e.clientY;
            dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
        });

        (function renderCursor() {
            cx += (mx - cx) * 0.14;
            cy += (my - cy) * 0.14;
            circle.style.transform = `translate3d(${cx}px,${cy}px,0)`;
            requestAnimationFrame(renderCursor);
        })();

        // Efeito Hover nos elementos clicáveis
        document.querySelectorAll('a, button, .card-custom, .skill-badge, .input-custom, .spec-tab-btn').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Botões Magnéticos
        document.querySelectorAll('.btn-primary, .btn-filter, .theme-shifter-btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.32;
                const y = (e.clientY - r.top - r.height / 2) * 0.32;
                btn.style.transform = `translate3d(${x}px,${y}px,0)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0,0,0)';
            });
        });

        // Títulos Flutuantes Magnéticos (Hero)
        document.querySelectorAll('.floating-word').forEach(word => {
            word.style.transition = 'transform .4s cubic-bezier(0.16,1,0.3,1)';

            word.addEventListener('mousemove', e => {
                const r = word.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width / 2)) * 0.45;
                const dy = (e.clientY - (r.top + r.height / 2)) * 0.45;
                word.style.transform = `translate3d(${dx}px,${dy}px,0) rotate(${dx * 0.1}deg)`;
            });

            word.addEventListener('mouseleave', () => {
                word.style.transition = 'transform .8s cubic-bezier(0.25,1,0.5,1)';
                word.style.transform = 'translate3d(0,0,0) rotate(0deg)';
            });
        });
    }

    // ── 5. SCROLL REVEAL (INTERSECTION OBSERVER) ────────────────────────────
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('show-element');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.hidden-fade, .hidden-slide-left, .hidden-slide-right')
        .forEach(el => revealObserver.observe(el));

    // ── 6. FILTRO DINÂMICO DE PROJETOS ──────────────────────────────────────
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.project-item').forEach(item => {
                item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
            });
        });
    });

    // ── 7. INTERACTIVE BLUEPRINT TABS (PREVIEW VS TECH SPECS) ────────────────
    const specCards = document.querySelectorAll('.spec-card');
    specCards.forEach(card => {
        const tabButtons = card.querySelectorAll('.spec-tab-btn');
        const viewPanels = card.querySelectorAll('.view-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const requestedTab = button.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                viewPanels.forEach(panel => {
                    panel.classList.remove('active-panel');
                    if (panel.id.includes(requestedTab)) {
                        panel.classList.add('active-panel');
                    }
                });
            });
        });
    });

    // ── 8. CONTADOR DE ESTATÍSTICAS ANIMADO (HERO OUT EASING) ────────────────
    const statsElements = document.querySelectorAll('.hero-stat-num');
    if (statsElements.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const targetValue = parseInt(targetEl.getAttribute('data-target'), 10);
                    let startValue = 0;
                    const duration = 2000; 
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        if (elapsedTime < duration) {
                            const progress = elapsedTime / duration;
                            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                            
                            startValue = Math.floor(easeOutProgress * targetValue);
                            targetEl.textContent = startValue;
                            requestAnimationFrame(updateCounter);
                        } else {
                            targetEl.textContent = targetValue;
                        }
                    }
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(targetEl);
                }
            });
        }, { threshold: 0.3 });
        
        statsElements.forEach(el => statsObserver.observe(el));
    }

    // ── 9. COPIADOR ASÍNCRONO DE E-MAIL COM TOAST HUD TERMINAL ──────────────
    const emailTrigger = document.getElementById('copy-email-btn');
    if (emailTrigger) {
        let hudToast = document.querySelector('.hud-toast');
        if (!hudToast) {
            hudToast = document.createElement('div');
            hudToast.className = 'hud-toast';
            hudToast.innerHTML = `<span class="hud-prefix">[SYS]:</span> <span class="hud-content-msg"></span>`;
            document.body.appendChild(hudToast);
        }
        
        emailTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const emailAddress = "pedrokaike2x@gmail.com";
            
            navigator.clipboard.writeText(emailAddress).then(() => {
                hudToast.querySelector('.hud-content-msg').textContent = "E-mail copiado com sucesso!";
                hudToast.classList.add('active');
                
                fireParticles(emailTrigger);
                
                setTimeout(() => {
                    hudToast.classList.remove('active');
                }, 3500);
            }).catch(() => {
                window.location.href = `mailto:${emailAddress}`;
            });
        });
    }

    // ── 10. SELETOR DE ACCENT VARIÁVEL (MATRIX COLOR SHIFTER) ───────────────
    const accentBtn = document.getElementById('accent-toggle-btn');
    const themes = [
        { accent: '#a855f7', glow: 'rgba(168,85,247,0.35)', accent2: '#6366f1' }, // Purple Core
        { accent: '#00f2fe', glow: 'rgba(0,242,254,0.35)',  accent2: '#4facfe' }, // Cyber Cyan
        { accent: '#10b981', glow: 'rgba(16,185,129,0.35)',  accent2: '#059669' }, // Emerald Dev
        { accent: '#ff9f43', glow: 'rgba(255,159,67,0.35)',   accent2: '#ff5252' }  // Amber Industrial
    ];
    let currentThemeIndex = 0;
    
    if (accentBtn) {
        accentBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const nextTheme = themes[currentThemeIndex];
            
            document.documentElement.style.setProperty('--accent', nextTheme.accent);
            document.documentElement.style.setProperty('--accent-glow', nextTheme.glow);
            document.documentElement.style.setProperty('--accent2', nextTheme.accent2);
            
            accentBtn.style.transform = 'scale(0.85) rotate(45deg)';
            setTimeout(() => {
                accentBtn.style.transform = 'none';
            }, 200);
        });
    }

    // ── 11. ACTIVE NAVBAR LINK TRACKER (SPY SCROLL) ─────────────────────────
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const sections = document.querySelectorAll('section[id]');

    if(sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(a => a.classList.remove('active'));
                    const targetId = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.navbar .nav-link[href="#${targetId}"]`);
                    if(activeLink) activeLink.classList.add('active');
                }
            });
        }, { threshold: 0.45 });

        sections.forEach(s => sectionObserver.observe(s));
    }

    // ── 12. FORMULÁRIO DE CONTATO: FOCUS CINEMÁTICO & WEB3FORMS API ──────────
    const form = document.getElementById('contact-form');
    if (form) {
        const inputs = form.querySelectorAll('.input-custom');
        const submitBtn = document.getElementById('submit-btn');
        const submitText = document.getElementById('submit-text');
        const feedbackMsg = document.getElementById('form-feedback');

        // Focus Isolation Mode
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                inputs.forEach(other => {
                    if (other !== input) {
                        other.parentElement.style.opacity = '0.3';
                        other.parentElement.style.transform = 'scale(0.98)';
                    }
                });
                input.parentElement.style.opacity = '1';
                input.parentElement.style.transform = 'scale(1.02)';
            });

            input.addEventListener('blur', () => {
                inputs.forEach(other => {
                    other.parentElement.style.opacity = '1';
                    other.parentElement.style.transform = 'scale(1)';
                });
            });
        });

        // Email Pattern Validator
        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        // Async Form Pipeline
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const nome = document.getElementById('form-nome').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const mensagem = document.getElementById('form-mensagem').value.trim();

            feedbackMsg.classList.add('d-none');
            feedbackMsg.innerText = '';

            if (!nome || !email || !mensagem) {
                feedbackMsg.innerText = 'Por favor, preencha todos os campos.';
                feedbackMsg.classList.remove('d-none');
                return;
            }

            if (!isValidEmail(email)) {
                feedbackMsg.innerText = 'O formato do e-mail é inválido. Verifique e tente novamente.';
                feedbackMsg.classList.remove('d-none');
                return;
            }

            // Morphing Loading State
            const originalText = submitText.innerHTML;
            submitBtn.style.width = `${submitBtn.offsetHeight}px`; 
            submitText.style.opacity = '0'; 
            submitBtn.style.borderRadius = '50px';
            submitBtn.style.pointerEvents = 'none'; 
            submitBtn.classList.add('btn-loading');

            const payload = {
                access_key: '585fad95-1fee-47bc-a97e-c2526973b719',
                subject: 'Novo Contato do Portfólio - ' + nome,
                name: nome,
                email: email,
                message: mensagem
            };

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.status === 200) {
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.style.width = `100%`;
                    submitBtn.style.backgroundColor = '#10b981'; 
                    submitBtn.style.color = '#fff';
                    submitText.innerHTML = '✓ Mensagem Encadeada!';
                    submitText.style.opacity = '1';
                    
                    fireParticles(submitBtn);

                    setTimeout(() => {
                        form.reset();
                        submitBtn.style.backgroundColor = ''; 
                        submitBtn.style.borderRadius = '';
                        submitText.innerHTML = originalText;
                        submitBtn.style.pointerEvents = 'auto';
                    }, 4000);
                } else {
                    throw new Error(result.message);
                }

            } catch (error) {
                console.error('API Error Exception:', error);
                
                submitBtn.classList.remove('btn-loading');
                submitBtn.style.width = `100%`;
                submitBtn.style.borderRadius = '';
                submitBtn.style.pointerEvents = 'auto';
                submitText.style.opacity = '1';
                submitText.innerHTML = originalText;
                
                feedbackMsg.innerText = 'Erro na transmissão: ' + error.message; 
                feedbackMsg.classList.remove('d-none');
            }
        });
    }

    // ── 13. ENGINE DE FÍSICA DE PARTÍCULAS (GLOBAL) ─────────────────────────
    function fireParticles(targetButton) {
        const rect = targetButton.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (let i = 0; i < 16; i++) {
            const p = document.createElement('div');
            p.className = 'success-particle';
            document.body.appendChild(p);
            p.style.left = `${cx}px`;
            p.style.top = `${cy}px`;

            const angle = Math.random() * Math.PI * 2;
            const v = 45 + Math.random() * 75;
            const tx = Math.cos(angle) * v;
            const ty = Math.sin(angle) * v - 20;

            p.animate([
                { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'cubic-bezier(0,.9,.57,1)'
            });

            setTimeout(() => p.remove(), 1100);
        }
    }

});
