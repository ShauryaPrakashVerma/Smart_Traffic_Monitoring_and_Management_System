// const tabs = document.querySelectorAll(".tab");
// const label = document.getElementById("userLabel");
// const input = document.getElementById("userInput");
// const btn = document.getElementById("loginBtn");
// tabs.forEach(
//   (t) =>
//     (t.onclick = () => {
//       tabs.forEach((x) => x.classList.remove("active"));
//       t.classList.add("active");
//       if (t.dataset.role === "controller") {
//         label.textContent = "Employee ID";
//         input.placeholder = "e.g EMP-2047";
//         btn.textContent = "Sign In — Controller";
//       } else {
//         label.textContent = "Email Address";
//         input.placeholder = "name@city.gov";
//         btn.textContent = "Continue as Public Viewer";
//       }
//     }),
// );


const tabs = document.querySelectorAll(".tab");
const label = document.getElementById("userLabel");
const input = document.getElementById("userInput");
const btn = document.getElementById("loginBtn");
const roleInput = document.getElementById("role");

tabs.forEach((t) => {
    t.onclick = () => {
        tabs.forEach((x) => x.classList.remove("active"));
        t.classList.add("active");

        if (t.dataset.role === "controller") {
            label.textContent = "Employee ID";
            input.placeholder = "e.g EMP-2047";
            input.name = "employee_id";
            btn.textContent = "Sign In — Controller";

            roleInput.value = "controller";
        } else {
            label.textContent = "Email Address";
            input.placeholder = "name@city.gov";
            input.name = "email";
            btn.textContent = "Continue as Public Viewer";

            roleInput.value = "viewer";
        }
    };
});