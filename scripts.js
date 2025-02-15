document.addEventListener("DOMContentLoaded", () => {
    const players = Array.from(document.querySelectorAll(".player"));
    
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
    
    players.forEach(player => {
        player.style.display = "none";
        player.style.opacity = "0";
    });
    
    const groups = [
        players.slice(0, 3),
        players.slice(3, 6),
        players.slice(6, 9)
    ];
    
    let currentGroupIndex = 0;
    let autoCycle = null;
    
    function updateButtonOpacities(activeIndex) {
        for (let i = 0; i < groups.length; i++) {
            document.getElementById(`show${i + 1}`).style.opacity = (i === activeIndex) ? "1" : "0.3";
        }
    }
    
    function stopAutoCycle() {
        if (autoCycle) {
            clearInterval(autoCycle);
            autoCycle = null;
        }
    }
    
    function showGroup(groupIndex, fade = true) {
        if (fade) {
            groups[currentGroupIndex].forEach(p => p.style.opacity = "0");
            setTimeout(() => {
                players.forEach(p => p.style.display = "none");
                groups[groupIndex].forEach(p => {
                    p.style.display = "block";
                    setTimeout(() => p.style.opacity = "1", 50);
                });
                currentGroupIndex = groupIndex;
                updateButtonOpacities(groupIndex);
            }, 500);
        } else {
            groups[currentGroupIndex].forEach(p => {
                p.style.opacity = "0";
                p.style.display = "none";
            });
            groups[groupIndex].forEach(p => {
                p.style.display = "block";
                p.style.opacity = "1";
            });
            currentGroupIndex = groupIndex;
            updateButtonOpacities(groupIndex);
        }
    }
    
    showGroup(0, false);
    
    autoCycle = setInterval(() => {
        const nextGroupIndex = (currentGroupIndex + 1) % groups.length;
        showGroup(nextGroupIndex);
    }, 5000);
    
    for (let i = 0; i < groups.length; i++) {
        document.getElementById(`show${i + 1}`).addEventListener("click", () => {
            stopAutoCycle();
            showGroup(i, false);
        });
    }
    
    // Modal functionality
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const modalBody = document.getElementById("modal-body");
    const closeModal = modal.querySelector(".close");
    
    players.forEach(player => {
        player.addEventListener("click", () => {
            stopAutoCycle();
            const modalContent = player.querySelector(".modal-content-hidden").innerHTML;
            modalBody.innerHTML = modalContent;
            modal.style.display = "flex";
        });
    });
    
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    window.addEventListener("click", event => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    document.getElementById('select-year').addEventListener('change', function() {
        var selectedYear = this.value;
        var tournamentLists = document.querySelectorAll('.tournament-list');

        tournamentLists.forEach(function(list) {
            list.style.display = 'none';
        });

        document.getElementById('t' + selectedYear).style.display = 'grid';
    });
});
