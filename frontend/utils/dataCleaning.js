const flaggedUsers = [];

function flagDrawing(drawing) {
  // Use to undo flags
  // if (flaggedUsers.includes(drawing.id)) {
  //   const indx = flaggedUsers.indexOf(drawing.user_id);
  //   flaggedUsers.splice(indx, 1);
  // } else {
  //   flaggedUsers.push(drawing.user_id);
  // }

  // [...document.querySelectorAll(".flagged")].forEach((e) =>
  //   e.classList.remove("flagged")
  // );
  // for (const id of flaggedUsers) {
  //   const el = document.getElementById("drawing_" + id);
  //   el.classList.add("flagged");
  // }

  flaggedUsers.push(drawing.user_id);
  document.getElementById("drawing_" + drawing.id).classList.add("flagged");
}
