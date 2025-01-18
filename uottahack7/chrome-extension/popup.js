document.addEventListener('DOMContentLoaded', () => {
  const screenTimeElement = document.getElementById('screenTime');
  const refreshButton = document.getElementById('refresh');

  const updateScreenTime = () => {
    fetch('http://localhost:5001/api/screen-time')
      .then(response => response.json())
      .then(data => {
        screenTimeElement.textContent = `Available Screen Time: ${data.screenTime} minutes`;
      });
  };

  refreshButton.addEventListener('click', updateScreenTime);

  updateScreenTime();
});