async function getUser() {
  const username = document.getElementById("username").value;
  const userInfo = document.getElementById("user-info");

  if (username === "") {
    userInfo.innerHTML = "<p>Please enter a username ❌</p>";
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();

    userInfo.innerHTML = `
      <img src="${data.avatar_url}" alt="Avatar">
      <h2>${data.name || data.login}</h2>
      <p>${data.bio || "No bio available"}</p>
      <p>Repos: ${data.public_repos} | Followers: ${data.followers} | Following: ${data.following}</p>
      <p><a href="${data.html_url}" target="_blank">View Profile</a></p>
    `;
  } catch (err) {
    userInfo.innerHTML = `<p>${err.message}</p>`;
  }
}
