/**
 * Dev.Kaike Portfolio — script.js v2
 * Mesmo DNA, código limpo e sem duplicações.
 */
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("loaded");
            document.body.classList.remove("no-scroll");
        }, 1000);
    }

    // ── 1. CURSOR ROXO ANIMADO ───────────────────────────────
    const isDesktop = window.matchMedia('(pointer: fine)').matches;

    if (isDesktop) {
        const dot    = document.createElement('div');
        const circle = document.createElement('div');
        dot.className    = 'custom-cursor-dot';
        circle.className = 'custom-cursor-circle';
        document.body.appendChild(dot);
        document.body.appendChild(circle);

        let mx = -100, my = -100;
        let cx = -100, cy = -100;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
        });

        // LERP suave para o círculo externo
        (function renderCursor() {
            cx += (mx - cx) * 0.14;
            cy += (my - cy) * 0.14;
            circle.style.transform = `translate3d(${cx}px,${cy}px,0)`;
            requestAnimationFrame(renderCursor);
        })();

        // Expansão ao passar em elementos interativos
        document.querySelectorAll('a, button, .card-custom, .skill-badge, .input-custom').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // ── 2. BOTÕES MAGNÉTICOS ─────────────────────────────
        document.querySelectorAll('.btn-primary, .btn-filter').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width  / 2) * 0.32;
                const y = (e.clientY - r.top  - r.height / 2) * 0.32;
                btn.style.transform = `translate3d(${x}px,${y}px,0)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0,0,0)';
            });
        });

        // ── 3. PALAVRAS MAGNÉTICAS (HERO) ────────────────────
        document.querySelectorAll('.floating-word').forEach(word => {
            word.style.transition = 'transform .4s cubic-bezier(0.16,1,0.3,1)';

            word.addEventListener('mousemove', e => {
                const r = word.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width  / 2)) * 0.45;
                const dy = (e.clientY - (r.top  + r.height / 2)) * 0.45;
                word.style.transform = `translate3d(${dx}px,${dy}px,0) rotate(${dx * 0.1}deg)`;
            });

            word.addEventListener('mouseleave', () => {
                word.style.transition = 'transform .8s cubic-bezier(0.25,1,0.5,1)';
                word.style.transform  = 'translate3d(0,0,0) rotate(0deg)';
            });
        });
    }

    // ── 4. SCROLL REVEAL ─────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('show-element');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.hidden-fade, .hidden-slide-left, .hidden-slide-right')
        .forEach(el => revealObserver.observe(el));

    // ── 5. FILTRO DE PROJETOS ────────────────────────────────
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

    // ── 6. FORMULÁRIO: CINEMATIC FOCUS + MORPHING BUTTON ────
    const form      = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitTxt = document.getElementById('submit-text');

    if (form) {
        // Focus mode — outros campos somem levemente
        const inputs = form.querySelectorAll('.input-custom');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                inputs.forEach(other => {
                    if (other === input) return;
                    other.style.opacity   = '0.35';
                    other.style.transform = 'scale(0.98)';
                });
            });
            input.addEventListener('blur', () => {
                inputs.forEach(other => {
                    other.style.opacity   = '1';
                    other.style.transform = 'scale(1)';
                });
            });
        });

        // Submit com morphing e partículas
        form.addEventListener('submit', e => {
            e.preventDefault();
            const originalText = submitTxt.textContent;

            // Loading
            submitBtn.classList.add('loading');

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                submitTxt.textContent = '✓ Mensagem Enviada!';
                fireParticles(submitBtn);

                setTimeout(() => {
                    form.reset();
                    submitBtn.classList.remove('success');
                    submitTxt.textContent = originalText;
                }, 4000);
            }, 2000);
        });
    }

    // ── 7. PARTÍCULAS DE SUCESSO ─────────────────────────────
    function fireParticles(btn) {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;

        for (let i = 0; i < 16; i++) {
            const p = document.createElement('div');
            p.className = 'success-particle';
            document.body.appendChild(p);
            p.style.left = `${cx}px`;
            p.style.top  = `${cy}px`;

            const angle = Math.random() * Math.PI * 2;
            const v     = 45 + Math.random() * 75;
            const tx    = Math.cos(angle) * v;
            const ty    = Math.sin(angle) * v - 20;

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

    // ── 8. ACTIVE NAV LINK NO SCROLL ────────────────────────
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const sections = document.querySelectorAll('section[id]');

    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.navbar .nav-link[href="#${entry.target.id}"]`);
            active?.classList.add('active');
        });
    }, { threshold: 0.45 }).observe && sections.forEach(s =>
        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(a => a.classList.remove('active'));
                document.querySelector(`.navbar .nav-link[href="#${entry.target.id}"]`)?.classList.add('active');
            });
        }, { threshold: 0.45 }).observe(s)
    );

});


// ==========================================================
        // 6. FORMULÁRIO: VALIDAÇÃO, API E BOTÃO MORPHING
        // ==========================================================
        const form = document.getElementById('contact-form');
        
        if (form) {
            const inputs = form.querySelectorAll('.input-custom');
            const submitBtn = form.querySelector('#submit-btn');
            const submitText = form.querySelector('#submit-text');
            const feedbackMsg = document.getElementById('form-feedback');

            // --- MÓDULO 1: FOCUS MODE (Escurece os outros campos) ---
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

            // --- MÓDULO 2: VALIDAÇÃO DE E-MAIL (Regex) ---
            function isValidEmail(email) {
                // Valida a estrutura real de um e-mail. 
                // Dica Sênior: Não bloqueie e-mails que não sejam apenas gmail/hotmail, 
                // pois recrutadores usam e-mails corporativos (ex: rh@empresa.com.br).
                // Este regex exige um formato válido: texto@texto.texto
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            }

            // --- MÓDULO 3: ENVIO VIA FETCH API (Web3Forms) ---
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                
                const nome = document.getElementById('form-nome').value.trim();
                const email = document.getElementById('form-email').value.trim();
                const mensagem = document.getElementById('form-mensagem').value.trim();

                // Reset de erros
                feedbackMsg.classList.add('d-none');
                feedbackMsg.innerText = '';

                // Validação Front-end
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

                // 1. Inicia Animação de Loading no Botão
                const originalWidth = submitBtn.offsetWidth;
                const originalText = submitText.innerHTML;
                
                submitBtn.style.width = `${submitBtn.offsetHeight}px`; 
                submitText.style.opacity = '0'; 
                submitBtn.style.borderRadius = '50px';
                submitBtn.style.pointerEvents = 'none'; 
                submitBtn.classList.add('btn-loading');

                // 2. Prepara o pacote de dados para a API
                const payload = {
                    access_key: '585fad95-1fee-47bc-a97e-c2526973b719', // VOCÊ VAI COLOCAR SUA CHAVE AQUI
                    subject: 'Novo Contato do Portfólio - ' + nome,
                    name: nome,
                    email: email,
                    message: mensagem
                };

                try {
                    // 3. Faz a requisição HTTP POST real para a API
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
                        // SUCESSO: Transforma o botão para verde
                        submitBtn.classList.remove('btn-loading');
                        submitBtn.style.width = `100%`;
                        submitBtn.style.backgroundColor = '#10b981'; 
                        submitBtn.style.color = '#fff';
                        submitText.innerHTML = 'Mensagem Enviada!';
                        submitText.style.opacity = '1';
                        
                        fireParticles(submitBtn); // Explode as partículas verdes

                        // Reseta após 4 segundos
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
                    // ERRO: Volta o botão e exibe falha
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.style.width = `100%`;
                    submitBtn.style.borderRadius = '';
                    submitBtn.style.pointerEvents = 'auto';
                    submitText.style.opacity = '1';
                    
                    feedbackMsg.innerText = 'Ocorreu um erro ao enviar. Tente me contatar diretamente por e-mail.';
                    feedbackMsg.classList.remove('d-none');
                }
            });

            // --- MÓDULO 4: FÍSICA DAS PARTÍCULAS ---
            function fireParticles(button) {
                const rect = button.getBoundingClientRect();
                for (let i = 0; i < 15; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'success-particle';
                    document.body.appendChild(particle);
                    
                    const startX = rect.left + rect.width / 2;
                    const startY = rect.top + rect.height / 2;
                    particle.style.left = `${startX}px`;
                    particle.style.top = `${startY}px`;
                    
                    const angle = Math.random() * Math.PI * 2;
                    const velocity = 40 + Math.random() * 80;
                    const tx = Math.cos(angle) * velocity;
                    const ty = Math.sin(angle) * velocity - 20;
                    
                    particle.animate([
                        { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
                        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
                    ], {
                        duration: 600 + Math.random() * 400,
                        easing: 'cubic-bezier(0, .9, .57, 1)'
                    });
                    
                    setTimeout(() => particle.remove(), 1000);
                }
            }
        }
