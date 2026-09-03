/* =========================================================
   SHARED PROJECT DATA
   ---------------------------------------------------------
   This is now the single source of truth for project order.

   To change a project's position:
   - Change its startDate and/or endDate here.

   To add a new project:
   - Add it here.
   - Add its card to index.html.
   - Give its project page the matching data-project-id.
========================================================= */

const portfolioProjects = [

  {
    id: "unet",
    title: "Surface Defect Detection Using U-Net",
    url: "project-unet.html",
    startDate: "2026-05",
    endDate: "2026-08"
  },

  {
    id: "heat-transfer",
    title: "Composite Wall Heat Transfer Analysis",
    url: "project-heat-transfer.html",
    startDate: "2026-02",
    endDate: "2026-04"
  },

  {
    id: "composite-battery",
    title: "Composite Battery Enclosure Design & Structural Analysis",
    url: "project-composite-battery.html",
    startDate: "2026-01",
    endDate: "2026-04"
  },

  {
    id: "cnc",
    title: "Modular Foam-Cutting CNC Machine",
    url: "project-cnc.html",
    startDate: "2025-01",
    endDate: "2025-04"
  },

  {
    id: "electromechanical-scale",
    title: "Electromechanical Weighing Station & PID Control",
    url: "project-electromechanical-scale.html",
    startDate: "2024-09",
    endDate: "2024-12"
  },

  {
    id: "bearing-installation",
    title: "Automated Pneumatic Bearing Installation System",
    url: "project-bearing-installation.html",
    startDate: "2024-11",
    endDate: "2024-11"
  }

];


/* =========================================================
   SORTING
   ---------------------------------------------------------
   Same rule your original index.html used:

   1. Newer END date first
   2. If equal, newer START date first
========================================================= */

function getSortedPortfolioProjects() {

  return [...portfolioProjects]
    .sort((a, b) => {

      const endDifference =
        b.endDate.localeCompare(
          a.endDate
        );

      if (endDifference !== 0) {
        return endDifference;
      }

      return b.startDate.localeCompare(
        a.startDate
      );

    });

}


/* =========================================================
   DATE FORMATTING
========================================================= */

function formatProjectMonth(value) {

  const [
    year,
    month
  ] = value
    .split("-")
    .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        1
      )
    );

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }
  ).format(date);

}


function formatProjectDateRange(project) {

  if (
    project.startDate ===
    project.endDate
  ) {

    return formatProjectMonth(
      project.startDate
    );

  }

  return (
    `${formatProjectMonth(project.startDate)} – ` +
    `${formatProjectMonth(project.endDate)}`
  );

}


/* =========================================================
   INDEX.HTML PROJECT SORTING
========================================================= */

function initializeProjectGrid() {

  const projectGrid =
    document.querySelector(
      ".project-grid"
    );

  if (!projectGrid) {
    return;
  }


  const cards = [
    ...projectGrid.querySelectorAll(
      ".project-card[data-project-id]"
    )
  ];


  const cardsById =
    new Map();


  cards.forEach(
    function(card) {

      cardsById.set(
        card.dataset.projectId,
        card
      );

    }
  );


  const sortedProjects =
    getSortedPortfolioProjects();


  sortedProjects.forEach(
    function(project, index) {

      const card =
        cardsById.get(
          project.id
        );

      if (!card) {
        return;
      }


      /*
       * Keep the card's date attributes synced
       * to the shared project database.
       */

      card.dataset.projectStart =
        project.startDate;

      card.dataset.projectEnd =
        project.endDate;


      /*
       * Automatically update Project 01,
       * Project 02, Project 03, etc.
       */

      const projectNumber =
        card.querySelector(
          ".project-number"
        );

      if (projectNumber) {

        projectNumber.textContent =
          `Project ${String(index + 1)
            .padStart(2, "0")}`;

      }


      /*
       * Automatically update the visible
       * project date.
       */

      const projectDate =
        card.querySelector(
          ".project-date"
        );

      if (projectDate) {

        projectDate.textContent =
          formatProjectDateRange(
            project
          );

      }


      /*
       * Automatically ensure the project
       * button links to the URL defined in
       * this shared file.
       */

      const projectButton =
        card.querySelector(
          ".project-button"
        );

      if (projectButton) {

        projectButton.href =
          project.url;

      }


      /*
       * Re-append the card in sorted order.
       */

      projectGrid.appendChild(
        card
      );

    });

}


/* =========================================================
   PREVIOUS / NEXT PROJECT NAVIGATION
   ---------------------------------------------------------
   This will be used by all six project pages.

   Because the list is newest → oldest:

   Project 01:
     Previous = disabled
     Next = Project 02

   Middle project:
     Previous = project above
     Next = project below

   Last project:
     Previous = previous project
     Next = disabled
========================================================= */

function createProjectNavigationButton(
  project,
  direction
) {

  const isPrevious =
    direction === "previous";


  if (!project) {

    return `
      <div
        class="
          project-sequence-button
          ${isPrevious ? "previous-project" : "next-project"}
          is-disabled
        "
        aria-disabled="true"
      >

        <span class="project-sequence-direction">

          ${
            isPrevious
              ? "← Previous Project"
              : "Next Project →"
          }

        </span>

        <span class="project-sequence-title">
          No project
        </span>

      </div>
    `;

  }


  return `
    <a
      href="${project.url}"
      class="
        project-sequence-button
        ${isPrevious ? "previous-project" : "next-project"}
      "
    >

      <span class="project-sequence-direction">

        ${
          isPrevious
            ? "← Previous Project"
            : "Next Project →"
        }

      </span>

      <span class="project-sequence-title">
        ${project.title}
      </span>

    </a>
  `;

}


/* =========================================================
   PROJECT PAGE NAVIGATION
========================================================= */

function initializeProjectNavigation() {

  const navigation =
    document.querySelector(
      "[data-project-navigation]"
    );

  if (!navigation) {
    return;
  }


  const currentProjectId =
    document.body.dataset.projectId;


  if (!currentProjectId) {

    console.warn(
      "Project page is missing data-project-id on <body>."
    );

    return;

  }


  const sortedProjects =
    getSortedPortfolioProjects();


  const currentIndex =
    sortedProjects.findIndex(
      function(project) {

        return (
          project.id ===
          currentProjectId
        );

      }
    );


  if (currentIndex === -1) {

    console.warn(
      `Unknown project id: ${currentProjectId}`
    );

    return;

  }


  const previousProject =
    currentIndex > 0
      ? sortedProjects[
          currentIndex - 1
        ]
      : null;


  const nextProject =
    currentIndex <
    sortedProjects.length - 1
      ? sortedProjects[
          currentIndex + 1
        ]
      : null;


  navigation.innerHTML = `

    <div class="project-sequence-row">

      ${createProjectNavigationButton(
        previousProject,
        "previous"
      )}


      <a
        href="index.html#projects"
        class="project-sequence-portfolio"
      >
        ← Back to Portfolio
      </a>


      ${createProjectNavigationButton(
        nextProject,
        "next"
      )}

    </div>


    <div class="project-sequence-top">

      <a
        href="#top"
        class="project-sequence-top-button"
      >
        Back to Top ↑
      </a>

    </div>

  `;

}


/* =========================================================
   INITIALIZE
========================================================= */

initializeProjectGrid();

initializeProjectNavigation();


/* =========================================================
   MAKE FUNCTIONS AVAILABLE GLOBALLY
========================================================= */

window.portfolioProjects =
  portfolioProjects;

window.getSortedPortfolioProjects =
  getSortedPortfolioProjects;

window.initializeProjectNavigation =
  initializeProjectNavigation;
