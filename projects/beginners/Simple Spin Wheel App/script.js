const canvas = document.getElementById("wheel")
const ctx = canvas.getContext("2d")
const spinBtn = document.getElementById("spinBtn")
const addBtn = document.getElementById("addBtn")
const optionInput = document.getElementById("optionInput")
const result = document.getElementById("result")
const historyList = document.getElementById("historyList")
const spinSound = document.getElementById("spinSound")
const winSound = document.getElementById("winSound")

let options = ["100", "200", "Try Again", "500", "Bonus", "Jackpot"]
let colors = []
let startAngle = 0
let spinAngle = 0
let spinning = false

function randomColor() {
  return `hsl(${Math.random() * 360},100%,50%)`
}

function updateColors() {
  colors = options.map(() => randomColor())
}

function drawWheel() {
  const slice = (2 * Math.PI) / options.length
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  options.forEach((text, i) => {
    const angle = startAngle + i * slice
    ctx.beginPath()
    ctx.moveTo(180, 180)
    ctx.arc(180, 180, 180, angle, angle + slice)
    ctx.fillStyle = colors[i]
    ctx.fill()

    ctx.save()
    ctx.translate(180, 180)
    ctx.rotate(angle + slice / 2)
    ctx.textAlign = "right"
    ctx.fillStyle = "#000"
    ctx.font = "bold 16px Arial"
    ctx.fillText(text, 160, 8)
    ctx.restore()
  })
}

function spin() {
  if (spinning || options.length < 2) return
  spinning = true
  result.textContent = ""
  spinSound.play()
  spinAngle = Math.random() * 3000 + 3000
  animate()
}

function animate() {
  if (spinAngle <= 0) {
    spinning = false
    const slice = (2 * Math.PI) / options.length
    const index = Math.floor(
      (options.length - (startAngle / slice) % options.length) % options.length
    )
    const win = options[index]
    result.textContent = `You Got: ${win}`
    winSound.play()
    const li = document.createElement("li")
    li.textContent = win
    historyList.prepend(li)
    return
  }
  startAngle += spinAngle * 0.002
  spinAngle *= 0.97
  drawWheel()
  requestAnimationFrame(animate)
}

addBtn.onclick = () => {
  if (optionInput.value.trim()) {
    options.push(optionInput.value.trim())
    optionInput.value = ""
    updateColors()
    drawWheel()
  }
}

spinBtn.onclick = spin

updateColors()
drawWheel()
