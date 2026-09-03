/* =========================================================
   PORTFOLIO PROJECT DATABASE
   ---------------------------------------------------------
   THIS FILE IS THE SINGLE SOURCE OF TRUTH FOR:

   - Project dates
   - Homepage project order
   - Project numbering
   - Previous / Next navigation
   - Project-page Timeline display
   
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
    startDate: "2024-09",
    endDate: "2024-12"
  }

];



/* =========================================================
   SORT PROJECTS
   ---------------------------------------------------------
   Projects are sorted:

   1. Newest END date first
   2. If end dates match, newest START date first
   3. If both dates match, array order above is preserved
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


      const startDifference =
        b.startDate.localeCompare(
          a.startDate
        );

      if (startDifference !== 0) {
        return startDifference;
      }


      /*
       * Returning 0 preserves the order in which
       * equal-date projects appear in the array.
       */

      return 0;

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
   FIND PROJECT
========================================================= */

function getPortfolioProjectById(
  projectId
) {

  return portfolioProjects.find(
    function(project) {

      return (
        project.id ===
        projectId
      );

    }
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


      /* -------------------------------------------------------
         Keep date attributes synchronized
      ------------------------------------------------------- */

      card.dataset.projectStart =
        project.startDate;

      card.dataset.projectEnd =
        project.endDate;


      /* -------------------------------------------------------
         Project number
      ------------------------------------------------------- */

      const projectNumber =
        card.querySelector(
          ".project-number"
        );


      if (projectNumber) {

        projectNumber.textContent =
          `Project ${
            String(index + 1)
              .padStart(2, "0")
          }`;

      }


      /* -------------------------------------------------------
         Project date
      ------------------------------------------------------- */

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


      /* -------------------------------------------------------
         Project URL
      ------------------------------------------------------- */

      const projectButton =
        card.querySelector(
          ".project-button"
        );


      if (projectButton) {

        projectButton.href =
          project.url;

      }


      /* -------------------------------------------------------
         Move card into its correct position
      ------------------------------------------------------- */

      projectGrid.appendChild(
        card
      );

    });

}



/* =========================================================
   PROJECT PAGE DATE
   ---------------------------------------------------------
   Finds:

   <body data-project-id="...">

   Then automatically fills:

   <div data-project-date></div>
========================================================= */

function initializeProjectDate() {

  const currentProjectId =
    document.body.dataset.projectId;


  if (!currentProjectId) {
    return;
  }


  const project =
    getPortfolioProjectById(
      currentProjectId
    );


  if (!project) {

    console.warn(
      `Unknown project id: ${currentProjectId}`
    );

    return;

  }


  const dateElements =
    document.querySelectorAll(
      "[data-project-date]"
    );


  dateElements.forEach(
    function(element) {

      element.textContent =
        formatProjectDateRange(
          project
        );

    }
  );

}



/* =========================================================
   CREATE PREVIOUS / NEXT BUTTON
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
          ${
            isPrevious
              ? "previous-project"
              : "next-project"
          }
          is-disabled
        "
        aria-disabled="true"
      >

        <span
          class="project-sequence-direction"
        >

          ${
            isPrevious
              ? "← Previous Project"
              : "Next Project →"
          }

        </span>

        <span
          class="project-sequence-title"
        >
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
        ${
          isPrevious
            ? "previous-project"
            : "next-project"
        }
      "
    >

      <span
        class="project-sequence-direction"
      >

        ${
          isPrevious
            ? "← Previous Project"
            : "Next Project →"
        }

      </span>

      <span
        class="project-sequence-title"
      >
        ${project.title}
      </span>

    </a>
  `;

}



/* =========================================================
   PROJECT PAGE PREVIOUS / NEXT NAVIGATION
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


  /* ---------------------------------------------------------
     Previous project

     Project 01 has no previous project.
  --------------------------------------------------------- */

  const previousProject =
    currentIndex > 0
      ? sortedProjects[
          currentIndex - 1
        ]
      : null;


  /* ---------------------------------------------------------
     Next project

     Last project has no next project.
  --------------------------------------------------------- */

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
   INITIALIZE EVERYTHING
========================================================= */

initializeProjectGrid();

initializeProjectDate();

initializeProjectNavigation();



/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.portfolioProjects =
  portfolioProjects;

window.getSortedPortfolioProjects =
  getSortedPortfolioProjects;

window.getPortfolioProjectById =
  getPortfolioProjectById;

window.formatProjectDateRange =
  formatProjectDateRange;

window.initializeProjectNavigation =
  initializeProjectNavigation;
