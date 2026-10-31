const form = document.getElementById("contactForm");
const btn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  btn.disabled = true;
  btn.textContent = "Sending...";
  statusEl.textContent = "";
  statusEl.className = "status";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.ok) {
      statusEl.textContent = "Sent. Telegram pe check kar.";
      statusEl.classList.add("ok");
      form.reset();
    } else {
      statusEl.textContent = "Gadbad: " + (data.error || "unknown");
      statusEl.classList.add("err");
    }
  } catch (err) {
    statusEl.textContent = "Network issue. Try again.";
    statusEl.classList.add("err");
  } finally {
    btn.disabled = false;
    btn.textContent = "Send";
  }
});
