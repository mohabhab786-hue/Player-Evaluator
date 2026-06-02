document.addEventListener(
"DOMContentLoaded",
function () {

    // ----------------
    // CONFIDENCE
    // ----------------

    const allInputs =
    document.querySelectorAll(
        "input, select"
    );

    function updateConfidence() {

        let filled = 0;

        allInputs.forEach(
        function(input) {

            if (
                input.value !== ""
            ) {
                filled++;
            }
        });

        const percent =
        Math.round(
            (
                filled /
                allInputs.length
            ) * 100
        );

        const confidence =
        document.getElementById(
            "confidenceValue"
        );

        if (confidence) {

            confidence.innerText =
            percent + "%";
        }
    }

    allInputs.forEach(
    function(input) {

        input.addEventListener(
            "input",
            updateConfidence
        );
    });

    updateConfidence();


    // ----------------
    // RADAR CHART
    // ----------------

    let radarChart = null;

    const radarCanvas =
    document.getElementById(
        "radarChart"
    );

    if (
        radarCanvas &&
        typeof scoutScores !==
        "undefined"
    ) {

        const ctx =
        radarCanvas.getContext(
            "2d"
        );

        radarChart =
        new Chart(ctx, {

            type: "radar",

            data: {

                labels: [

                    "Game Awareness",
                    "Decision Making",
                    "Pressure Handling",
                    "Adaptability",
                    "Competitiveness",
                    "Coachability",
                    "Leadership",
                    "Role Clarity"
                ],

                datasets: [{

                    label:
                    "Scout Scores",

                    data: [

                        scoutScores[
                        "Game Awareness"
                        ] || 0,

                        scoutScores[
                        "Decision Making"
                        ] || 0,

                        scoutScores[
                        "Pressure Handling"
                        ] || 0,

                        scoutScores[
                        "Adaptability"
                        ] || 0,

                        scoutScores[
                        "Competitiveness"
                        ] || 0,

                        scoutScores[
                        "Coachability"
                        ] || 0,

                        scoutScores[
                        "Leadership"
                        ] || 0,

                        scoutScores[
                        "Role Clarity"
                        ] || 0
                    ],

                    fill: true,

                    backgroundColor:
                    "rgba(0,229,255,0.25)",

                    borderColor:
                    "#00E5FF",

                    borderWidth: 4,

                    pointBackgroundColor:
                    "#00E5FF",

                    pointRadius: 5
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio:
                false,

                scales: {

                    r: {

                        min: 0,
                        max: 10,

                        ticks: {

                            stepSize: 1,

                            backdropColor:
                            "transparent",

                            color:
                            "#222"
                        },

                        pointLabels: {

                            color:
                            "#111",

                            font: {

                                size: 14,

                                weight:
                                "bold"
                            }
                        }
                    }
                }
            }
        });
    }


    // ----------------
    // PDF DOWNLOAD
    // ----------------

    const pdfButton =
    document.getElementById(
        "pdfButton"
    );

    if (pdfButton) {

        pdfButton.addEventListener(
        "click",
        function () {

            const { jsPDF } =
            window.jspdf;

            const doc =
            new jsPDF();

            // Title
            doc.setFontSize(22);

            doc.text(
                "Player Evaluation Report",
                45,
                20
            );

            doc.line(
                10,
                28,
                200,
                28
            );

            let y = 40;

            // ----------------
            // PLAYER INFO
            // ----------------

            doc.setFontSize(
                16
            );

            doc.text(
                "Player Information",
                10,
                y
            );

            y += 10;

            const playerInfo =
            document.querySelectorAll(
                "#pdfContent p"
            );

            for (
                let i = 0;
                i < playerInfo.length - 1;
                i++
            ) {

                doc.setFontSize(
                    12
                );

                doc.text(
                    playerInfo[i]
                    .innerText,
                    10,
                    y
                );

                y += 8;
            }

            // ----------------
            // SCORES
            // ----------------

            y += 5;

            doc.setFontSize(
                16
            );

            doc.text(
                "Scout Scores",
                10,
                y
            );

            y += 10;

            const scoreItems =
            document.querySelectorAll(
                "#pdfContent li"
            );

            scoreItems.forEach(
            function(score) {

                doc.setFontSize(
                    12
                );

                doc.text(
                    score.innerText,
                    15,
                    y
                );

                y += 7;
            });

            // ----------------
            // RATING
            // ----------------

            y += 5;

            const headings =
            document.querySelectorAll(
                "#pdfContent h3"
            );

            headings.forEach(
            function(item) {

                const text =
                item.innerText;

                if (
                    text.includes(
                        "Scout Rating"
                    ) ||

                    text.includes(
                        "Classification"
                    )
                ) {

                    doc.setFontSize(
                        14
                    );

                    doc.text(
                        text,
                        10,
                        y
                    );

                    y += 8;
                }
            });

            // ----------------
            // RECOMMENDATION
            // ----------------

            const recommendation =
            playerInfo[
                playerInfo.length - 1
            ];

            y += 4;

            doc.setFontSize(
                16
            );

            doc.text(
                "Recommendation",
                10,
                y
            );

            y += 8;

            doc.setFontSize(
                12
            );

            const wrappedText =
            doc.splitTextToSize(
                recommendation
                .innerText,
                180
            );

            doc.text(
                wrappedText,
                10,
                y
            );

            y += 22;

            // ----------------
            // RADAR CHART
            // ----------------

            if (
                radarChart
            ) {

                doc.setFontSize(
                    16
                );

                doc.text(
                    "Performance Radar Chart",
                    10,
                    y
                );

                y += 8;

                const chartImage =
                radarChart
                .toBase64Image();

                // FIXED SIZE
                doc.addImage(
                    chartImage,
                    "PNG",
                    35,
                    y,
                    135,
                    60
                );
            }

            // Save PDF
            doc.save(
                "Player_Evaluation_Report.pdf"
            );
        });
    }

});