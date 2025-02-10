import blessed from "blessed";

const p2s = ([r, c]) => `${r},${c}`;

export function printGrid(grid, visited, step) {
  const lines = [];
  for (let r = 0; r < grid.length; r++) {
    const line = grid[r]
      .map((cell, c) => {
        const s = p2s([r, c]);
        if (visited[step].has(s)) {
          return "{bold}O{/bold}";
        } else if (step > 0 && visited[step - 1].has(s)) {
          return "o";
        }
        return cell;
      })
      .join("");
    lines.push(line);
  }
  const gridString = lines.join("\n");

  return `${gridString}\n${visited[step].size}@${step} steps`;
}

export function funDebug(grid, visited, maxSteps) {
  var screen = blessed.screen({
    smartCSR: true,
  });

  var box = blessed.box({
    width: "100%",
    height: "100%",
    content: "",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "white",
      border: {
        fg: "#f0f0f0",
      },
    },
  });

  let step = 0;
  // Quit on Escape, q, or Control-C.
  screen.key(["right"], function (ch, key) {
    step = (step + 1) % (maxSteps + 1);
    box.setContent(printGrid(grid, visited, step));
    screen.render();
  });

  screen.key(["left"], function (ch, key) {
    step = (step + maxSteps) % (maxSteps + 1);
    box.setContent(printGrid(grid, visited, step));
    screen.render();
  });

  // Quit on Escape, q, or Control-C.
  screen.key(["escape", "q", "C-c"], function (ch, key) {
    return process.exit(0);
  });

  // Append our box to the screen.
  screen.append(box);
  screen.render();
}
