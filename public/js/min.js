document.addEventListener("DOMContentLoaded", function () {
  // Get the counter element
  const graduated = document.getElementById("graduated");
  const studying = document.getElementById("studying");
  const screwd = document.getElementById("screwd");

  // Set the target count
  const graduatedCount = 4213;
  const stuydingCount = 4824;
  const screwdCount = 12;

  // Set the duration of the animation (in milliseconds)
  const animationDuration = 2000;

  // Calculate the increment value based on the target count and animation duration
  const incrementGraduates = graduatedCount / (animationDuration / 10);
  const incrementStuyding = stuydingCount / (animationDuration / 10);
  const incrementScrewd = screwdCount / (animationDuration / 10);

  let count = 0;

  // Function to update the counter value
  function updateCounter() {
    count += incrementGraduates;
    graduated.innerText = Math.floor(count);

    // Repeat the animation until the target count is reached
    if (count < graduatedCount) {
      requestAnimationFrame(updateCounter);
    }
  }
  let count2 = 0;
  function updateCounterStuyding() {
    count2 += incrementStuyding;
    studying.innerText = Math.floor(count2);

    // Repeat the animation until the target count is reached
    if (count2 < stuydingCount) {
      requestAnimationFrame(updateCounterStuyding);
    }
  }
  let count3 = 0;
  function updateCounterScrewd() {
    count3 += incrementScrewd;
    screwd.innerText = Math.floor(count3);

    // Repeat the animation until the target count is reached
    if (count3 < screwdCount) {
      requestAnimationFrame(updateCounterScrewd);
    }
  }

  // Start the counter animation when the page loads
  updateCounter();
  updateCounterStuyding();
  updateCounterScrewd();

});
