// Ecosistema Interactivo TaliDeCode - Canvas 2D
// Autor: Antigravity AI
// Animación de Personaje Corriendo / Saltando sobre Nodos 3D

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    // Cargar imagen de Tali
    const taliImg = new Image();
    taliImg.src = 'assets/images/tali_run.png';
    let taliLoaded = false;
    taliImg.onload = () => { taliLoaded = true; };

    // Redimensionar Canvas
    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Configuración de Nodos de Servicio (Coordenadas normalizadas 0 a 1)
    const nodeConfigs = [
        { nx: 0.12, ny: 0.60, type: 'cube', label: 'Web Dev', desc: 'React & Node.js', color: '#FF7BA5', glowColor: 'rgba(255, 123, 165, 0.4)' },
        { nx: 0.32, ny: 0.35, type: 'cylinder', label: 'Automatizaciones', desc: 'n8n & GHL', color: '#7BC4AA', glowColor: 'rgba(123, 196, 170, 0.4)' },
        { nx: 0.52, ny: 0.65, type: 'prism', label: 'Educación', desc: 'Talleres & Cursos', color: '#FFC83D', glowColor: 'rgba(255, 200, 61, 0.4)' },
        { nx: 0.72, ny: 0.40, type: 'hexagon', label: 'Mentorías', desc: 'Guía 1 a 1', color: '#6D7785', glowColor: 'rgba(109, 119, 133, 0.4)' },
        { nx: 0.88, ny: 0.60, type: 'sphere', label: 'Sistemas', desc: 'Ecosistemas CRM', color: '#FFB2C6', glowColor: 'rgba(255, 178, 198, 0.4)' }
    ];

    let nodes = [];
    const initNodes = () => {
        nodes = nodeConfigs.map(c => ({
            ...c,
            x: c.nx * width,
            y: c.ny * height,
            glow: 0, // Progreso del brillo (0 a 1)
            pulseScale: 1
        }));
    };
    initNodes();
    // Re-iniciar coordenadas de nodos en cada resize
    window.addEventListener('resize', initNodes);

    // Sistema de Partículas y Código Flotante
    const particles = [];
    const codeSnippets = ['</>', '{}', 'const', 'run()', '=>', 'data', 'await', 'let', 'import', '✨', '⭐'];
    
    const spawnParticles = (x, y, color) => {
        // Partículas circulares de luz
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                size: Math.random() * 3 + 2,
                color: color,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015,
                type: 'light'
            });
        }
        // Fragmentos de código
        for (let i = 0; i < 4; i++) {
            const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y - 10,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 1.2 - 0.8,
                text: text,
                color: '#F6F3E8',
                alpha: 1,
                decay: 0.01,
                size: Math.random() * 3 + 10, // Font size
                type: 'code'
            });
        }
    };

    // Parámetros de la personaje Tali
    const tali = {
        x: 0,
        y: 0,
        targetNodeIndex: 0,
        currentNodeIndex: 0,
        state: 'idle', // 'idle' o 'jumping' o 'warping'
        progress: 0,
        frame: 0,
        angle: 0,
        size: 55 // Tamaño del renderizado
    };

    // Inicializar posición de Tali sobre el primer nodo
    if (nodes.length > 0) {
        tali.x = nodes[0].x;
        tali.y = nodes[0].y;
    }

    // Parallax del mouse
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = (e.clientX - rect.left - rect.width / 2) * 0.08;
        mouse.targetY = (e.clientY - rect.top - rect.height / 2) * 0.08;
    });

    // Energía viajera a lo largo de las rutas
    const energyPulses = [];
    const spawnEnergyPulse = (startIndex, endIndex) => {
        energyPulses.push({
            startNode: nodes[startIndex],
            endNode: nodes[endIndex],
            progress: 0,
            speed: 0.025
        });
    };

    // Lógica de actualización principal
    let lastTime = 0;
    const update = (time) => {
        // Suavizado de parallax del mouse
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        tali.frame++;

        // Actualizar estados de Tali
        if (tali.state === 'idle') {
            const node = nodes[tali.currentNodeIndex];
            tali.x = node.x;
            // Bote suave mientras está parada
            tali.y = node.y - 35 - Math.abs(Math.sin(tali.frame * 0.15)) * 6;
            tali.angle = 0;

            // Permanecer 50 frames antes de saltar
            if (tali.frame > 50) {
                tali.state = 'jumping';
                tali.targetNodeIndex = (tali.currentNodeIndex + 1) % nodes.length;
                tali.progress = 0;
                tali.frame = 0;

                // Lanzar pulso de energía
                spawnEnergyPulse(tali.currentNodeIndex, tali.targetNodeIndex);
            }
        } 
        else if (tali.state === 'jumping') {
            tali.progress += 0.022; // velocidad del salto
            
            const start = nodes[tali.currentNodeIndex];
            const end = nodes[tali.targetNodeIndex];

            if (tali.targetNodeIndex === 0) {
                // Efecto de teletransporte (warping) digital para volver al inicio
                tali.state = 'warping';
                tali.progress = 0;
                tali.frame = 0;
            } else {
                // Trayectoria parabólica (Salto bezier cuadrático simple)
                const t = tali.progress;
                tali.x = start.x + (end.x - start.x) * t;
                
                // Parábola
                const jumpHeight = 110;
                tali.y = start.y + (end.y - start.y) * t - Math.sin(t * Math.PI) * jumpHeight - 35;
                
                // Rotación dinámica durante el vuelo
                tali.angle = (t - 0.5) * 0.5;

                if (t >= 1) {
                    tali.state = 'idle';
                    tali.currentNodeIndex = tali.targetNodeIndex;
                    tali.x = end.x;
                    tali.y = end.y - 35;
                    tali.frame = 0;

                    // Aterrizaje: Activar glow y emitir partículas
                    end.glow = 1.0;
                    spawnParticles(end.x, end.y - 15, end.color);
                }
            }
        }
        else if (tali.state === 'warping') {
            tali.progress += 0.05; // Teletransporte rápido
            const start = nodes[nodes.length - 1];
            const end = nodes[0];
            const t = tali.progress;

            tali.x = start.x + (end.x - start.x) * t;
            tali.y = start.y + (end.y - start.y) * t - 35;
            tali.angle = Math.sin(t * Math.PI * 2) * 0.2;

            // Spawnear partículas de estela en el trayecto
            if (Math.random() < 0.4) {
                particles.push({
                    x: tali.x,
                    y: tali.y + 15,
                    vx: 0,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 2 + 1.5,
                    color: '#FF7BA5',
                    alpha: 0.8,
                    decay: 0.05,
                    type: 'light'
                });
            }

            if (t >= 1) {
                tali.state = 'idle';
                tali.currentNodeIndex = 0;
                tali.x = end.x;
                tali.y = end.y - 35;
                tali.frame = 0;

                end.glow = 1.0;
                spawnParticles(end.x, end.y - 15, end.color);
            }
        }

        // Actualizar decaimiento del brillo de los nodos
        nodes.forEach(n => {
            if (n.glow > 0) n.glow -= 0.015;
            if (n.glow < 0) n.glow = 0;
        });

        // Actualizar pulsos de energía de las rutas
        for (let i = energyPulses.length - 1; i >= 0; i--) {
            const p = energyPulses[i];
            p.progress += p.speed;
            if (p.progress >= 1) {
                energyPulses.splice(i, 1);
            }
        }

        // Actualizar partículas
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    };

    // Funciones de dibujo de Nodos 3D
    const drawCube = (x, y, size, color, glow) => {
        const h = size * 0.6; // altura de caras
        
        ctx.save();
        ctx.translate(x, y);

        // Brillo inferior
        if (glow > 0) {
            ctx.shadowColor = color;
            ctx.shadowBlur = glow * 25;
        }

        // Cara izquierda
        ctx.fillStyle = adjustBrightness(color, -20);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size, -size * 0.5);
        ctx.lineTo(-size, -size * 0.5 + h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Cara derecha
        ctx.fillStyle = adjustBrightness(color, -40);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, -size * 0.5);
        ctx.lineTo(size, -size * 0.5 + h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Cara superior
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size, -size * 0.5);
        ctx.lineTo(0, -size);
        ctx.lineTo(size, -size * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    };

    const drawCylinder = (x, y, r, h, color, glow) => {
        ctx.save();
        ctx.translate(x, y);

        if (glow > 0) {
            ctx.shadowColor = color;
            ctx.shadowBlur = glow * 25;
        }

        // Cuerpo cara frontal/lateral
        const grad = ctx.createLinearGradient(-r, 0, r, 0);
        grad.addColorStop(0, adjustBrightness(color, -15));
        grad.addColorStop(0.5, color);
        grad.addColorStop(1, adjustBrightness(color, -45));
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.4, 0, 0, Math.PI);
        ctx.lineTo(r, -h);
        ctx.ellipse(0, -h, r, r * 0.4, 0, Math.PI, 0, true);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();

        // Cara superior (Tapa)
        ctx.fillStyle = adjustBrightness(color, 15);
        ctx.beginPath();
        ctx.ellipse(0, -h, r, r * 0.4, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    };

    const drawPrism = (x, y, size, color, glow) => {
        const h = size * 0.7; // altura
        ctx.save();
        ctx.translate(x, y);

        if (glow > 0) {
            ctx.shadowColor = color;
            ctx.shadowBlur = glow * 25;
        }

        // Cara izquierda
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(-size * 0.8, 0);
        ctx.lineTo(-size * 0.8, size * 0.3);
        ctx.lineTo(0, -h + size * 0.3);
        ctx.closePath();
        ctx.fill();

        // Cara derecha
        ctx.fillStyle = adjustBrightness(color, -30);
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(size * 0.8, 0);
        ctx.lineTo(size * 0.8, size * 0.3);
        ctx.lineTo(0, -h + size * 0.3);
        ctx.closePath();
        ctx.fill();

        // Base/Tapa superior en ángulo
        ctx.fillStyle = adjustBrightness(color, 20);
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(-size * 0.8, 0);
        ctx.lineTo(0, size * 0.2);
        ctx.lineTo(size * 0.8, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    };

    const drawHexagon = (x, y, size, color, glow) => {
        const h = size * 0.5;
        ctx.save();
        ctx.translate(x, y);

        if (glow > 0) {
            ctx.shadowColor = color;
            ctx.shadowBlur = glow * 25;
        }

        // Lados visibles tridimensionales
        // Lateral izquierdo
        ctx.fillStyle = adjustBrightness(color, -20);
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, -size * 0.25);
        ctx.lineTo(-size, 0);
        ctx.lineTo(-size, h);
        ctx.lineTo(-size * 0.5, -size * 0.25 + h);
        ctx.closePath();
        ctx.fill();

        // Lateral central izquierdo
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, -size * 0.25);
        ctx.lineTo(0, -size * 0.4);
        ctx.lineTo(0, -size * 0.4 + h);
        ctx.lineTo(-size * 0.5, -size * 0.25 + h);
        ctx.closePath();
        ctx.fill();

        // Lateral central derecho
        ctx.fillStyle = adjustBrightness(color, -10);
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.4);
        ctx.lineTo(size * 0.5, -size * 0.25);
        ctx.lineTo(size * 0.5, -size * 0.25 + h);
        ctx.lineTo(0, -size * 0.4 + h);
        ctx.closePath();
        ctx.fill();

        // Lateral derecho
        ctx.fillStyle = adjustBrightness(color, -35);
        ctx.beginPath();
        ctx.moveTo(size * 0.5, -size * 0.25);
        ctx.lineTo(size, 0);
        ctx.lineTo(size, h);
        ctx.lineTo(size * 0.5, -size * 0.25 + h);
        ctx.closePath();
        ctx.fill();

        // Cara superior plana
        ctx.fillStyle = adjustBrightness(color, 15);
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.4);
        ctx.lineTo(size * 0.5, -size * 0.25);
        ctx.lineTo(size, 0);
        ctx.lineTo(size * 0.5, size * 0.25);
        ctx.lineTo(0, size * 0.4);
        ctx.lineTo(-size * 0.5, size * 0.25);
        ctx.lineTo(-size, 0);
        ctx.lineTo(-size * 0.5, -size * 0.25);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    };

    const drawSphere = (x, y, r, color, glow) => {
        ctx.save();
        ctx.translate(x, y);

        if (glow > 0) {
            ctx.shadowColor = color;
            ctx.shadowBlur = glow * 25;
        }

        // Gradiente radial para simular volumen 3D
        const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, adjustBrightness(color, 20));
        grad.addColorStop(0.7, color);
        grad.addColorStop(1, adjustBrightness(color, -40));

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    };

    // Helper para oscurecer/aclarar colores HEX
    const adjustBrightness = (hex, percent) => {
        let num = parseInt(hex.replace("#",""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
    };

    // Renderizado completo de la escena
    const render = () => {
        ctx.clearRect(0, 0, width, height);

        // Dibujar Fondo Gradiente
        const bgGrad = ctx.createRadialGradient(width/2, height/2, 20, width/2, height/2, width/2);
        bgGrad.addColorStop(0, '#1c222b');
        bgGrad.addColorStop(1, '#111418');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Aplicar sutil desplazamiento del mouse (Parallax) en todo el lienzo
        ctx.save();
        ctx.translate(mouse.x, mouse.y);

        // 1. Dibujar conexiones (Líneas de red y rutas neón)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(109, 119, 133, 0.15)'; // color neutro apagado
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        for (let i = 0; i < nodes.length - 1; i++) {
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
        }
        ctx.stroke();
        ctx.setLineDash([]); // Resetear dash

        // Dibujar rutas neón activas que viajan
        energyPulses.forEach(p => {
            const x = p.startNode.x + (p.endNode.x - p.startNode.x) * p.progress;
            const y = p.startNode.y + (p.endNode.y - p.startNode.y) * p.progress;

            ctx.save();
            ctx.shadowColor = p.startNode.color;
            ctx.shadowBlur = 15;
            ctx.fillStyle = p.startNode.color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        });

        // 2. Dibujar Nodos 3D
        nodes.forEach(node => {
            const size = 30;
            switch(node.type) {
                case 'cube':
                    drawCube(node.x, node.y, size, node.color, node.glow);
                    break;
                case 'cylinder':
                    drawCylinder(node.x, node.y, size * 0.7, size * 0.9, node.color, node.glow);
                    break;
                case 'prism':
                    drawPrism(node.x, node.y, size * 0.8, node.color, node.glow);
                    break;
                case 'hexagon':
                    drawHexagon(node.x, node.y, size * 0.7, node.color, node.glow);
                    break;
                case 'sphere':
                    drawSphere(node.x, node.y, size * 0.7, node.color, node.glow);
                    break;
            }

            // Dibujar etiquetas de texto de los nodos (Glassmorphism sutil)
            ctx.save();
            ctx.font = "bold 11px 'Inter', sans-serif";
            ctx.fillStyle = node.glow > 0 ? node.color : 'rgba(246, 243, 232, 0.8)';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 35);
            
            // Subtexto / Descripción descriptiva del servicio
            ctx.font = "500 9px 'Inter', sans-serif";
            ctx.fillStyle = 'rgba(109, 119, 133, 0.6)';
            ctx.fillText(node.desc, node.x, node.y + 46);
            ctx.restore();
        });

        // 3. Dibujar Partículas y Fragmentos de Código
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            if (p.type === 'light') {
                ctx.shadowColor = p.color;
                ctx.shadowBlur = p.size * 2;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
                ctx.fill();
            } else if (p.type === 'code') {
                ctx.font = `${p.size}px 'Space Grotesk', monospace`;
                ctx.fillStyle = p.color;
                ctx.fillText(p.text, p.x, p.y);
            }
            ctx.restore();
        });

        // 4. Dibujar Personaje (Tali)
        if (taliLoaded) {
            ctx.save();
            ctx.translate(tali.x, tali.y);
            ctx.rotate(tali.angle);

            // Reflejo horizontal si Tali corre en sentido contrario (en este caso corre de izq a der, loop)
            // Sombra del personaje sobre el nodo/vacío
            ctx.save();
            ctx.scale(1, 0.15);
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.arc(0, 210, tali.size * 0.4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();

            // Dibujar imagen centrada
            ctx.drawImage(
                taliImg,
                -tali.size / 2,
                -tali.size / 2,
                tali.size,
                tali.size
            );

            ctx.restore();
        }

        ctx.restore(); // Restaurar translate del parallax
    };

    // Bucle de animación (60 FPS)
    const loop = (time) => {
        update(time);
        render();
        requestAnimationFrame(loop);
    };
    
    // Iniciar bucle
    requestAnimationFrame(loop);
});
