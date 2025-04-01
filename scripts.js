document.addEventListener("DOMContentLoaded", () => {
    const fadeInterval = 12000; // time between auto-cycles in ms
    const pageNumber = 2; // number of groups/buttons
    const githubJSON = "https://postkevone.github.io/site-test/data/";
  
    // Fetch players data from a separate JSON file
    fetch("players.json")
      .then(response => response.json())
      .then(playersData => {
        // Shuffle the players array
        playersData.sort(() => Math.random() - 0.5);
  
        // Generate HTML for each player and add to the grid
        const playerGrid = document.querySelector(".player-grid");
        playerGrid.innerHTML = ""; // Clear any existing content
  
        playersData.forEach(player => {
          const playerDiv = document.createElement("div");
          playerDiv.classList.add("player");
          playerDiv.id = player.id;
          playerDiv.innerHTML = `
            <div class="profile-preview" style='background-image:url(${player.picture});'></div>
            <h1>${player.name}</h1>
            <p>${player.summary}</p>
            <div class="modal-content-hidden" style="display: none;">
              ${player.modalContent}
            </div>
          `;
          playerGrid.appendChild(playerDiv);
        });
  
        // Get all player elements after they've been added
        const playerElements = Array.from(document.querySelectorAll(".player"));
        // Initially hide all players
        playerElements.forEach(player => {
          player.style.display = "none";
          player.style.opacity = "0";
        });
  
        // Split players into groups (first 6, then the rest)
        const groups = [
          playerElements.slice(0, 6),
          playerElements.slice(6)
        ];
        let currentGroupIndex = 0;
        let autoCycle = null;
  
        // Update the navigation button opacities based on the active group
        function updateButtonOpacities(activeIndex) {
          for (let i = 0; i < pageNumber; i++) {
            const btn = document.getElementById(`show${i + 1}`);
            if (btn) {
              btn.style.opacity = (i === activeIndex) ? "1" : "0.3";
            }
          }
        }
  
        // Stop the auto-cycle timer
        function stopAutoCycle() {
          if (autoCycle) {
            clearInterval(autoCycle);
            autoCycle = null;
          }
        }
  
        // Show a given group with an optional fade transition
        function showGroup(groupIndex, fade = true) {
          if (fade) {
            groups[currentGroupIndex].forEach(p => p.style.opacity = "0");
            setTimeout(() => {
              // Hide all players
              playerElements.forEach(p => p.style.display = "none");
              // Show the new group and fade in
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
  
        // Immediately show the first group without fading
        showGroup(0, false);
  
        // Start auto-cycling between groups
        autoCycle = setInterval(() => {
          const nextGroupIndex = (currentGroupIndex + 1) % groups.length;
          showGroup(nextGroupIndex);
        }, fadeInterval);
  
        // Add click event listeners to group navigation buttons
        for (let i = 0; i < pageNumber; i++) {
          const btn = document.getElementById(`show${i + 1}`);
          if (btn) {
            btn.addEventListener("click", () => {
              stopAutoCycle();
              showGroup(i, false);
            });
          }
        }
  
        // Modal functionality setup
        const modal = document.createElement("div");
        modal.id = "modal";
        modal.className = "modal";
        modal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <div id="player-content"></div>
          </div>
        `;
        document.body.appendChild(modal);
  
        const modalBody = document.getElementById("player-content");
        const closeModal = modal.querySelector(".close");
  
        // Open modal on player click with that player's modal content
        playerElements.forEach(player => {
          player.addEventListener("click", () => {
            stopAutoCycle();
            const modalContent = player.querySelector(".modal-content-hidden").innerHTML;
            modalBody.innerHTML = modalContent;
            modal.style.display = "flex";
          });
        });
  
        // Close the modal when the close button is clicked
        closeModal.addEventListener("click", () => {
          modal.style.display = "none";
        });
  
        // Close the modal if the user clicks outside of the modal content
        window.addEventListener("click", event => {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        });
      })
      .catch(error => {
        console.error("Error loading players:", error);
      });
  

    // Tournament year filtering: load tournament data from a JSON file
    fetch("tournaments.json")
    .then(response => response.json())
    .then(tournamentsData => {
        // Assuming your tournament containers in HTML have ids "t2024" and "t2025"
        Object.keys(tournamentsData).forEach(year => {
        const container = document.getElementById('t' + year);
        if (container) {
            // Clear any existing content
            container.innerHTML = "";
            // Create tournament entries from JSON data
            tournamentsData[year].forEach(tournament => {
            const tournamentDiv = document.createElement("div");
            tournamentDiv.classList.add("tournament");
            tournamentDiv.innerHTML = `
                ${tournament.date}<br>
                <h1>${tournament.title}</h1>
                <p>
                ${tournament.details}
                </p>
            `;
            container.appendChild(tournamentDiv);
            });
        }
        });
    })
    .catch(error => console.error("Error loading tournament data:", error));

    // Handle tournament filtering on year select
    document.getElementById('select-year').addEventListener('change', function() {
    var selectedYear = this.value;
    var tournamentLists = document.querySelectorAll('.tournament-list');

    tournamentLists.forEach(function(list) {
        list.style.display = 'none';
    });

    const target = document.getElementById('t' + selectedYear);
    if (target) {
        target.style.display = 'grid';
    }
    });

  });
  
// Add this to your scripts.js or here
function openModal(src, alt) {
  const modal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('photo-large');
  
  modal.style.display = 'flex';
  modalImg.src = src;
  modalImg.alt = alt;
}

function closeModal() {
  document.getElementById('photo-modal').style.display = 'none';
}