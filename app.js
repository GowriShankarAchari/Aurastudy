/**
 * AuraStudy - Modern Full-Screen Responsive Study Application Logic
 * Desktop Dashboard & Native Mobile Experience
 * Dynamic Date/Time, Reset Streak (0 Days), Reset Academic Schedule & Planner, Graphs & Subject Breakdown
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // Dynamic Live Date & Time Engine
  // ============================================================
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const currentDayOfWeek = dayNames[now.getDay()]; // e.g. Saturday
  const currentMonthName = monthNames[now.getMonth()]; // e.g. October
  const currentDayNum = now.getDate(); // e.g. 17
  const currentYear = now.getFullYear(); // e.g. 2026
  const activeSelectedDay = currentDayNum;

  function getTimeGreeting() {
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  const navbarGreeting = document.getElementById('navbarGreeting');
  const greetingSubtitle = document.getElementById('greetingSubtitle');

  function renderGreeting(userName) {
    const firstName = (userName || 'Alex').trim().split(' ')[0];
    const greetingStr = `${currentDayOfWeek}, ${currentMonthName.substring(0, 3)} ${currentDayNum} • ${getTimeGreeting()}, ${firstName}!`;
    if (navbarGreeting) navbarGreeting.textContent = greetingStr;
    if (greetingSubtitle) greetingSubtitle.textContent = greetingStr;
  }
  renderGreeting('Alex');

  const calendarTitle = document.getElementById('calendarTitle');
  if (calendarTitle) calendarTitle.textContent = `${currentMonthName} ${currentYear} Calendar`;

  const calendarSubLegend = document.getElementById('calendarSubLegend');
  if (calendarSubLegend) calendarSubLegend.innerHTML = `Upload study pic to strike off today <s>${currentDayNum}</s>`;

  // ============================================================
  // Audio Feedback System (Web Audio API - Zero Dependencies)
  // ============================================================
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playUiClickSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  function playShutterSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(900, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
      gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.08);

      setTimeout(() => {
        if (!audioCtx) return;
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(750, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.09);
        gain2.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.09);
      }, 70);
    } catch (e) {}
  }

  function playSuccessChime() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.09, audioCtx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.31);
      });
    } catch (e) {}
  }

  // Toast Notification Helper
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg, icon = '✨') {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    const iconEl = toastNotification.querySelector('.toast-icon');
    if (iconEl) iconEl.textContent = icon;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  // ============================================================
  // Confetti Particle Explosion
  // ============================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  let confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function triggerConfetti() {
    if (!confettiCanvas || !confettiCtx) return;
    resizeConfetti();
    confettiParticles = [];
    const colors = ['#F97316', '#FBBF24', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];

    for (let i = 0; i < 90; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 80,
        y: confettiCanvas.height * 0.5 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        life: 1
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

    function animateConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let active = false;

      confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98;
        p.rotation += p.rSpeed;
        p.life -= 0.012;

        if (p.life > 0) {
          active = true;
          confettiCtx.save();
          confettiCtx.translate(p.x, p.y);
          confettiCtx.rotate((p.rotation * Math.PI) / 180);
          confettiCtx.globalAlpha = p.life;
          confettiCtx.fillStyle = p.color;
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          confettiCtx.restore();
        }
      });

      if (active) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
      } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    animateConfetti();
  }

  // ============================================================
  // App State: RESET TO 0 (Fresh Streak, Empty Strike Days)
  // ============================================================
  let currentStreak = 0; // RESET: Starts at 0 Days!
  let todayPicUploaded = false;

  // RESET: Completed and striken-off days starts at empty (no days striken yet)
  const completedStrikenDays = new Set([]);

  // Study session logs
  const studyData = {
    [activeSelectedDay]: [
      { title: 'Biochemistry: Amino Acids & Peptides', time: 'Pending Upload 📸' }
    ]
  };

  // DOM Elements for Top Streak
  const streakDaysCount = document.getElementById('streakDaysCount');
  const streakStatusBadge = document.getElementById('streakStatusBadge');
  const dotToday = document.getElementById('dotToday');
  const profileStreakNum = document.getElementById('profileStreakNum');
  const profileNotesNum = document.getElementById('profileNotesNum');
  const flameIcon = document.getElementById('flameIcon');

  // ============================================================
  // Calendar Rendering with STRIKEN-OFF Days
  // ============================================================
  const calendarGrid = document.getElementById('calendarGrid');
  const dayStudyPreview = document.getElementById('dayStudyPreview');
  const previewDateLabel = document.getElementById('previewDateLabel');
  const dayPreviewList = document.getElementById('dayPreviewList');
  const closeDayPreview = document.getElementById('closeDayPreview');

  function renderCalendar() {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    const emptyLeadDays = 3;
    const totalDays = 31;

    for (let i = 0; i < emptyLeadDays; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day-cell empty';
      calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.dataset.day = day;

      // Active day (Today: 17)
      if (day === activeSelectedDay) {
        cell.classList.add('active-day');
      }

      // Check if day is completed / striken-off
      if (completedStrikenDays.has(day)) {
        cell.classList.add('day-striken');
      }

      const numSpan = document.createElement('span');
      numSpan.className = 'cal-day-num';
      numSpan.textContent = day;
      cell.appendChild(numSpan);

      // Completed check badge on today if striken
      if (day === activeSelectedDay && completedStrikenDays.has(day)) {
        const checkIcon = document.createElement('span');
        checkIcon.className = 'completed-badge-icon';
        checkIcon.textContent = '✓';
        cell.appendChild(checkIcon);
      }

      // Activity dot
      if (studyData[day] && completedStrikenDays.has(day)) {
        const dot = document.createElement('span');
        dot.className = 'study-dot';
        cell.appendChild(dot);
      }

      // Toggle strike-off or view details on click
      cell.addEventListener('click', () => {
        playUiClickSound();

        if (day === activeSelectedDay && !todayPicUploaded) {
          showToast('Snap a study pic to strike off today & start your streak! 📸', '🔥');
          openScannerModal();
          return;
        }

        document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('active-day'));
        cell.classList.add('active-day');
        openDayDetails(day);
      });

      calendarGrid.appendChild(cell);
    }
  }

  function openDayDetails(day) {
    if (!dayStudyPreview || !previewDateLabel || !dayPreviewList) return;
    const isStriken = completedStrikenDays.has(day);
    previewDateLabel.textContent = `${currentMonthName} ${day} • ${isStriken ? '✓ Completed (Striken Off)' : 'Study Logs'}`;
    dayPreviewList.innerHTML = '';

    const sessions = studyData[day];
    if (sessions && sessions.length > 0) {
      sessions.forEach(sess => {
        const item = document.createElement('div');
        item.className = 'day-session-item';
        item.innerHTML = `
          <span class="session-name">📖 ${sess.title}</span>
          <span class="session-duration">${sess.time}</span>
        `;
        dayPreviewList.appendChild(item);
      });
    } else {
      const emptyNote = document.createElement('div');
      emptyNote.className = 'day-session-item';
      emptyNote.style.color = '#94A3B8';
      emptyNote.textContent = 'No study sessions recorded for this day.';
      dayPreviewList.appendChild(emptyNote);
    }

    dayStudyPreview.classList.add('show');
  }

  if (closeDayPreview) {
    closeDayPreview.addEventListener('click', () => {
      playUiClickSound();
      dayStudyPreview.classList.remove('show');
    });
  }

  renderCalendar();

  // ============================================================
  // CAMERA UPLOAD & STREAK CONTINUATION WORKFLOW
  // ============================================================
  const scannerModal = document.getElementById('scannerModal');
  const btnCloseScanner = document.getElementById('btnCloseScanner');
  const btnCaptureDigitize = document.getElementById('btnCaptureDigitize');
  const captureBtnLabel = document.getElementById('captureBtnLabel');
  const scannerLaser = document.getElementById('scannerLaser');
  const digitizedResults = document.getElementById('digitizedResults');
  const scannerImgPreview = document.getElementById('scannerImgPreview');
  const demoFlashcard = document.getElementById('demoFlashcard');
  const fileInputUpload = document.getElementById('fileInputUpload');
  const chipSampleDesk = document.getElementById('chipSampleDesk');
  const chipSampleNotes = document.getElementById('chipSampleNotes');
  const btnToggleWebcam = document.getElementById('btnToggleWebcam');
  const webcamVideo = document.getElementById('webcamVideo');
  const btnSaveToLibrary = document.getElementById('btnSaveToLibrary');
  const btnExportPDF = document.getElementById('btnExportPDF');

  // Trigger elements
  const streakCard = document.getElementById('streakCard');
  const navCenterCamera = document.getElementById('navCenterCamera'); // Center mobile taskbar button
  const btnQuickCamera = document.getElementById('btnQuickCamera');   // Desktop header button
  const btnStreakUploadCTA = document.getElementById('btnStreakUploadCTA'); // Streak CTA

  let currentStream = null;
  let activeProofImageSrc = 'assets/study_proof_sample.jpg';

  function openScannerModal() {
    playUiClickSound();
    if (scannerModal) {
      scannerModal.classList.add('open');
      if (scannerLaser) scannerLaser.classList.add('scanning');
      if (digitizedResults) digitizedResults.style.display = 'none';
      if (captureBtnLabel) captureBtnLabel.textContent = todayPicUploaded ? 'Scan Another Note' : 'Snap & Start Streak!';
    }
  }

  function closeScannerModal() {
    playUiClickSound();
    stopWebcam();
    if (scannerModal) {
      scannerModal.classList.remove('open');
      if (scannerLaser) scannerLaser.classList.remove('scanning');
    }
  }

  function stopWebcam() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }
    if (webcamVideo) webcamVideo.style.display = 'none';
    if (scannerImgPreview) scannerImgPreview.style.display = 'block';
  }

  // Connect all Camera Triggers
  if (navCenterCamera) {
    navCenterCamera.addEventListener('click', (e) => {
      e.preventDefault();
      openScannerModal();
    });
  }
  if (btnQuickCamera) {
    btnQuickCamera.addEventListener('click', (e) => {
      e.preventDefault();
      openScannerModal();
    });
  }
  if (btnStreakUploadCTA) {
    btnStreakUploadCTA.addEventListener('click', (e) => {
      e.stopPropagation();
      openScannerModal();
    });
  }
  if (streakCard) streakCard.addEventListener('click', openScannerModal);
  if (btnCloseScanner) btnCloseScanner.addEventListener('click', closeScannerModal);

  if (scannerModal) {
    scannerModal.addEventListener('click', (e) => {
      if (e.target === scannerModal) closeScannerModal();
    });
  }

  // Sample Chips
  if (chipSampleDesk) {
    chipSampleDesk.addEventListener('click', () => {
      playUiClickSound();
      stopWebcam();
      document.querySelectorAll('.proof-sample-chip').forEach(c => c.classList.remove('active'));
      chipSampleDesk.classList.add('active');
      activeProofImageSrc = chipSampleDesk.dataset.src;
      scannerImgPreview.src = activeProofImageSrc;
      showToast('Loaded study desk & notebook photo', '📚');
    });
  }

  if (chipSampleNotes) {
    chipSampleNotes.addEventListener('click', () => {
      playUiClickSound();
      stopWebcam();
      document.querySelectorAll('.proof-sample-chip').forEach(c => c.classList.remove('active'));
      chipSampleNotes.classList.add('active');
      activeProofImageSrc = chipSampleNotes.dataset.src;
      scannerImgPreview.src = activeProofImageSrc;
      showToast('Loaded handwritten biology notes', '🧬');
    });
  }

  // Live Webcam Toggle
  if (btnToggleWebcam) {
    btnToggleWebcam.addEventListener('click', async () => {
      playUiClickSound();
      document.querySelectorAll('.proof-sample-chip').forEach(c => c.classList.remove('active'));
      btnToggleWebcam.classList.add('active');

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (webcamVideo) {
            webcamVideo.srcObject = currentStream;
            webcamVideo.style.display = 'block';
          }
          if (scannerImgPreview) scannerImgPreview.style.display = 'none';
          showToast('Live camera viewfinder connected 📹', '📷');
        } catch (err) {
          showToast('Camera access denied, using demo study photo', '⚠️');
          stopWebcam();
          chipSampleDesk.click();
        }
      } else {
        showToast('Webcam not supported in this browser, using demo photo', '⚠️');
        stopWebcam();
        chipSampleDesk.click();
      }
    });
  }

  // Upload study picture from user's device
  if (fileInputUpload && scannerImgPreview) {
    fileInputUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          stopWebcam();
          activeProofImageSrc = evt.target.result;
          scannerImgPreview.src = activeProofImageSrc;
          playUiClickSound();
          showToast('Custom study picture loaded! Ready to verify.', '📷');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // SNAP & START / CONTINUE STREAK ACTION
  if (btnCaptureDigitize) {
    btnCaptureDigitize.addEventListener('click', () => {
      playShutterSound();
      btnCaptureDigitize.disabled = true;
      btnCaptureDigitize.innerHTML = `<span>Verifying Study Proof...</span>`;

      setTimeout(() => {
        playSuccessChime();
        triggerConfetti();

        if (!todayPicUploaded) {
          todayPicUploaded = true;
          currentStreak = 1; // 0 -> 1 Day!

          // Strike off Day in calendar
          completedStrikenDays.add(activeSelectedDay);
          studyData[activeSelectedDay] = [
            { title: 'Biochemistry: Amino Acids & Peptides', time: '2h 15m' }
          ];
          renderCalendar();

          // Update Top Streak Display
          if (streakDaysCount) streakDaysCount.textContent = `${currentStreak} Day 🔥`;
          if (profileStreakNum) profileStreakNum.textContent = currentStreak;
          if (profileNotesNum) profileNotesNum.textContent = 1;
          if (streakStatusBadge) {
            streakStatusBadge.className = 'streak-status-badge completed';
            streakStatusBadge.textContent = 'Day 1 Complete! ✓';
          }
          if (dotToday) {
            dotToday.classList.add('completed');
          }
          if (flameIcon) {
            flameIcon.style.animation = 'flameBounce 0.8s infinite ease-in-out';
          }

          // Update Today's Study Checklist task #3
          if (miniChecklistTasks[2]) {
            miniChecklistTasks[2].done = true;
            renderMiniChecklist();
          }

          // Update Graphs (Saturday bar & Total hours)
          const analyticsTotalHours = document.getElementById('analyticsTotalHours');
          const analyticsDelta = document.getElementById('analyticsDelta');
          if (analyticsTotalHours) analyticsTotalHours.textContent = '2h 15m';
          if (analyticsDelta) {
            analyticsDelta.textContent = '+100% First Session Logged';
            analyticsDelta.style.background = '#DCFCE7';
            analyticsDelta.style.color = '#15803D';
          }

          const weeklyBarChart = document.getElementById('weeklyBarChart');
          if (weeklyBarChart) {
            const activeCol = weeklyBarChart.querySelector('.chart-col.active .chart-bar');
            const activeVal = weeklyBarChart.querySelector('.chart-col.active .bar-val');
            if (activeCol) activeCol.style.setProperty('--height', '52%');
            if (activeVal) activeVal.textContent = '2.2h';
          }

          // Update Subject Focus Breakdown
          const hrsBio = document.getElementById('hrsBio');
          const barBio = document.getElementById('barBio');
          const subjectBreakdownNote = document.getElementById('subjectBreakdownNote');
          if (hrsBio) hrsBio.textContent = '2.2h (100%)';
          if (barBio) barBio.style.width = '100%';
          if (subjectBreakdownNote) subjectBreakdownNote.textContent = '2.2h total logged this week • Great start!';
        }

        btnCaptureDigitize.disabled = false;
        btnCaptureDigitize.innerHTML = `
          <div class="shutter-circle-outer"><div class="shutter-circle-inner"></div></div>
          <span>Scan Another Study Pic</span>
        `;

        if (digitizedResults) {
          digitizedResults.style.display = 'block';
          digitizedResults.scrollIntoView({ behavior: 'smooth' });
        }

        showToast('🔥 1-Day Streak Started! Today striken off!', '🎉');
      }, 700);
    });
  }

  // Flip Flashcard interaction
  if (demoFlashcard) {
    demoFlashcard.addEventListener('click', () => {
      playUiClickSound();
      demoFlashcard.classList.toggle('flipped');
    });
  }

  if (btnSaveToLibrary) {
    btnSaveToLibrary.addEventListener('click', () => {
      playSuccessChime();
      showToast(`Saved to "Biochemistry Deck" • Day ${activeSelectedDay} Striken Off`, '💾');
      setTimeout(closeScannerModal, 600);
    });
  }

  if (btnExportPDF) {
    btnExportPDF.addEventListener('click', () => {
      playUiClickSound();
      showToast('Study streak proof exported to formatted PDF!', '📤');
    });
  }

  // ============================================================
  // Pomodoro Deep Study Focus Timer (RESET to 25:00)
  // ============================================================
  const dashboardTimerText = document.getElementById('dashboardTimerText');
  const btnDashboardTimerToggle = document.getElementById('btnDashboardTimerToggle');
  const btnDashboardTimerReset = document.getElementById('btnDashboardTimerReset');
  const timerPlayIcon = document.getElementById('timerPlayIcon');
  const timerSubtext = document.getElementById('timerSubtext');

  let pomodoroSeconds = 25 * 60; // 25:00 clean start
  let pomodoroRunning = false;
  let pomodoroInterval = null;

  function updatePomodoroDisplay() {
    const mins = Math.floor(pomodoroSeconds / 60);
    const secs = pomodoroSeconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (dashboardTimerText) dashboardTimerText.textContent = timeStr;
  }

  function togglePomodoro() {
    playUiClickSound();
    pomodoroRunning = !pomodoroRunning;
    if (timerPlayIcon) timerPlayIcon.textContent = pomodoroRunning ? '⏸ Pause' : '▶ Start Focus';
    if (timerSubtext) timerSubtext.textContent = pomodoroRunning ? 'Deep Focus block in progress...' : 'Ready for focus block';

    if (pomodoroRunning) {
      pomodoroInterval = setInterval(() => {
        if (pomodoroSeconds > 0) {
          pomodoroSeconds--;
          updatePomodoroDisplay();
        } else {
          clearInterval(pomodoroInterval);
          pomodoroRunning = false;
          if (timerPlayIcon) timerPlayIcon.textContent = '▶ Start Focus';
          if (timerSubtext) timerSubtext.textContent = 'Focus block completed! Take a 5m break';
          playSuccessChime();
          showToast('Pomodoro session completed! 25 minutes logged ☕', '🎉');
        }
      }, 1000);
    } else {
      clearInterval(pomodoroInterval);
    }
  }

  function resetPomodoro() {
    playUiClickSound();
    clearInterval(pomodoroInterval);
    pomodoroRunning = false;
    pomodoroSeconds = 25 * 60;
    updatePomodoroDisplay();
    if (timerPlayIcon) timerPlayIcon.textContent = '▶ Start Focus';
    if (timerSubtext) timerSubtext.textContent = 'Ready for focus block';
    showToast('Focus timer reset to 25:00', '⏱️');
  }

  if (btnDashboardTimerToggle) btnDashboardTimerToggle.addEventListener('click', togglePomodoro);
  if (btnDashboardTimerReset) btnDashboardTimerReset.addEventListener('click', resetPomodoro);

  // ============================================================
  // Today's Study Checklist Widget (RESET to 0/4 Done)
  // ============================================================
  const dashboardMiniChecklist = document.getElementById('dashboardMiniChecklist');
  const checklistProgressText = document.getElementById('checklistProgressText');

  const miniChecklistTasks = [
    { text: 'Review Biochemistry Amino Acids & Peptides', done: false },
    { text: 'Complete Calculus Practice Problem Set 1', done: false },
    { text: 'Upload daily study proof pic to start streak', done: false, isStreakProof: true },
    { text: 'Review 15 Organic Chemistry reaction flashcards', done: false }
  ];

  function renderMiniChecklist() {
    if (!dashboardMiniChecklist) return;
    dashboardMiniChecklist.innerHTML = '';
    let completedCount = 0;

    miniChecklistTasks.forEach((task, idx) => {
      if (task.done) completedCount++;
      const itemEl = document.createElement('div');
      itemEl.className = 'mini-check-item';
      itemEl.innerHTML = `
        <input type="checkbox" id="chk-mini-${idx}" ${task.done ? 'checked' : ''} data-idx="${idx}">
        <label for="chk-mini-${idx}" class="chk-text" style="${task.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}; cursor: pointer; flex: 1;">
          ${task.text}
        </label>
      `;

      const chk = itemEl.querySelector('input');
      chk.addEventListener('change', () => {
        playUiClickSound();
        task.done = chk.checked;
        if (task.done) {
          playSuccessChime();
          showToast(`Completed task: ${task.text.substring(0, 26)}...`, '✓');
        }
        renderMiniChecklist();
      });

      dashboardMiniChecklist.appendChild(itemEl);
    });

    if (checklistProgressText) {
      checklistProgressText.textContent = `${completedCount}/${miniChecklistTasks.length} Done`;
    }
  }
  renderMiniChecklist();

  // ============================================================
  // Daily Motivation Quotes System
  // ============================================================
  const quotes = [
    { text: '"The expert in anything was once a beginner."', author: 'Helen Hayes' },
    { text: '"Small daily efforts repeated without fail produce staggering results."', author: 'Robin Sharma' },
    { text: '"Focus on progress, not perfection. Every page conquered is a victory."', author: 'AuraStudy Mindset' },
    { text: '"Discipline is choosing between what you want now and what you want most."', author: 'Abraham Lincoln' },
    { text: '"You do not have to be great to start, but you have to start to be great."', author: 'Zig Ziglar' }
  ];

  let currentQuoteIdx = 0;
  const quoteEl = document.getElementById('motivationQuoteText');
  const btnShuffleQuote = document.getElementById('btnShuffleQuote');
  const btnSpeakQuote = document.getElementById('btnSpeakQuote');
  const btnCopyQuote = document.getElementById('btnCopyQuote');

  function renderQuote(idx) {
    if (!quoteEl) return;
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.textContent = quotes[idx].text;
      quoteEl.style.opacity = '1';
    }, 150);
  }

  if (btnShuffleQuote) {
    btnShuffleQuote.addEventListener('click', () => {
      playUiClickSound();
      currentQuoteIdx = (currentQuoteIdx + 1) % quotes.length;
      renderQuote(currentQuoteIdx);
    });
  }

  if (btnSpeakQuote) {
    btnSpeakQuote.addEventListener('click', () => {
      playUiClickSound();
      if ('speechSynthesis' in window) {
        const text = quotes[currentQuoteIdx].text;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
        showToast('Reading quote aloud...', '🔊');
      } else {
        showToast('Speech synthesis not supported in this browser', '⚠️');
      }
    });
  }

  if (btnCopyQuote) {
    btnCopyQuote.addEventListener('click', () => {
      playUiClickSound();
      const text = quotes[currentQuoteIdx].text;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Quote copied to clipboard!', '📋');
      }).catch(() => {
        showToast('Copied quote!', '📋');
      });
    });
  }

  // ============================================================
  // Unified Desktop & Mobile Navigation (Tabs Synchronization)
  // ============================================================
  const deskTabBtns = document.querySelectorAll('.desk-tab-btn');
  const navTabs = document.querySelectorAll('.nav-tab-item');
  const tabPages = document.querySelectorAll('.tab-page');

  function switchTab(targetTabId) {
    tabPages.forEach(p => p.classList.remove('active-tab'));
    deskTabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === targetTabId));
    navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === targetTabId));

    const activePage = document.getElementById(targetTabId);
    if (activePage) {
      activePage.classList.add('active-tab');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  deskTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiClickSound();
      switchTab(btn.dataset.tab);
    });
  });

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playUiClickSound();
      switchTab(tab.dataset.tab);
    });
  });

  // Avatar click navigates to profile tab
  const navAvatarTrigger = document.getElementById('navAvatarTrigger');
  const avatarTriggerMobile = document.getElementById('avatarTriggerMobile');
  if (navAvatarTrigger) {
    navAvatarTrigger.addEventListener('click', () => {
      playUiClickSound();
      switchTab('tabProfile');
    });
  }
  if (avatarTriggerMobile) {
    avatarTriggerMobile.addEventListener('click', () => {
      playUiClickSound();
      switchTab('tabProfile');
    });
  }

  // ============================================================
  // ACADEMIC SCHEDULE & PLANNER (RESET & DYNAMIC ENGINE)
  // ============================================================
  const scheduleList = document.getElementById('scheduleList');
  const tabDeadlinesList = document.getElementById('tabDeadlinesList');
  const dashboardDeadlinesList = document.getElementById('dashboardDeadlinesList');
  const badgeDeadlinesCount = document.getElementById('badgeDeadlinesCount');
  const btnNewStudyBlock = document.getElementById('btnNewStudyBlock');
  const btnResetPlanner = document.getElementById('btnResetPlanner');
  const btnAddMilestone = document.getElementById('btnAddMilestone');

  // RESET: Initial Schedule starts clean (empty)
  let defaultSchedule = [];

  // RESET: Initial Upcoming Deadlines starts clean (empty)
  let plannerDeadlines = [];

  function renderSchedule() {
    if (!scheduleList) return;
    scheduleList.innerHTML = '';

    if (defaultSchedule.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'empty-schedule-card';
      emptyCard.innerHTML = `
        <div class="empty-icon-circle">📅</div>
        <h4 class="empty-title">Your focus schedule is clear for today!</h4>
        <p class="empty-sub">Ready to plan? Click <strong>+ Add Focus Block</strong> above or load a preset study routine below.</p>
        <div class="empty-quick-actions">
          <button class="quick-preset-btn" id="btnLoadPreMedRoutine">⚡ Load Pre-Med Routine</button>
          <button class="quick-preset-btn" id="btnLoadExamPrepRoutine">🎯 Load Exam Prep Routine</button>
        </div>
      `;
      scheduleList.appendChild(emptyCard);

      const btnLoadPreMed = emptyCard.querySelector('#btnLoadPreMedRoutine');
      if (btnLoadPreMed) {
        btnLoadPreMed.addEventListener('click', () => {
          playSuccessChime();
          defaultSchedule = [
            { title: 'Biochemistry: Amino Acids & Peptides', time: '09:00 AM - 10:30 AM', done: false },
            { title: 'Calculus: Practice Problem Set 1', time: '11:00 AM - 12:30 PM', done: false },
            { title: 'Organic Chem: Functional Groups Flashcards', time: '02:00 PM - 03:00 PM', done: false },
            { title: 'History: Cold War Primary Sources', time: '04:30 PM - 06:00 PM', done: false }
          ];
          renderSchedule();
          showToast('Loaded Pre-Med study routine! 📚', '✓');
        });
      }

      const btnLoadExamPrep = emptyCard.querySelector('#btnLoadExamPrepRoutine');
      if (btnLoadExamPrep) {
        btnLoadExamPrep.addEventListener('click', () => {
          playSuccessChime();
          defaultSchedule = [
            { title: 'Cellular Biology: Mitochondria & ATP Synthesis', time: '08:30 AM - 10:30 AM', done: false },
            { title: 'Timed Practice Exam Section 1', time: '11:30 AM - 01:00 PM', done: false },
            { title: 'High-Yield Flashcard Review (100 Cards)', time: '03:00 PM - 04:30 PM', done: false }
          ];
          renderSchedule();
          showToast('Loaded Exam Prep study routine! 🎯', '✓');
        });
      }
      return;
    }

    defaultSchedule.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'schedule-item';
      el.innerHTML = `
        <input type="checkbox" id="sched-${idx}" ${item.done ? 'checked' : ''}>
        <div class="sched-details">
          <div class="sched-title" style="${item.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.title}</div>
          <div class="sched-time">${item.time}</div>
        </div>
        <button class="sched-delete-btn" title="Delete focus block" data-idx="${idx}">✕</button>
      `;

      const chk = el.querySelector('input');
      chk.addEventListener('change', () => {
        playUiClickSound();
        item.done = chk.checked;
        renderSchedule();
        if (item.done) {
          playSuccessChime();
          showToast('Focus block completed! Keep going! 🔥', '✓');
        }
      });

      const delBtn = el.querySelector('.sched-delete-btn');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playUiClickSound();
        defaultSchedule.splice(idx, 1);
        renderSchedule();
        showToast('Focus block removed', '🗑️');
      });

      scheduleList.appendChild(el);
    });
  }

  function renderDeadlines() {
    // 1. Render in Tab 2 (Planner view)
    if (tabDeadlinesList) {
      tabDeadlinesList.innerHTML = '';
      if (plannerDeadlines.length === 0) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'empty-deadlines-card';
        emptyCard.innerHTML = `
          <div class="empty-icon-circle">🎯</div>
          <h4 class="empty-title">No upcoming deadlines recorded</h4>
          <p class="empty-sub">Keep your exams, quizzes, and assignment submissions on track.</p>
          <div class="empty-quick-actions">
            <button class="add-deadline-btn" id="btnQuickAddDeadline">+ Add First Exam Deadline</button>
            <button class="quick-preset-btn" id="btnLoadSampleMilestones">+ Load Sample Milestones</button>
          </div>
        `;
        tabDeadlinesList.appendChild(emptyCard);

        const btnQuickAdd = emptyCard.querySelector('#btnQuickAddDeadline');
        if (btnQuickAdd) btnQuickAdd.addEventListener('click', promptAddMilestone);

        const btnLoadSample = emptyCard.querySelector('#btnLoadSampleMilestones');
        if (btnLoadSample) {
          btnLoadSample.addEventListener('click', () => {
            playSuccessChime();
            plannerDeadlines = [
              { title: 'Biochemistry Quiz 1', badge: 'In 7 Days • Oct 24', topics: 'Amino Acids, Protein Structure, Enzyme Kinetics', days: 7, urgent: true },
              { title: 'Midterm Exam Review', badge: 'In 14 Days • Oct 31', topics: 'Calculus, Organic Chem & Cellular Respiration', days: 14, urgent: false }
            ];
            renderDeadlines();
            showToast('Loaded sample academic milestones! 🎯', '✓');
          });
        }
      } else {
        plannerDeadlines.forEach((d, idx) => {
          const card = document.createElement('div');
          card.className = `deadline-card ${d.urgent ? 'urgent' : 'normal'}`;
          card.innerHTML = `
            <div class="deadline-left">
              <span class="deadline-badge ${d.urgent ? '' : 'blue'}">${d.badge}</span>
              <h4 class="deadline-title">${d.title}</h4>
              <p class="deadline-topics">${d.topics}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="deadline-countdown">
                <span class="count-num">${d.days}</span>
                <span class="count-unit">days</span>
              </div>
              <button class="deadline-delete-btn" title="Remove deadline" data-idx="${idx}">✕</button>
            </div>
          `;

          const delBtn = card.querySelector('.deadline-delete-btn');
          delBtn.addEventListener('click', () => {
            playUiClickSound();
            plannerDeadlines.splice(idx, 1);
            renderDeadlines();
            showToast('Deadline removed', '🗑️');
          });

          tabDeadlinesList.appendChild(card);
        });
      }
    }

    // 2. Render on Home Screen Dashboard Sidebar
    if (dashboardDeadlinesList) {
      dashboardDeadlinesList.innerHTML = '';
      if (badgeDeadlinesCount) {
        badgeDeadlinesCount.textContent = `${plannerDeadlines.length} Upcoming`;
      }

      if (plannerDeadlines.length === 0) {
        dashboardDeadlinesList.innerHTML = `
          <div class="deadline-mini-item" style="background: rgba(255,255,255,0.4); justify-content: center; padding: 12px;">
            <span style="font-size: 12px; color: var(--text-secondary); text-align: center;">No deadlines due soon • Schedule is clear ✨</span>
          </div>
        `;
      } else {
        plannerDeadlines.forEach(d => {
          const item = document.createElement('div');
          item.className = `deadline-mini-item ${d.urgent ? 'urgent' : ''}`;
          item.innerHTML = `
            <div class="d-info">
              <span class="d-tag ${d.urgent ? '' : 'blue'}">${d.badge}</span>
              <h4 class="d-name">${d.title}</h4>
            </div>
            <span class="d-hours">${d.days}d</span>
          `;
          dashboardDeadlinesList.appendChild(item);
        });
      }
    }
  }

  function promptAddMilestone() {
    playUiClickSound();
    const title = prompt('Enter Exam or Milestone Title:', 'Molecular Genetics Midterm');
    if (!title) return;
    const daysStr = prompt('Days remaining until deadline:', '10');
    const days = parseInt(daysStr, 10) || 7;
    const topics = prompt('Topics covered:', 'DNA Replication, Translation, CRISPR') || 'General Study Topics';
    const urgent = days <= 7;

    plannerDeadlines.push({
      title,
      badge: `In ${days} Days`,
      topics,
      days,
      urgent
    });
    renderDeadlines();
    showToast(`Added deadline "${title}"! 🎯`, '📅');
  }

  if (btnAddMilestone) {
    btnAddMilestone.addEventListener('click', promptAddMilestone);
  }

  if (btnNewStudyBlock) {
    btnNewStudyBlock.addEventListener('click', () => {
      playUiClickSound();
      const title = prompt('Enter Study Session Subject:', 'Cellular Biology Chapter 2');
      if (title) {
        const time = prompt('Enter Time Slot (e.g. 02:00 PM - 03:30 PM):', '02:00 PM - 03:30 PM') || 'Flexible Time';
        defaultSchedule.push({ title, time, done: false });
        renderSchedule();
        showToast(`Added "${title}" to your schedule!`, '📅');
      }
    });
  }

  if (btnResetPlanner) {
    btnResetPlanner.addEventListener('click', () => {
      playUiClickSound();
      defaultSchedule = [];
      plannerDeadlines = [];
      renderSchedule();
      renderDeadlines();
      showToast('Academic schedule and planner reset to clear state! 🔄', '✨');
    });
  }

  // Initial renders
  renderSchedule();
  renderDeadlines();

  // Study Target Hours slider (Tab 4: Profile)
  const goalHoursRange = document.getElementById('goalHoursRange');
  const targetHoursLabel = document.getElementById('targetHoursLabel');
  if (goalHoursRange && targetHoursLabel) {
    goalHoursRange.addEventListener('input', (e) => {
      targetHoursLabel.textContent = `${parseFloat(e.target.value).toFixed(1)} Hours/day`;
    });
  }

  // ============================================================
  // Atmosphere, Sound & Theme Controls
  // ============================================================
  const atmosphereSelect = document.getElementById('atmosphereSelect');
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeIcon = document.getElementById('themeIcon');

  if (atmosphereSelect) {
    atmosphereSelect.addEventListener('change', (e) => {
      playUiClickSound();
      const val = e.target.value;
      document.body.setAttribute('data-atmosphere', val);

      const labels = {
        midnight: '🌌 Midnight Library Atmosphere',
        sunrise: '🌅 Sunrise Aura Atmosphere',
        zen: '🌿 Zen Matcha Focus Atmosphere',
        cafe: '☕ Cozy Study Desk Atmosphere'
      };
      showToast(labels[val] || 'Atmosphere Updated ✨', '🎨');
    });
  }

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      showToast(soundEnabled ? 'Sound effects enabled' : 'Sound effects muted', soundEnabled ? '🔊' : '🔇');
    });
  }

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      playUiClickSound();
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeIcon.textContent = isDark ? '🌙' : '☀️';
      if (atmosphereSelect) {
        atmosphereSelect.value = isDark ? 'midnight' : 'sunrise';
        document.body.setAttribute('data-atmosphere', atmosphereSelect.value);
      }
      showToast(isDark ? 'Dark Theme / Midnight Library' : 'Light Theme / Sunrise Aura', isDark ? '🌙' : '☀️');
    });
  }

  // ============================================================
  // USER PROFILE & AUTHENTICATION ENGINE (LOGIN & PROFILE EDIT)
  // ============================================================
  const appRoot = document.querySelector('.aurastudy-app-root');

  const DEFAULT_USER = {
    name: 'Alex Johnson',
    email: 'alex.johnson@stanford.edu',
    university: 'Stanford University',
    gradYear: '2027',
    major: 'Pre-Med Track',
    bio: 'Aiming for 3.9 GPA • Focused on Bio & Chem',
    targetHours: 4.0,
    targetGpa: '3.9 GPA',
    avatar: 'assets/alex_avatar.jpg'
  };

  const DEMO_MAYA = {
    name: 'Maya Lin',
    email: 'maya.lin@mit.edu',
    university: 'MIT',
    gradYear: '2026',
    major: 'Computer Science',
    bio: 'Building neural systems • Daily deep code sessions',
    targetHours: 5.5,
    targetGpa: '4.0 GPA',
    avatar: 'assets/maya_avatar.jpg'
  };

  let currentUser = { ...DEFAULT_USER };

  function loadStoredUser() {
    try {
      const saved = localStorage.getItem('auraStudyUser');
      if (saved) {
        currentUser = Object.assign({}, DEFAULT_USER, JSON.parse(saved));
      }
    } catch (e) {
      currentUser = { ...DEFAULT_USER };
    }
  }

  function persistUser() {
    try {
      localStorage.setItem('auraStudyUser', JSON.stringify(currentUser));
    } catch (e) {}
  }

  function checkIsLoggedIn() {
    try {
      const val = localStorage.getItem('auraStudyIsLoggedIn');
      if (val !== null) return val === 'true';
    } catch (e) {}
    return false; // Default to showing login page on first run
  }

  function setLoginStatus(isLoggedIn) {
    try {
      localStorage.setItem('auraStudyIsLoggedIn', isLoggedIn ? 'true' : 'false');
    } catch (e) {}
    if (appRoot) {
      if (isLoggedIn) {
        appRoot.classList.remove('not-authenticated');
      } else {
        appRoot.classList.add('not-authenticated');
      }
    }
  }

  // Update all UI components across the application with current user profile
  function updateUserInterface(user) {
    if (!user) user = currentUser;

    renderGreeting(user.name);

    // Header Avatars
    const headerAvatar = document.getElementById('headerAvatar');
    if (headerAvatar) headerAvatar.src = user.avatar;

    const mobileAvatar = document.querySelector('#avatarTriggerMobile img');
    if (mobileAvatar) mobileAvatar.src = user.avatar;

    // Tab 4: Profile Tab
    const profileTabAvatar = document.getElementById('profileTabAvatar');
    if (profileTabAvatar) profileTabAvatar.src = user.avatar;

    const profileUserName = document.getElementById('profileUserName');
    if (profileUserName) profileUserName.textContent = user.name;

    const profileUserMajor = document.getElementById('profileUserMajor');
    if (profileUserMajor) {
      profileUserMajor.textContent = `${user.major} • ${user.university} ${user.gradYear}`;
    }

    const profileUserBio = document.getElementById('profileUserBio');
    if (profileUserBio) profileUserBio.textContent = user.bio;

    const profileGpaNum = document.getElementById('profileGpaNum');
    if (profileGpaNum) profileGpaNum.textContent = user.targetGpa || '3.9 GPA';

    const tabHeroSub = document.querySelector('#tabProfile .tab-hero-sub');
    if (tabHeroSub) {
      tabHeroSub.textContent = `${user.name} • ${user.major} • ${user.university} ${user.gradYear}`;
    }

    const targetHoursLabel = document.getElementById('targetHoursLabel');
    if (targetHoursLabel) {
      targetHoursLabel.textContent = `${parseFloat(user.targetHours).toFixed(1)} Hours/day`;
    }

    const goalHoursRange = document.getElementById('goalHoursRange');
    if (goalHoursRange) {
      goalHoursRange.value = user.targetHours;
    }
  }

  // Load and apply initial user state
  loadStoredUser();
  updateUserInterface(currentUser);

  // Apply initial login view state
  const initiallyLoggedIn = checkIsLoggedIn();
  setLoginStatus(initiallyLoggedIn);

  // ------------------------------------------------------------
  // 1. Auth Page Logic (Sign In, Create Account, Demo Profiles)
  // ------------------------------------------------------------
  const tabBtnSignIn = document.getElementById('tabBtnSignIn');
  const tabBtnSignUp = document.getElementById('tabBtnSignUp');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');

  if (tabBtnSignIn && tabBtnSignUp && signInForm && signUpForm) {
    tabBtnSignIn.addEventListener('click', () => {
      playUiClickSound();
      tabBtnSignIn.classList.add('active');
      tabBtnSignUp.classList.remove('active');
      signInForm.style.display = 'flex';
      signUpForm.style.display = 'none';
    });

    tabBtnSignUp.addEventListener('click', () => {
      playUiClickSound();
      tabBtnSignUp.classList.add('active');
      tabBtnSignIn.classList.remove('active');
      signUpForm.style.display = 'flex';
      signInForm.style.display = 'none';
    });
  }

  // Password Visibility Toggle
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const inputLoginPassword = document.getElementById('inputLoginPassword');
  if (btnTogglePassword && inputLoginPassword) {
    btnTogglePassword.addEventListener('click', () => {
      playUiClickSound();
      const isPass = inputLoginPassword.type === 'password';
      inputLoginPassword.type = isPass ? 'text' : 'password';
      btnTogglePassword.textContent = isPass ? '🙈' : '👁️';
    });
  }

  // Forgot Password Trigger
  const btnForgotPass = document.getElementById('btnForgotPass');
  if (btnForgotPass) {
    btnForgotPass.addEventListener('click', () => {
      playUiClickSound();
      const email = (document.getElementById('inputLoginEmail')?.value || '').trim() || currentUser.email;
      showToast(`Password reset email dispatched to ${email}! 📬`, '🔑');
    });
  }

  // 1-Click Demo Profile Logins
  const btnDemoAlex = document.getElementById('btnDemoAlex');
  if (btnDemoAlex) {
    btnDemoAlex.addEventListener('click', () => {
      playSuccessChime();
      currentUser = { ...DEFAULT_USER };
      persistUser();
      updateUserInterface(currentUser);
      setLoginStatus(true);
      triggerConfetti();
      showToast('Logged in as Alex Johnson (Pre-Med Track)! ✨', '🎓');
    });
  }

  const btnDemoMaya = document.getElementById('btnDemoMaya');
  if (btnDemoMaya) {
    btnDemoMaya.addEventListener('click', () => {
      playSuccessChime();
      currentUser = { ...DEMO_MAYA };
      persistUser();
      updateUserInterface(currentUser);
      setLoginStatus(true);
      triggerConfetti();
      showToast('Logged in as Maya Lin (Computer Science)! 💻', '🎓');
    });
  }

  // Guest Explorer Bypass
  const btnBypassGuest = document.getElementById('btnBypassGuest');
  if (btnBypassGuest) {
    btnBypassGuest.addEventListener('click', () => {
      playSuccessChime();
      setLoginStatus(true);
      showToast('Welcome Guest Scholar! Enjoy your study session ✨', '🚀');
    });
  }

  // Sign In Form Submission
  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('inputLoginEmail')?.value.trim();
      if (!email) return;

      playSuccessChime();
      if (email.toLowerCase().includes('maya')) {
        currentUser = { ...DEMO_MAYA };
      } else if (!email.toLowerCase().includes('alex')) {
        currentUser.email = email;
      }
      persistUser();
      updateUserInterface(currentUser);
      setLoginStatus(true);
      triggerConfetti();
      showToast(`Welcome back, ${currentUser.name.split(' ')[0]}! ✨`, '🎉');
    });
  }

  // Create Account Form Submission
  if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inputRegName')?.value.trim();
      const gradYear = document.getElementById('inputRegGradYear')?.value.trim() || '2027';
      const university = document.getElementById('inputRegUniversity')?.value.trim() || 'University';
      const major = document.getElementById('inputRegMajor')?.value.trim() || 'General Studies';
      const email = document.getElementById('inputRegEmail')?.value.trim();

      if (!name || !email) {
        showToast('Please fill in your name and email', '⚠️');
        return;
      }

      playSuccessChime();
      currentUser = {
        name,
        email,
        university,
        gradYear,
        major,
        bio: `${major} scholar • Aiming for academic excellence`,
        targetHours: 4.0,
        targetGpa: '3.9 GPA',
        avatar: 'assets/leo_avatar.jpg'
      };
      persistUser();
      updateUserInterface(currentUser);
      setLoginStatus(true);
      triggerConfetti();
      showToast(`Account created! Welcome to AuraStudy, ${name.split(' ')[0]}! 🚀`, '✨');
    });
  }

  // Sign Out / Switch Account Handlers
  function handleSignOut() {
    playUiClickSound();
    setLoginStatus(false);
    showToast('Signed out. See you next study session! 👋', '🔒');
  }

  const btnNavLogout = document.getElementById('btnNavLogout');
  if (btnNavLogout) btnNavLogout.addEventListener('click', handleSignOut);

  const btnProfileLogout = document.getElementById('btnProfileLogout');
  if (btnProfileLogout) btnProfileLogout.addEventListener('click', handleSignOut);


  // ------------------------------------------------------------
  // 2. Edit Profile Modal & Customizer Logic
  // ------------------------------------------------------------
  const editProfileModal = document.getElementById('editProfileModal');
  const btnCloseEditProfile = document.getElementById('btnCloseEditProfile');
  const btnCancelEditProfile = document.getElementById('btnCancelEditProfile');
  const editProfileForm = document.getElementById('editProfileForm');

  const editFullName = document.getElementById('editFullName');
  const editStudentEmail = document.getElementById('editStudentEmail');
  const editUniversity = document.getElementById('editUniversity');
  const editGradYear = document.getElementById('editGradYear');
  const editMajor = document.getElementById('editMajor');
  const editTargetGpa = document.getElementById('editTargetGpa');
  const editTargetHours = document.getElementById('editTargetHours');
  const editTargetHoursDisplay = document.getElementById('editTargetHoursDisplay');
  const editBio = document.getElementById('editBio');
  const editAvatarPreview = document.getElementById('editAvatarPreview');
  const customAvatarInput = document.getElementById('customAvatarInput');
  const presetAvatarBtns = document.querySelectorAll('#avatarPresetChips .preset-avatar-btn');

  let selectedAvatarSrc = currentUser.avatar;

  function openEditProfileModal() {
    playUiClickSound();
    if (!editProfileModal) return;

    // Pre-populate fields with current user data
    if (editFullName) editFullName.value = currentUser.name;
    if (editStudentEmail) editStudentEmail.value = currentUser.email;
    if (editUniversity) editUniversity.value = currentUser.university;
    if (editGradYear) editGradYear.value = currentUser.gradYear;
    if (editMajor) editMajor.value = currentUser.major;
    if (editTargetGpa) editTargetGpa.value = currentUser.targetGpa || '3.9 GPA';
    if (editTargetHours) {
      editTargetHours.value = currentUser.targetHours;
      if (editTargetHoursDisplay) {
        editTargetHoursDisplay.textContent = `${parseFloat(currentUser.targetHours).toFixed(1)} Hours/day`;
      }
    }
    if (editBio) editBio.value = currentUser.bio;

    selectedAvatarSrc = currentUser.avatar;
    if (editAvatarPreview) editAvatarPreview.src = selectedAvatarSrc;

    presetAvatarBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.src === selectedAvatarSrc);
    });

    editProfileModal.classList.add('open');
  }

  function closeEditProfileModal() {
    playUiClickSound();
    if (editProfileModal) editProfileModal.classList.remove('open');
  }

  // Triggers to open Edit Profile
  const btnOpenEditProfile = document.getElementById('btnOpenEditProfile');
  if (btnOpenEditProfile) btnOpenEditProfile.addEventListener('click', openEditProfileModal);

  const btnEditProfileCard = document.getElementById('btnEditProfileCard');
  if (btnEditProfileCard) btnEditProfileCard.addEventListener('click', openEditProfileModal);

  const btnNavEditProfile = document.getElementById('btnNavEditProfile');
  if (btnNavEditProfile) btnNavEditProfile.addEventListener('click', openEditProfileModal);

  const btnChangeAvatar = document.getElementById('btnChangeAvatar');
  if (btnChangeAvatar) btnChangeAvatar.addEventListener('click', openEditProfileModal);

  // Close triggers
  if (btnCloseEditProfile) btnCloseEditProfile.addEventListener('click', closeEditProfileModal);
  if (btnCancelEditProfile) btnCancelEditProfile.addEventListener('click', closeEditProfileModal);

  if (editProfileModal) {
    editProfileModal.addEventListener('click', (e) => {
      if (e.target === editProfileModal) closeEditProfileModal();
    });
  }

  // Range Slider live feedback in Edit Profile
  if (editTargetHours && editTargetHoursDisplay) {
    editTargetHours.addEventListener('input', (e) => {
      editTargetHoursDisplay.textContent = `${parseFloat(e.target.value).toFixed(1)} Hours/day`;
    });
  }

  // Preset Avatar Pickers
  presetAvatarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiClickSound();
      presetAvatarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAvatarSrc = btn.dataset.src;
      if (editAvatarPreview) editAvatarPreview.src = selectedAvatarSrc;
    });
  });

  // Custom Avatar Image File Upload
  if (customAvatarInput) {
    customAvatarInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          playSuccessChime();
          selectedAvatarSrc = loadEvt.target.result;
          if (editAvatarPreview) editAvatarPreview.src = selectedAvatarSrc;
          presetAvatarBtns.forEach(b => b.classList.remove('active'));
          showToast('Custom photo chosen! Click Save to apply. 📷', '✓');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Edit Profile Form Submit (Save Changes)
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSuccessChime();

      currentUser.name = (editFullName?.value || currentUser.name).trim();
      currentUser.email = (editStudentEmail?.value || currentUser.email).trim();
      currentUser.university = (editUniversity?.value || currentUser.university).trim();
      currentUser.gradYear = (editGradYear?.value || currentUser.gradYear).trim();
      currentUser.major = (editMajor?.value || currentUser.major).trim();
      currentUser.targetGpa = (editTargetGpa?.value || currentUser.targetGpa).trim();
      currentUser.targetHours = parseFloat(editTargetHours?.value) || currentUser.targetHours;
      currentUser.bio = (editBio?.value || currentUser.bio).trim();
      currentUser.avatar = selectedAvatarSrc || currentUser.avatar;

      persistUser();
      updateUserInterface(currentUser);
      closeEditProfileModal();
      triggerConfetti();
      showToast('Profile updated successfully! ✨', '✓');
    });
  }

});
