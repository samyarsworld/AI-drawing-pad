function draw(ctx, segment, color = "black") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(segment[0][0], segment[0][1]);
  for (let i = 1; i < segment.length; i++) {
    ctx.lineTo(segment[i][0], segment[i][1]);
  }
  ctx.stroke();
}
