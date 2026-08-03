// =====================================
// REPORT TYPE TABS
// =====================================

const reportTabs = document.querySelectorAll(".report-tab");

reportTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        reportTabs.forEach(item =>
            item.classList.remove("active")
        );

        tab.classList.add("active");

    });

});


// =====================================
// GENERATE REPORT BUTTON
// =====================================

const generateButton = document.querySelector(".generate-btn");

if(generateButton){

    generateButton.addEventListener("click", () => {

        const reportType =
            document.querySelector(".report-tab.active").textContent.trim();

        const selectedOptions = [];

        document.querySelectorAll(".form-check-input").forEach(item => {

            if(item.checked){

                selectedOptions.push(
                    item.nextElementSibling.textContent.trim()
                );

            }

        });

        console.log("Report Type :", reportType);
        console.log("Selected :", selectedOptions);

        alert(
            `${reportType} Report generation started.\n\n` +
            `${selectedOptions.length} sections selected.`
        );

    });

}



// =====================================
// PDF DOWNLOAD BUTTONS
// =====================================

document.querySelectorAll(".pdf-btn").forEach(button => {

    button.addEventListener("click", () => {

        const reportName =
            button.parentElement.previousElementSibling
            .querySelector("h6")
            .textContent;

        console.log("Downloading:", reportName);

        alert("Downloading\n\n" + reportName);

    });

});




// =====================================
// HOVER EFFECT (OPTIONAL)
// =====================================

document.querySelectorAll(".recent-report").forEach(report => {

    report.addEventListener("mouseenter", () => {

        report.style.background = "#fafbfc";

    });

    report.addEventListener("mouseleave", () => {

        report.style.background = "";

    });

});