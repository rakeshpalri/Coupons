document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const countdownElement = document.getElementById('countdown');
    const voucherStatusElement = document.getElementById('voucherStatus');

    // Channel Buttons & Sections
    const whatsappChannelBtn = document.getElementById('whatsappChannelBtn');
    const telegramChannelBtn = document.getElementById('telegramChannelBtn');
    const waChannelSection = document.getElementById('waChannelSection');
    const tgChannelSection = document.getElementById('tgChannelSection');

    // Share Section
    const whatsappShareButton = document.getElementById('whatsappShareButton');
    const shareTimerMessage = document.getElementById('shareTimerMessage');
    const shareCountDisplay = document.getElementById('shareCountDisplay');
    const shareLockSection = document.getElementById('shareLockSection');

    // Direct Link Section
    const directLinkSection = document.getElementById('directLinkSection');
    const visitSiteButton = document.getElementById('visitSiteButton');
    const visitSiteTimerDisplay = document.getElementById('visitSiteTimerDisplay');
    const visitSiteCountdownSpan = document.getElementById('visitSiteCountdown');
    const visitTimeRequiredDisplay = document.getElementById('visitTimeRequiredDisplay');

    // Spin Wheel Section
    const spinWheelContainer = document.getElementById('spinWheelContainer');
    const spinWheelTitle = document.getElementById('spinWheelTitle');
    const spinButton = document.getElementById('spinButton');
    const spinWheelCanvas = document.getElementById('spinWheelCanvas');
    const spinResult = document.getElementById('spinResult');
    const noWinMessage = document.getElementById('noWinMessage');
    const winnerSection = document.getElementById('winnerSection');
    const secretCodeInput = document.getElementById('secretCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const telegramSubmitLink = document.getElementById('telegramSubmitLink');

    // Cooldown Messages
    const spinCooldownMessage = document.getElementById('spinCooldownMessage');
    const spinCooldownTimerMain = document.getElementById('spinCooldownTimerMain');
    const spinCooldownTimerApology = document.getElementById('spinCooldownTimerApology');
    const spinCooldownTimerWinner = document.getElementById('spinCooldownTimerWinner');

    const voucherSection = document.getElementById('voucherSection');
    const regretMessage = document.getElementById('regretMessage');

    // --- Configuration Constants ---
    const WEBSITE_LINK = "https://coupons.rjsmartfinance.com";
    const WHATSAPP_CHANNEL_LINK = "https://chat.whatsapp.com/J78J3l7515D75E0"; // <--- Add your actual WhatsApp channel link here
    const TELEGRAM_ID_LINK = "https://t.me/rkdjat";
    const RAKSHA_BANDHAN_DATE = new Date('2025-08-19T00:00:00+05:30'); // Raksha Bandhan 2025 in IST
    const INITIAL_CLAIMED_VOUCHERS = 43;
    const TOTAL_VOUCHERS = 1000;
    const REQUIRED_SHARES = 5;
    const INITIAL_SHARE_BUTTON_WAIT_SEC = 3;
    const VISIT_SITE_REQUIRED_TIME_SEC = 30;
    const INITIAL_VISIT_BUTTON_WAIT_SEC = 5;
    const SPIN_COOLDOWN_HOURS = 24;

    // --- Local Storage Keys ---
    const LS_CLAIMED_VOUCHERS = 'claimedVouchers';
    const LS_WA_CHANNEL_JOINED = 'waChannelJoined';
    const LS_TG_CHANNEL_JOINED = 'tgChannelJoined';
    const LS_USER_SHARES = 'userShares';
    const LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP = 'shareButtonActivatedTimestamp';
    const LS_VISIT_STARTED_TIMESTAMP = 'visitStartedTimestamp';
    const LS_VISIT_COMPLETED = 'visitCompleted';
    const LS_LAST_SPIN_TIMESTAMP = 'lastSpinTimestamp';
    const LS_LAST_SPIN_WON_AMOUNT = 'lastSpinWonAmount';
    const LS_LAST_GENERATED_CODE = 'lastGeneratedCode';
    const LS_LAST_RESET_DATE = 'lastResetDate';

    // --- Variables for Timers/State ---
    let countdownIntervalId;
    let shareTimerIntervalId;
    let visitSiteTimerIntervalId;
    let spinCooldownIntervalId;
    let shareButtonWaitIntervalId;

    // --- Helper Function: Format Time for Display ---
    const formatTime = (seconds) => {
        if (seconds < 0) seconds = 0;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);
        return parts.join(' ');
    };

    // --- 1. Countdown Timer (Raksha Bandhan 2025) ---
    function updateCountdown() {
        const currentTime = Date.now();
        const timeLeft = RAKSHA_BANDHAN_DATE.getTime() - currentTime;

        if (timeLeft <= 0) {
            countdownElement.innerHTML = "Offer Ended!";
            clearInterval(countdownIntervalId);
            if (parseInt(localStorage.getItem(LS_CLAIMED_VOUCHERS)) < TOTAL_VOUCHERS) {
                voucherSection.classList.add('hidden');
                regretMessage.classList.remove('hidden');
            }
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}D ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }

    countdownIntervalId = setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 2. Simulated Urgency (Vouchers Claimed) with Daily Reset ---
    let claimedVouchers;
    let lastResetDate;

    const updateVoucherStatus = () => {
        const today = new Date().toLocaleDateString();
        lastResetDate = localStorage.getItem(LS_LAST_RESET_DATE);

        if (lastResetDate !== today) {
            claimedVouchers = INITIAL_CLAIMED_VOUCHERS;
            localStorage.setItem(LS_CLAIMED_VOUCHERS, claimedVouchers);
            localStorage.setItem(LS_LAST_RESET_DATE, today);

            localStorage.removeItem(LS_USER_SHARES);
            localStorage.removeItem(LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP);
            localStorage.removeItem(LS_VISIT_STARTED_TIMESTAMP);
            localStorage.removeItem(LS_VISIT_COMPLETED);
            localStorage.removeItem(LS_LAST_SPIN_TIMESTAMP);
            localStorage.removeItem(LS_LAST_SPIN_WON_AMOUNT);
            localStorage.removeItem(LS_LAST_GENERATED_CODE);

            // Important: Channel joins are typically permanent, so we don't reset these daily.
            // If you want them to reset daily, uncomment the lines below:
            // localStorage.removeItem(LS_WA_CHANNEL_JOINED);
            // localStorage.removeItem(LS_TG_CHANNEL_JOINED);

        } else {
            claimedVouchers = parseInt(localStorage.getItem(LS_CLAIMED_VOUCHERS)) || INITIAL_CLAIMED_VOUCHERS;
        }

        if (claimedVouchers >= TOTAL_VOUCHERS) {
            voucherStatusElement.textContent = `All ${TOTAL_VOUCHERS} Vouchers Claimed!`;
            voucherSection.classList.add('hidden');
            regretMessage.classList.remove('hidden');
            return true;
        } else {
            voucherStatusElement.textContent = `${claimedVouchers}/${TOTAL_VOUCHERS} Vouchers Claimed!`;
            return false;
        }
    };

    updateVoucherStatus();

    if (claimedVouchers < TOTAL_VOUCHERS) {
        setInterval(() => {
            if (claimedVouchers < TOTAL_VOUCHERS) {
                claimedVouchers += Math.floor(Math.random() * 3) + 1;
                if (claimedVouchers > TOTAL_VOUCHERS) claimedVouchers = TOTAL_VOUCHERS;
                localStorage.setItem(LS_CLAIMED_VOUCHERS, claimedVouchers);
                updateVoucherStatus();
            }
        }, Math.random() * (60000 - 30000) + 30000);
    }


    // --- Step 1: WhatsApp Channel Join Logic ---
    whatsappChannelBtn.addEventListener('click', (e) => {
        if (whatsappChannelBtn.disabled) {
            e.preventDefault();
            return;
        }

        // Open WhatsApp channel link in a new tab
        window.open(WHATSAPP_CHANNEL_LINK, '_blank');

        // Prompt user to confirm after they've had a chance to visit
        setTimeout(() => { // Give them a few seconds before the prompt
            const confirmed = confirm('Have you successfully joined our WhatsApp Channel? Click OK to confirm and proceed.');
            if (confirmed) {
                localStorage.setItem(LS_WA_CHANNEL_JOINED, 'true');
                alert('Thank you for joining our WhatsApp Channel! Now, please join our Telegram Channel.');
                updateUIBasedOnProgress(); // Re-evaluate and update UI
            } else {
                alert('Please join the WhatsApp Channel to proceed with the offer.');
                // Optionally, don't disable the button here if they click cancel
                // or keep it disabled and allow them to try again.
                // For simplicity, we'll just let them click again.
            }
        }, 1000); // Wait 1 second before prompting
    });

    // --- Step 2: Telegram Channel Join Logic ---
    telegramChannelBtn.addEventListener('click', (e) => {
        if (telegramChannelBtn.disabled) {
            e.preventDefault();
            return;
        }

        // Open Telegram channel link in a new tab
        window.open(TELEGRAM_ID_LINK, '_blank');

        setTimeout(() => { // Give them a few seconds before the prompt
            const confirmed = confirm('Have you successfully joined our Telegram Channel? Click OK to confirm and proceed.');
            if (confirmed) {
                localStorage.setItem(LS_TG_CHANNEL_JOINED, 'true');
                alert('Thank you for joining our Telegram Channel! You can now proceed to share the offer.');
                updateUIBasedOnProgress(); // Re-evaluate and update UI
            } else {
                alert('Please join the Telegram Channel to proceed with the offer.');
            }
        }, 1000); // Wait 1 second before prompting
    });


    // --- Step 3: WhatsApp Share Lock Logic ---
    shareCountDisplay.textContent = `Shares: ${parseInt(localStorage.getItem(LS_USER_SHARES)) || 0}/${REQUIRED_SHARES}`;

    const whatsappMessage = encodeURIComponent(`🎁 Raksha Bandhan Festival Special 🎉 \nGet Assured Shopping Vouchers Worth ₹50 to ₹500 💸 \nValid for Flipkart, Myntra, Ajio & More Brands! 🛍️ \n🎯 Limited Offer – First Come First Served \n✅ Claim Your Coupon Instantly: ${WEBSITE_LINK} \n#RakhiSale #FestivalDeals #CouponsIndia`);

    const startShareButtonCountdown = () => {
        clearInterval(shareButtonWaitIntervalId);
        whatsappShareButton.disabled = true;
        let shareButtonActivatedTimestamp = parseInt(localStorage.getItem(LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP)) || 0;
        let remainingWaitTime = INITIAL_SHARE_BUTTON_WAIT_SEC;

        if (shareButtonActivatedTimestamp > 0) {
            const elapsedTime = Math.floor((Date.now() - shareButtonActivatedTimestamp) / 1000);
            remainingWaitTime = Math.max(0, INITIAL_SHARE_BUTTON_WAIT_SEC - elapsedTime);
        } else {
            localStorage.setItem(LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP, Date.now());
        }

        if (remainingWaitTime > 0) {
            shareTimerMessage.innerHTML = `Please wait <span class="countdown-timer">${remainingWaitTime}</span> seconds before sharing...`;
            shareButtonWaitIntervalId = setInterval(() => {
                remainingWaitTime--;
                const countdownSpan = shareTimerMessage.querySelector('.countdown-timer');
                if (countdownSpan) {
                    countdownSpan.textContent = remainingWaitTime;
                }

                if (remainingWaitTime <= 0) {
                    clearInterval(shareButtonWaitIntervalId);
                    localStorage.removeItem(LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP);
                    shareTimerMessage.textContent = "Time to Share! Click the button below.";
                    whatsappShareButton.disabled = false;
                }
            }, 1000);
        } else {
            shareTimerMessage.textContent = "Time to Share! Click the button below.";
            whatsappShareButton.disabled = false;
        }
    };

    whatsappShareButton.addEventListener('click', () => {
        if (whatsappShareButton.disabled) {
            alert(`Please wait for the timer to finish before sharing!`);
            return;
        }

        let currentShares = parseInt(localStorage.getItem(LS_USER_SHARES)) || 0; // Ensure currentShares is up-to-date
        if (currentShares < REQUIRED_SHARES) {
            currentShares++;
            localStorage.setItem(LS_USER_SHARES, currentShares);
            shareCountDisplay.textContent = `Shares: ${currentShares}/${REQUIRED_SHARES}`;

            window.open(`https://api.whatsapp.com/send?text=${whatsappMessage}`, '_blank');

            if (currentShares === REQUIRED_SHARES) {
                alert(`Congratulations! You've completed ${REQUIRED_SHARES} shares. Now, proceed to the next step!`);
                updateUIBasedOnProgress();
            } else {
                alert(`Great! Keep sharing! You have ${REQUIRED_SHARES - currentShares} shares left.`);
            }
        }
    });

    // --- Step 4: Direct Link with Visit Logic ---
    if (visitTimeRequiredDisplay) {
        visitTimeRequiredDisplay.textContent = VISIT_SITE_REQUIRED_TIME_SEC;
    }

    const partnerSiteLink = "https://otieu.com/4/9557352"; // Define the partner site link here

    const startVisitTimer = () => {
        clearInterval(visitSiteTimerIntervalId);
        visitSiteTimerDisplay.classList.remove('hidden');
        visitSiteButton.disabled = true;

        let visitStartedTimestamp = parseInt(localStorage.getItem(LS_VISIT_STARTED_TIMESTAMP)) || 0;
        let visitCompleted = localStorage.getItem(LS_VISIT_COMPLETED) === 'true';

        if (visitStartedTimestamp === 0 || !visitCompleted) { // Check if visit hasn't started or wasn't completed
            visitStartedTimestamp = Date.now();
            localStorage.setItem(LS_VISIT_STARTED_TIMESTAMP, visitStartedTimestamp);
            window.open(partnerSiteLink, '_blank');
        }

        let currentVisitCountdown = Math.max(0, VISIT_SITE_REQUIRED_TIME_SEC - Math.floor((Date.now() - visitStartedTimestamp) / 1000));

        visitSiteCountdownSpan.textContent = currentVisitCountdown;
        visitSiteButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Visiting Site... ${currentVisitCountdown}s`;

        visitSiteTimerIntervalId = setInterval(() => {
            currentVisitCountdown--;
            // Update timestamp to keep track of elapsed time, even if user navigates away
            localStorage.setItem(LS_VISIT_STARTED_TIMESTAMP, Date.now() - (VISIT_SITE_REQUIRED_TIME_SEC - currentVisitCountdown) * 1000);

            visitSiteCountdownSpan.textContent = currentVisitCountdown;
            visitSiteButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Visiting Site... ${currentVisitCountdown}s`;

            if (currentVisitCountdown <= 0) {
                clearInterval(visitSiteTimerIntervalId);
                visitSiteTimerDisplay.textContent = "Timer Completed!";
                visitSiteButton.classList.add('unlocked');
                visitSiteButton.innerHTML = '<i class="fas fa-check-circle"></i> Site Visited! Spin Ready!';
                visitCompleted = true;
                localStorage.setItem(LS_VISIT_COMPLETED, 'true');
                localStorage.removeItem(LS_VISIT_STARTED_TIMESTAMP);
                alert('Great job! The Spin Wheel is now unlocked!');
                updateUIBasedOnProgress();
            }
        }, 1000);
    };

    visitSiteButton.addEventListener('click', () => {
        let visitCompleted = localStorage.getItem(LS_VISIT_COMPLETED) === 'true'; // Get latest state
        if (visitSiteButton.disabled) {
            alert(`Please wait for the button to activate or complete the previous step!`);
            return;
        }
        if (!visitCompleted && !visitSiteTimerIntervalId) { // Only start if not completed and timer not running
            startVisitTimer();
        } else if (visitCompleted) {
             alert("You've already completed this step! Proceed to the spin wheel.");
             updateUIBasedOnProgress();
        }
    });

    // --- Step 5: Spin-the-Wheel Coupon System ---
    const ctx = spinWheelCanvas.getContext('2d');
    const centerX = spinWheelCanvas.width / 2;
    const centerY = spinWheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const segments = [
        { text: '₹0', value: 0, color: '#f8d7da', probability: 0.9400 },
        { text: '₹50', value: 50, color: '#ffeeba', probability: 0.0300 },
        { text: '₹100', value: 100, color: '#d1ecf1', probability: 0.0100 },
        { text: '₹150', value: 150, color: '#d4edda', probability: 0.0050 },
        { text: '₹200', value: 200, color: '#cce5ff', probability: 0.0030 },
        { text: '₹250', value: 250, color: '#fbe4d9', probability: 0.0015 },
        { text: '₹300', value: 300, color: '#e2d3ed', probability: 0.0003 },
        { text: '₹400', value: 400, color: '#deeaf6', probability: 0.0001 },
        { text: '₹500', value: 500, color: '#fff0a5', probability: 0.0001 }
    ];

    let isSpinning = false;
    const spinDuration = 3000;

    function drawWheel() {
        ctx.clearRect(0, 0, spinWheelCanvas.width, spinWheelCanvas.height);
        const numSegments = segments.length;
        const segmentAngle = (2 * Math.PI) / numSegments;

        let startAngle = -Math.PI / 2;
        for (let i = 0; i < numSegments; i++) {
            const segment = segments[i];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#333';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(segment.text, radius - 20, 0);
            ctx.restore();

            startAngle += segmentAngle;
        }

        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY - radius - 15);
        ctx.lineTo(centerX + 10, centerY - radius - 15);
        ctx.lineTo(centerX, centerY - radius - 5);
        ctx.closePath();
        ctx.fillStyle = '#ff6f61';
        ctx.fill();
    }

    drawWheel();

    // --- Spin Cooldown Logic ---
    const checkSpinCooldown = () => {
        clearInterval(spinCooldownIntervalId);
        const lastSpinTimestamp = parseInt(localStorage.getItem(LS_LAST_SPIN_TIMESTAMP)) || 0;
        const currentTime = Date.now();
        const cooldownEndTime = lastSpinTimestamp + (SPIN_COOLDOWN_HOURS * 60 * 60 * 1000);
        let timeLeft = Math.floor((cooldownEndTime - currentTime) / 1000);

        const today = new Date().toLocaleDateString();
        const lastReset = localStorage.getItem(LS_LAST_RESET_DATE);

        if (lastReset !== today) {
             localStorage.removeItem(LS_LAST_SPIN_TIMESTAMP);
             localStorage.removeItem(LS_LAST_SPIN_WON_AMOUNT);
             localStorage.removeItem(LS_LAST_GENERATED_CODE);
             timeLeft = 0;
        }

        if (timeLeft > 0) {
            spinButton.disabled = true;
            spinButton.style.display = 'none';
            spinWheelCanvas.style.opacity = '0.5';
            spinWheelCanvas.style.pointerEvents = 'none';
            spinWheelTitle.textContent = "Come back later for another spin!";

            spinCooldownMessage.classList.remove('hidden');
            spinCooldownTimerMain.textContent = formatTime(timeLeft);
            noWinMessage.querySelector('.cooldown-instruction').classList.remove('hidden');
            noWinMessage.querySelector('#spinCooldownTimerApology').textContent = formatTime(timeLeft);
            winnerSection.querySelector('.cooldown-instruction').classList.remove('hidden');
            winnerSection.querySelector('#spinCooldownTimerWinner').textContent = formatTime(timeLeft);


            spinCooldownIntervalId = setInterval(() => {
                timeLeft--;
                spinCooldownTimerMain.textContent = formatTime(timeLeft);
                noWinMessage.querySelector('#spinCooldownTimerApology').textContent = formatTime(timeLeft);
                winnerSection.querySelector('#spinCooldownTimerWinner').textContent = formatTime(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(spinCooldownIntervalId);
                    localStorage.removeItem(LS_LAST_SPIN_TIMESTAMP);
                    localStorage.removeItem(LS_LAST_SPIN_WON_AMOUNT);
                    localStorage.removeItem(LS_LAST_GENERATED_CODE);
                    spinButton.disabled = false;
                    spinButton.style.display = 'block';
                    spinWheelCanvas.style.opacity = '1';
                    spinWheelCanvas.style.pointerEvents = 'auto';
                    spinWheelTitle.textContent = "It's Your Lucky Spin!";
                    spinCooldownMessage.classList.add('hidden');
                    noWinMessage.classList.add('hidden');
                    winnerSection.classList.add('hidden');
                    spinResult.textContent = '';
                    updateUIBasedOnProgress();
                }
            }, 1000);
            return true;
        } else {
            spinButton.disabled = false;
            spinButton.style.display = 'block';
            spinWheelCanvas.style.opacity = '1';
            spinWheelCanvas.style.pointerEvents = 'auto';
            spinWheelTitle.textContent = "It's Your Lucky Spin!";
            spinCooldownMessage.classList.add('hidden');
            noWinMessage.querySelector('.cooldown-instruction').classList.add('hidden');
            winnerSection.querySelector('.cooldown-instruction').classList.add('hidden');
            return false;
        }
    };


    spinButton.addEventListener('click', () => {
        if (isSpinning || spinButton.disabled) return;

        if (updateVoucherStatus()) {
            return;
        }

        isSpinning = true;
        spinButton.disabled = true;
        spinButton.style.display = 'none';
        spinResult.classList.add('hidden');
        winnerSection.classList.add('hidden');
        noWinMessage.classList.add('hidden');
        spinCooldownMessage.classList.add('hidden');

        let random = Math.random();
        let cumulativeProbability = 0;
        let winningSegment = null;
        const totalProbability = segments.reduce((sum, s) => sum + s.probability, 0);

        for (let i = 0; i < segments.length; i++) {
            cumulativeProbability += segments[i].probability / totalProbability;
            if (random <= cumulativeProbability) {
                winningSegment = segments[i];
                break;
            }
        }
        if (!winningSegment) winningSegment = segments[0];

        if (claimedVouchers >= TOTAL_VOUCHERS - 1) {
             winningSegment = segments.find(s => s.value === 0);
             if (!winningSegment) winningSegment = segments[0];
        } else if (winningSegment.value > 0) {
            claimedVouchers++;
            localStorage.setItem(LS_CLAIMED_VOUCHERS, claimedVouchers);
            updateVoucherStatus();
        }

        const winningSegmentIndex = segments.indexOf(winningSegment);
        const numSegments = segments.length;
        const singleSegmentDeg = 360 / numSegments;
        const targetCenterAngleFromCanvasZero = (winningSegmentIndex * singleSegmentDeg) + (singleSegmentDeg / 2);
        const revolutions = 5 + Math.floor(Math.random() * 3);
        const finalAngleInCanvasRef = (360 * revolutions) + (270 - targetCenterAngleFromCanvasZero);

        spinWheelCanvas.style.transition = `transform ${spinDuration / 1000}s ease-out`;
        spinWheelCanvas.style.transform = `rotate(${finalAngleInCanvasRef}deg)`;

        setTimeout(() => {
            isSpinning = false;
            spinButton.disabled = true;
            spinWheelCanvas.style.pointerEvents = 'none';
            spinWheelCanvas.style.opacity = '0.7';

            localStorage.setItem(LS_LAST_SPIN_TIMESTAMP, Date.now());
            localStorage.setItem(LS_LAST_SPIN_WON_AMOUNT, winningSegment.value);

            if (winningSegment.value > 0) {
                generateAndDisplayCode(winningSegment.value);
            } else {
                displayNoWinMessage();
            }
            checkSpinCooldown();

            spinWheelCanvas.style.transition = 'none';
        }, spinDuration);
    });

    // --- 6. Secret Code Generation & Auto-Copy / No Win Display ---
    function generateSecretCode(amount) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `RAKSHA${amount}-${result}`;
    }

    function displayNoWinMessage() {
        noWinMessage.classList.remove('hidden');
        winnerSection.classList.add('hidden');
        spinWheelCanvas.style.display = 'block';
        spinButton.style.display = 'none';
        spinResult.classList.add('hidden');
    }

    function generateAndDisplayCode(amount) {
        const code = generateSecretCode(amount);
        secretCodeInput.value = code;
        localStorage.setItem(LS_LAST_GENERATED_CODE, code);
        winnerSection.classList.remove('hidden');
        noWinMessage.classList.add('hidden');
        spinWheelCanvas.style.display = 'block';
        spinButton.style.display = 'none';
        spinResult.classList.add('hidden');

        secretCodeInput.select();
        secretCodeInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(secretCodeInput.value)
            .then(() => { /* silent success */ })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Could not auto-copy code. Please copy it manually from the box.');
            });

        telegramSubmitLink.href = `${TELEGRAM_ID_LINK}?text=${encodeURIComponent(`My Raksha Bandhan Voucher Code: ${code}. Please help me redeem this!`)}`;
    }

    copyCodeBtn.addEventListener('click', () => {
        secretCodeInput.select();
        secretCodeInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(secretCodeInput.value)
            .then(() => {
                alert('Code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Could not copy code. Please copy it manually.');
            });
    });

    // --- UI Update Based on Progress ---
    const updateUIBasedOnProgress = () => {
        // Clear all intervals
        clearInterval(shareTimerIntervalId);
        clearInterval(visitSiteTimerIntervalId);
        clearInterval(spinCooldownIntervalId);
        clearInterval(shareButtonWaitIntervalId);

        // Hide all action sections initially
        waChannelSection.classList.add('hidden');
        tgChannelSection.classList.add('hidden');
        shareLockSection.classList.add('hidden');
        directLinkSection.classList.add('hidden');
        spinWheelContainer.classList.add('hidden');
        noWinMessage.classList.add('hidden');
        winnerSection.classList.add('hidden');
        spinCooldownMessage.classList.add('hidden');

        // Check if all vouchers are claimed first
        if (updateVoucherStatus()) {
            return;
        }

        // --- Step 1 & 2: Channel Buttons State Update ---
        const waChannelJoined = localStorage.getItem(LS_WA_CHANNEL_JOINED) === 'true';
        const tgChannelJoined = localStorage.getItem(LS_TG_CHANNEL_JOINED) === 'true';

        if (waChannelJoined) {
            whatsappChannelBtn.disabled = true;
            whatsappChannelBtn.textContent = 'WhatsApp Channel Joined!';
            whatsappChannelBtn.classList.add('unlocked'); // Add visual cue
        } else {
            whatsappChannelBtn.disabled = false;
            whatsappChannelBtn.textContent = '<i class="fab fa-whatsapp"></i> Join WhatsApp Channel';
            whatsappChannelBtn.classList.remove('unlocked');
        }

        if (tgChannelJoined) {
            telegramChannelBtn.disabled = true;
            telegramChannelBtn.textContent = 'Telegram Channel Joined!';
            telegramChannelBtn.classList.add('unlocked'); // Add visual cue
        } else {
            telegramChannelBtn.disabled = true; // Still disabled by default, enabled by previous step
            telegramChannelBtn.textContent = '<i class="fab fa-telegram-plane"></i> Join Telegram Channel';
            telegramChannelBtn.classList.remove('unlocked');
        }
        // --- End Channel Buttons State Update ---


        const onCooldown = checkSpinCooldown();
        const currentShares = parseInt(localStorage.getItem(LS_USER_SHARES)) || 0;
        const visitCompleted = localStorage.getItem(LS_VISIT_COMPLETED) === 'true';
        const lastSpinWonAmount = parseInt(localStorage.getItem(LS_LAST_SPIN_WON_AMOUNT));
        const lastGeneratedCode = localStorage.getItem(LS_LAST_GENERATED_CODE);


        if (onCooldown) {
            spinWheelContainer.classList.remove('hidden');
            if (lastSpinWonAmount > 0) {
                secretCodeInput.value = lastGeneratedCode || '';
                winnerSection.classList.remove('hidden');
                spinResult.classList.add('hidden');
            } else if (lastSpinWonAmount === 0) {
                noWinMessage.classList.remove('hidden');
                spinResult.classList.add('hidden');
            } else {
                 spinResult.textContent = '';
                 spinResult.classList.add('hidden');
                 spinWheelCanvas.style.display = 'block';
                 spinWheelCanvas.style.opacity = '0.5';
                 spinWheelCanvas.style.pointerEvents = 'none';
                 spinWheelTitle.textContent = "Come back later for another spin!";
            }
        } else if (visitCompleted) { // Corrected variable name from userVisitCompleted
            spinWheelContainer.classList.remove('hidden');
            spinWheelCanvas.style.display = 'block';
            spinButton.style.display = 'block';
            spinButton.disabled = false;
            spinWheelCanvas.style.opacity = '1';
            spinWheelCanvas.style.pointerEvents = 'auto';
            spinResult.textContent = '';
        } else if (currentShares >= REQUIRED_SHARES) {
            directLinkSection.classList.remove('hidden');
            if (parseInt(localStorage.getItem(LS_VISIT_STARTED_TIMESTAMP)) > 0) {
                startVisitTimer();
            } else {
                let initialVisitWaitCounter = INITIAL_VISIT_BUTTON_WAIT_SEC;
                visitSiteButton.disabled = true;
                visitSiteButton.innerHTML = `Please wait ${initialVisitWaitCounter}s...`;
                const initialVisitWaitIntervalId = setInterval(() => {
                    initialVisitWaitCounter--;
                    visitSiteButton.innerHTML = `Please wait ${initialVisitWaitCounter}s...`;
                    if (initialVisitWaitCounter <= 0) {
                        clearInterval(initialVisitWaitIntervalId);
                        visitSiteButton.disabled = false;
                        visitSiteButton.innerHTML = `Click to Visit Site & Unlock Spin`;
                    }
                }, 1000);
            }
        } else if (tgChannelJoined) { // If Telegram is joined, show Share section
            shareLockSection.classList.remove('hidden');
            startShareButtonCountdown();
        } else if (waChannelJoined) { // If WhatsApp is joined, show Telegram section and enable Telegram button
            tgChannelSection.classList.remove('hidden');
            telegramChannelBtn.disabled = false;
        } else { // If neither is joined, show WhatsApp section and enable WhatsApp button
            waChannelSection.classList.remove('hidden');
            whatsappChannelBtn.disabled = false;
        }

        shareCountDisplay.textContent = `Shares: ${currentShares}/${REQUIRED_SHARES}`;
    };

    // Set initial states for buttons at the very start to avoid flashes
    whatsappChannelBtn.disabled = true;
    telegramChannelBtn.disabled = true;
    whatsappShareButton.disabled = true;
    visitSiteButton.disabled = true;
    spinButton.disabled = true;

    updateUIBasedOnProgress(); // Initial call to set the UI state
});
