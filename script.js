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
    const WEBSITE_LINK = "https://coupons.rjsmartfinance.com"; // Your website link
    const WHATSAPP_CHANNEL_LINK = "https://chat.whatsapp.com/J78J3l7515D75E0"; // <-- IMPORTANT: Replace with your ACTUAL WhatsApp channel invite link
    const TELEGRAM_ID_LINK = "https://t.me/rkdjat"; // Your Telegram ID or channel link for redemption
    const RAKSHA_BANDHAN_DATE = new Date('2025-08-19T00:00:00+05:30'); // Raksha Bandhan 2025 in IST (Aug 19)
    const INITIAL_CLAIMED_VOUCHERS = 43; // Starting count of claimed vouchers each day
    const TOTAL_VOUCHERS = 1000; // Total vouchers available for the day
    const REQUIRED_SHARES = 5; // Number of WhatsApp shares required
    const INITIAL_SHARE_BUTTON_WAIT_SEC = 3; // Initial wait time for share button to activate
    const VISIT_SITE_REQUIRED_TIME_SEC = 30; // Time user must spend on partner site
    const INITIAL_VISIT_BUTTON_WAIT_SEC = 5; // Initial wait time for visit site button to activate
    const SPIN_COOLDOWN_HOURS = 24; // Cooldown period for spinning again

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
    const LS_LAST_RESET_DATE = 'lastResetDate'; // Key to track last daily reset

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
            // If offer ended and vouchers are still available, show regret message
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
    updateCountdown(); // Initial call to display immediately

    // --- 2. Simulated Urgency (Vouchers Claimed) with Daily Reset ---
    let claimedVouchers; // Declared here, value set in updateVoucherStatus
    let lastResetDate; // Declared here, value set in updateVoucherStatus

    const updateVoucherStatus = () => {
        const today = new Date().toLocaleDateString(); // Gets today's date string (e.g., "7/12/2025")
        lastResetDate = localStorage.getItem(LS_LAST_RESET_DATE);

        if (lastResetDate !== today) {
            // New day, reset vouchers and user progress for daily re-engagement
            claimedVouchers = INITIAL_CLAIMED_VOUCHERS;
            localStorage.setItem(LS_CLAIMED_VOUCHERS, claimedVouchers);
            localStorage.setItem(LS_LAST_RESET_DATE, today);

            // Reset only the steps that should be done daily
            localStorage.removeItem(LS_USER_SHARES);
            localStorage.removeItem(LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP);
            localStorage.removeItem(LS_VISIT_STARTED_TIMESTAMP);
            localStorage.removeItem(LS_VISIT_COMPLETED);
            localStorage.removeItem(LS_LAST_SPIN_TIMESTAMP); // Allows new spin
            localStorage.removeItem(LS_LAST_SPIN_WON_AMOUNT);
            localStorage.removeItem(LS_LAST_GENERATED_CODE);

            // Important: Channel joins (WA, TG) are typically one-time.
            // DO NOT uncomment these unless you want users to rejoin channels daily:
            // localStorage.removeItem(LS_WA_CHANNEL_JOINED);
            // localStorage.removeItem(LS_TG_CHANNEL_JOINED);

        } else {
            // Same day, retrieve current claimed vouchers
            claimedVouchers = parseInt(localStorage.getItem(LS_CLAIMED_VOUCHERS)) || INITIAL_CLAIMED_VOUCHERS;
        }

        if (claimedVouchers >= TOTAL_VOUCHERS) {
            voucherStatusElement.textContent = `All ${TOTAL_VOUCHERS} Vouchers Claimed!`;
            voucherSection.classList.add('hidden');
            regretMessage.classList.remove('hidden');
            return true; // Vouchers are fully claimed
        } else {
            voucherStatusElement.textContent = `${claimedVouchers}/${TOTAL_VOUCHERS} Vouchers Claimed!`;
            return false; // Vouchers are still available
        }
    };

    // Initialize claimedVouchers and check for daily reset on load
    updateVoucherStatus();

    // Start simulation only if vouchers are available (after potential daily reset)
    if (claimedVouchers < TOTAL_VOUCHERS) {
        setInterval(() => {
            if (claimedVouchers < TOTAL_VOUCHERS) {
                claimedVouchers += Math.floor(Math.random() * 3) + 1; // Increase by 1-3 randomly
                if (claimedVouchers > TOTAL_VOUCHERS) claimedVouchers = TOTAL_VOUCHERS;
                localStorage.setItem(LS_CLAIMED_VOUCHERS, claimedVouchers);
                updateVoucherStatus(); // Call to update UI and re-check limits
            }
        }, Math.random() * (60000 - 30000) + 30000); // Update every 30-60 seconds
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
        setTimeout(() => {
            const confirmed = confirm('Have you successfully joined our WhatsApp Channel? Click OK to confirm and proceed.');
            if (confirmed) {
                localStorage.setItem(LS_WA_CHANNEL_JOINED, 'true');
                alert('Thank you for joining our WhatsApp Channel! Now, please join our Telegram Channel.');
                updateUIBasedOnProgress(); // Re-evaluate and update UI
            } else {
                alert('Please join the WhatsApp Channel to proceed with the offer.');
                // User can click the button again if they didn't join
            }
        }, 1000); // Wait 1 second before prompting to give user time to switch to WA
    });

    // --- Step 2: Telegram Channel Join Logic ---
    telegramChannelBtn.addEventListener('click', (e) => {
        if (telegramChannelBtn.disabled) {
            e.preventDefault();
            return;
        }

        // Open Telegram channel link in a new tab
        window.open(TELEGRAM_ID_LINK, '_blank');

        setTimeout(() => {
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
    const whatsappMessage = encodeURIComponent(`🎁 Raksha Bandhan Festival Special 🎉 \nGet Assured Shopping Vouchers Worth ₹50 to ₹500 💸 \nValid for Flipkart, Myntra, Ajio & More Brands! 🛍️ \n🎯 Limited Offer – First Come First Served \n✅ Claim Your Coupon Instantly: ${WEBSITE_LINK} \n#RakhiSale #FestivalDeals #CouponsIndia`);

    const startShareButtonCountdown = () => {
        clearInterval(shareButtonWaitIntervalId);
        whatsappShareButton.disabled = true; // Disable until countdown finishes
        let shareButtonActivatedTimestamp = parseInt(localStorage.getItem(LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP)) || 0;
        let remainingWaitTime = INITIAL_SHARE_BUTTON_WAIT_SEC;

        // If a timestamp exists, calculate remaining time
        if (shareButtonActivatedTimestamp > 0) {
            const elapsedTime = Math.floor((Date.now() - shareButtonActivatedTimestamp) / 1000);
            remainingWaitTime = Math.max(0, INITIAL_SHARE_BUTTON_WAIT_SEC - elapsedTime);
        } else {
            // No timestamp, so set one for the first time
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
                    localStorage.removeItem(LS_SHARE_BUTTON_ACTIVATED_TIMESTAMP); // Clear timestamp once activated
                    shareTimerMessage.textContent = "Time to Share! Click the button below.";
                    whatsappShareButton.disabled = false; // Enable button
                }
            }, 1000);
        } else {
            // No wait time needed, enable immediately
            shareTimerMessage.textContent = "Time to Share! Click the button below.";
            whatsappShareButton.disabled = false;
        }
    };

    whatsappShareButton.addEventListener('click', () => {
        if (whatsappShareButton.disabled) {
            alert(`Please wait for the timer to finish before sharing!`);
            return;
        }

        let currentShares = parseInt(localStorage.getItem(LS_USER_SHARES)) || 0;
        if (currentShares < REQUIRED_SHARES) {
            currentShares++;
            localStorage.setItem(LS_USER_SHARES, currentShares);
            shareCountDisplay.textContent = `Shares: ${currentShares}/${REQUIRED_SHARES}`;

            // Open WhatsApp share link
            window.open(`https://api.whatsapp.com/send?text=${whatsappMessage}`, '_blank');

            if (currentShares === REQUIRED_SHARES) {
                alert(`Congratulations! You've completed ${REQUIRED_SHARES} shares. Now, proceed to the next step!`);
                updateUIBasedOnProgress();
            } else {
                alert(`Great! Keep sharing! You have ${REQUIRED_SHARES - currentShares} shares left.`);
                startShareButtonCountdown(); // Restart countdown for next share
            }
        }
    });

    // --- Step 4: Direct Link with Visit Logic ---
    if (visitTimeRequiredDisplay) {
        visitTimeRequiredDisplay.textContent = VISIT_SITE_REQUIRED_TIME_SEC;
    }

    const partnerSiteLink = "https://otieu.com/4/9557352"; // <-- IMPORTANT: Partner site link

    const startVisitTimer = () => {
        clearInterval(visitSiteTimerIntervalId);
        visitSiteTimerDisplay.classList.remove('hidden');
        visitSiteButton.disabled = true;

        let visitStartedTimestamp = parseInt(localStorage.getItem(LS_VISIT_STARTED_TIMESTAMP)) || 0;
        let visitCompleted = localStorage.getItem(LS_VISIT_COMPLETED) === 'true';

        // Only open link if not already visiting or completed
        if (visitStartedTimestamp === 0 && !visitCompleted) {
            visitStartedTimestamp = Date.now();
            localStorage.setItem(LS_VISIT_STARTED_TIMESTAMP, visitStartedTimestamp);
            window.open(partnerSiteLink, '_blank'); // Open partner site in new tab
        }

        let currentVisitCountdown = Math.max(0, VISIT_SITE_REQUIRED_TIME_SEC - Math.floor((Date.now() - visitStartedTimestamp) / 1000));

        visitSiteCountdownSpan.textContent = currentVisitCountdown;
        visitSiteButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Visiting Site... ${currentVisitCountdown}s`;

        visitSiteTimerIntervalId = setInterval(() => {
            currentVisitCountdown--;
            // Continuously update timestamp to keep track of elapsed time relative to now
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
                localStorage.removeItem(LS_VISIT_STARTED_TIMESTAMP); // Clear timestamp after completion
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
        if (!visitCompleted) { // Only start if not completed
            startVisitTimer();
        } else {
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
    const spinDuration = 3000; // 3 seconds for spin animation

    function drawWheel() {
        ctx.clearRect(0, 0, spinWheelCanvas.width, spinWheelCanvas.height);
        const numSegments = segments.length;
        const segmentAngle = (2 * Math.PI) / numSegments;

        let startAngle = -Math.PI / 2; // Start from top
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

            // Draw text for each segment
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2); // Rotate to middle of segment
            ctx.textAlign = 'right';
            ctx.fillStyle = '#333';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(segment.text, radius - 20, 0); // Position text
            ctx.restore();

           
