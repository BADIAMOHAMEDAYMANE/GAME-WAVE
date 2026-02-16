let playing = false;
let score;
let trialsleft;
let action;
const fruits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]; // 10 is the bomb

// Internal physics state
let fruitY, fruitX, fruitStep, fruitRotation, fruitRotationSpeed;

// Fruit juice colors
const fruitColors = {
    "1": "#ff0000", // Apple
    "2": "#ffe135", // Banana
    "3": "#ff0000", // Cherries
    "4": "#6f2da8", // Grapes
    "5": "#ffcc00", // Mango
    "6": "#ffa500", // Orange
    "7": "#afdb1a", // Pear
    "8": "#ffd700", // Pineapple
    "9": "#ff3b3b", // Watermelon
    "10": "#333333" // Bomb
};

$(function () {
    $("#front").show();

    // Theme Toggle
    $("#themeToggle").click(function () {
        $("body").toggleClass("dark-mode");
        const isDark = $("body").hasClass("dark-mode");
        $(this).find("i").attr("class", isDark ? "fas fa-sun" : "fas fa-moon");
    });

    // Fullscreen Toggle
    $("#fullscreenToggle").click(function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            $(this).find("i").attr("class", "fas fa-compress");
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                $(this).find("i").attr("class", "fas fa-expand");
            }
        }
    });

    $("#startReset").click(function () {
        if (playing == true) {
            location.reload();
        } else {
            playing = true;
            score = 0;
            $("#scoreValue").html(score);
            $("#front").hide();
            $("#trialsleft").show();
            $("#score").show();
            trialsleft = 3;
            addhearts();
            $("#gameOver").hide();
            $("#startReset").html("Réinitialiser");
            startAction();
        }
    });

    // Slicing on mousedown
    $("#fruit1").mousedown(function (e) {
        if (playing) {
            sliceFruit(e);
        }
    });

    // Mouse Trail Logic
    let lastPos = null;
    $("#fruitcontainer").mousemove(function (e) {
        if (playing) {
            const currentPos = { x: e.pageX, y: e.pageY };
            if (lastPos) {
                createTrail(lastPos, currentPos);
            }
            lastPos = currentPos;
        }
    });

    function sliceFruit(e) {
        const fruitSrc = $("#fruit1").attr("src");
        if (!fruitSrc) return;

        let fruitId = "1";
        for (let i = 0; i < fruits.length; i++) {
            if (fruitSrc.indexOf(fruits[i] + ".png") !== -1) {
                fruitId = fruits[i];
                break;
            }
        }

        const color = fruitColors[fruitId] || "#ffffff";

        if (fruitId === "10") {
            score = Math.max(0, score - 5);
            trialsleft--;
            addhearts();
            playSound();
            createSplash(e.offsetX, e.offsetY, "#000", 20);

            if (trialsleft < 1) {
                gameOver();
            } else {
                $("#scoreValue").html(score);
                stopAction();
                setTimeout(startAction, 500);
            }
        } else {
            score++;
            $("#scoreValue").html(score);
            playSound();

            createSplash(e.offsetX, e.offsetY, color, 15);
            splitFruit(fruitSrc, fruitX, fruitY, fruitRotation);

            stopAction();
            setTimeout(startAction, 500);
        }
    }

    function createSplash(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const splash = $('<div class="splash"></div>').css({
                left: x,
                top: y,
                backgroundColor: color,
                width: 6,
                height: 6
            });
            $("#fruitcontainer").append(splash);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            const dx = Math.cos(angle) * velocity * 20;
            const dy = Math.sin(angle) * velocity * 20;

            splash.animate({
                left: "+=" + dx + "px",
                top: "+=" + dy + "px",
                opacity: 0
            }, 600, function () {
                $(this).remove();
            });
        }
    }

    function splitFruit(src, x, y, currentRotation) {
        const isHorizontal = Math.random() > 0.5;
        const clip1 = isHorizontal ? "inset(0 0 50% 0)" : "inset(0 50% 0 0)";
        const clip2 = isHorizontal ? "inset(50% 0 0 0)" : "inset(0 0 0 50%)";

        const h1 = $('<img class="fruit-half">').attr("src", src).css({
            left: x,
            top: y,
            width: 100,
            height: 100,
            clipPath: clip1,
            webkitClipPath: clip1,
            transform: "rotate(" + currentRotation + "deg)"
        });

        const h2 = $('<img class="fruit-half">').attr("src", src).css({
            left: x,
            top: y,
            width: 100,
            height: 100,
            clipPath: clip2,
            webkitClipPath: clip2,
            transform: "rotate(" + currentRotation + "deg)"
        });

        $("#fruitcontainer").append(h1, h2);

        const drift = 70;
        h1.animate({
            top: "+=200px",
            opacity: 0
        }, {
            duration: 800,
            step: function (now, fx) {
                if (fx.prop === "top") {
                    const progress = (now - y) / 200;
                    const r = currentRotation - (progress * 45);
                    const tx = isHorizontal ? 0 : -drift * progress;
                    const ty = isHorizontal ? -drift * progress : 0;
                    $(this).css("transform", "rotate(" + r + "deg) translate(" + tx + "px, " + ty + "px)");
                }
            },
            complete: function () { $(this).remove(); }
        });

        h2.animate({
            top: "+=200px",
            opacity: 0
        }, {
            duration: 800,
            step: function (now, fx) {
                if (fx.prop === "top") {
                    const progress = (now - y) / 200;
                    const r = currentRotation + (progress * 45);
                    const tx = isHorizontal ? 0 : drift * progress;
                    const ty = isHorizontal ? drift * progress : 0;
                    $(this).css("transform", "rotate(" + r + "deg) translate(" + tx + "px, " + ty + "px)");
                }
            },
            complete: function () { $(this).remove(); }
        });
    }

    function createTrail(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) return;

        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const containerOffset = $("#fruitcontainer").offset();

        const trail = $('<div class="slice-trail"></div>').css({
            width: dist,
            left: p1.x - containerOffset.left,
            top: p1.y - containerOffset.top,
            transform: "rotate(" + angle + "deg)"
        });

        $("#fruitcontainer").append(trail);
        trail.fadeOut(200, function () {
            $(this).remove();
        });
    }

    function playSound() {
        const sound = $("#slicesound")[0];
        if (sound) {
            const n = sound.cloneNode();
            n.play().catch(function () { });
        }
    }

    function addhearts() {
        $("#trialsleft").empty();
        for (let i = 0; i < trialsleft; i++) {
            $("#trialsleft").append('<img src="https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/wrong.png" class="life">');
        }
    }

    function startAction() {
        stopAction(); // Safety first

        chooseRandom();
        $("#fruit1").show();

        // Initial horizontal position
        fruitX = Math.round(550 * Math.random());
        fruitY = -120; // Start higher off-screen
        fruitRotation = 0;
        fruitRotationSpeed = (Math.random() - 0.5) * 8;

        const difficultyBonus = Math.floor(score / 5);
        fruitStep = 3 + difficultyBonus + Math.round(3 * Math.random());

        $("#fruit1").css({
            left: fruitX,
            top: fruitY,
            transform: 'rotate(0deg)'
        });

        action = setInterval(function () {
            // Update physics
            fruitY += fruitStep;
            const oscillate = Math.sin(fruitY / 25) * 3;
            fruitX += oscillate;
            fruitRotation += fruitRotationSpeed;

            // Apply to DOM
            $("#fruit1").css({
                "top": fruitY,
                "left": fruitX,
                "transform": "rotate(" + fruitRotation + "deg)"
            });

            // Check boundaries
            if (fruitY > 480) { // Screen height plus buffer
                if (trialsleft > 1) {
                    trialsleft--;
                    addhearts();

                    // Don't lose life for missing a bomb
                    if ($("#fruit1").attr("src").indexOf("10.png") !== -1) {
                        trialsleft++;
                        addhearts();
                    }
                    startAction();
                } else {
                    gameOver();
                }
            }
        }, 16); // ~60fps
    }

    function chooseRandom() {
        const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        $("#fruit1").attr("src", "https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/" + randomFruit + ".png");

        if (randomFruit === "10") {
            $("#fruit1").css("filter", "drop-shadow(0px 0px 10px red)");
        } else {
            $("#fruit1").css("filter", "none");
        }
    }

    function stopAction() {
        if (action) {
            clearInterval(action);
            action = null;
        }
        $("#fruit1").hide();
    }

    function gameOver() {
        stopAction();
        playing = false;
        $("#startReset").html("Restart");
        $("#gameOver").show().html("<p>Game Over!</p><p>Score final : " + score + "</p>");
        $("#score, #trialsleft").hide();
    }
});