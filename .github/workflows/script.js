const sheetURL = "https://script.google.com/macros/s/AKfycbyRvvLmZg1zzfGsgFb8XVUApclToxCH1ZyqVG0jlWntK94V_TZWcXq_j-uL-WGLtpK6Gw/exec";

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    const header = data[0];
    const rows = data.slice(1);

    // Find column index for name and percent
    let taskIndex = header.indexOf("Task") !== -1 ? header.indexOf("Task") : 0;
    let percentIndex = header.indexOf("Completed %") !== -1 ? header.indexOf("Completed %") : header.length - 1;

    let taskContainer = document.getElementById("taskContainer");
    let progressValues = [];
    let labels = [];

    rows.forEach(row => {
      let task = row[taskIndex];
      let percent = Number(row[percentIndex]) || 0;

      labels.push(task);
      progressValues.push(percent);

      taskContainer.innerHTML += `
        <div>
          <h3>${task}</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${percent}%"></div>
          </div>
          <p>${percent}% Complete</p>
        </div>
      `;
    });

    new Chart(document.getElementById("progressChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "% Complete",
          data: progressValues
        }]
      }
    });
  });
