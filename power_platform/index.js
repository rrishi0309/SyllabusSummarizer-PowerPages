document.addEventListener("DOMContentLoaded", function () {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("pdfUpload");
    const errorMessage = document.getElementById("error-message");
    const pdfEmbed = document.getElementById("pdf-embed");
    const pdfPreview = document.getElementById("pdf-preview");
    const summarySection = document.getElementById("gpt-summary");
    const summaryContent = document.getElementById("summary-content");
    const loader = document.getElementById("loader");
    const fileNameEl = document.getElementById("file-name");
    const statusGif = document.getElementById("status-gif");
    const howItWorksBtn = document.getElementById("how-it-works-btn");
    const howItWorksModal = document.getElementById("how-it-works-modal");
    const closeModalBtn = document.getElementById("close-modal");
    let uploadedFileName = "summary";

    // Hide modal by default
    howItWorksModal.style.display = "none";

    howItWorksBtn.addEventListener("click", () => {
      howItWorksModal.style.display = "flex";
    });
    closeModalBtn.addEventListener("click", () => {
      howItWorksModal.style.display = "none";
    });

    // Disable / enable uploading
    function disableUpload() {
      dropzone.classList.add("disabled");
      fileInput.disabled = true;
    }
    function enableUpload() {
      dropzone.classList.remove("disabled");
      fileInput.disabled = false;
    }

    // Error message
    function showError(msg) {
      errorMessage.textContent = msg;
      errorMessage.style.display = "block";
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 3000);
    }

    // Check enumerated line
    function isEnumeratedLine(line) {
      // Matches e.g. "1) Something" or "2. Something" or "10)Something"
      return /^[0-9]+[).]\s*/.test(line.trim());
    }

    // Format for UI
    function formatSummaryStructured(summaryText) {
      const lines = summaryText
        .split("\n")
        .filter((line) => line.trim() !== "");

      return lines
        .map((line) => {
          // If bullet line
          const bulletRegex = /^[*-]\s+/;
          if (bulletRegex.test(line.trim())) {
            line = line.trim().replace(bulletRegex, "• ");
          }

          // Replace bold/italic
          line = line
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>");

          // Indent enumerated lines
          let extraClass = "";
          if (isEnumeratedLine(line)) {
            extraClass = " sub-item";
          }

          // If label: value
          const match = line.match(/^([^:]+?):\s*(.*)$/);
          if (match) {
            const label = match[1].trim();
            const value = match[2].trim();
            return `<div class="summary-section${extraClass}"><strong>${label}:</strong> ${value}</div>`;
          } else {
            return `<div class="summary-section${extraClass}">${line.trim()}</div>`;
          }
        })
        .join("");
    }

    // PDF / Word lines
    function parseMarkdownLine(line) {
      const bulletRegex = /^[*-]\s+/;
      if (bulletRegex.test(line.trim())) {
        line = line.trim().replace(bulletRegex, "• ");
      }
      return line;
    }
    // parse ***bolditalic***, **bold**, *italic*
    function parseStyles(line) {
      const pattern = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g;
      let lastIndex = 0;
      const segments = [];
      line.match(pattern)?.forEach((match) => {
        const index = line.indexOf(match, lastIndex);
        if (index > lastIndex) {
          segments.push({
            text: line.slice(lastIndex, index),
            style: "normal",
          });
        }
        const content = match.replace(/\*\*\*|\*\*|\*/g, "");
        if (match.startsWith("***")) {
          segments.push({ text: content, style: "bolditalic" });
        } else if (match.startsWith("**")) {
          segments.push({ text: content, style: "bold" });
        } else {
          segments.push({ text: content, style: "italic" });
        }
        lastIndex = index + match.length;
      });
      if (lastIndex < line.length) {
        segments.push({ text: line.slice(lastIndex), style: "normal" });
      }
      return segments;
    }

    // PDF text wrap
    function wrapSegment(segment, availableWidth, font, fontSize, fullWidth) {
      const words = segment.text.split(" ");
      let lines = [];
      let currentLine = "";
      for (let word of words) {
        const testLine = currentLine ? currentLine + " " + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > availableWidth && currentLine) {
          lines.push({ text: currentLine, style: segment.style });
          currentLine = word;
          availableWidth = fullWidth;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push({ text: currentLine, style: segment.style });
      }
      return lines;
    }

    function getLineIndent(line, margin) {
      return isEnumeratedLine(line) ? margin + 30 : margin;
    }
    function getWordIndent(line) {
      return isEnumeratedLine(line) ? 720 : 0;
    }

    // Handle upload
    function handleFileUpload(file) {
      uploadedFileName = file.name.replace(/\.pdf$/, "_summary");
      fileNameEl.textContent = file.name;
      statusGif.src = "/file_searching.gif";
      loader.classList.add("show");
      summarySection.style.display = "none";
      pdfPreview.style.display = "none";

      disableUpload();

      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result.split(",")[1];
        pdfEmbed.src = e.target.result;

        const payload = {
          eventData: JSON.stringify({
            filename: file.name,
            file: { name: file.name, contentBytes: base64 },
          }),
        };

        shell
          .ajaxSafePost({
            type: "POST",
            contentType: "application/json",
            url: "/_api/cloudflow/v1.0/trigger/9bfdbe9a-aa12-f011-998a-000d3a99c818",
            data: JSON.stringify(payload),
            processData: false,
            global: false,
          })
          .done(function (response) {
            const parsed =
              typeof response === "string" ? JSON.parse(response) : response;
            const summary = parsed.summary || "No summary returned.";
            summaryContent.dataset.markdown = summary;
            summaryContent.innerHTML = formatSummaryStructured(summary);
            loader.classList.remove("show");
            summarySection.style.display = "block";
            pdfPreview.style.display = "block";
            statusGif.src = "/summary_doc.gif";

            summarySection.classList.add("pulse");
            setTimeout(() => {
              summarySection.classList.remove("pulse");
            }, 2000);

            enableUpload();
          })
          .fail(function () {
            loader.classList.remove("show");
            showError("Upload failed. Please try again.");
            statusGif.src = "/hello.gif";
            enableUpload();
          });
      };
      reader.readAsDataURL(file);
    }

    // Dropzone events
    dropzone.addEventListener("click", () => {
      fileInput.click();
    });
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        handleFileUpload(file);
      } else {
        showError("Please upload a valid PDF file.");
      }
    });
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type === "application/pdf") {
        handleFileUpload(file);
      } else {
        showError("Please upload a valid PDF file.");
      }
    });

    // Export PDF
    document
      .getElementById("export-pdf")
      .addEventListener("click", async () => {
        const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
        const pdfDoc = await PDFDocument.create();

        // 1) Embed built-in fonts
        const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontItalic = await pdfDoc.embedFont(
          StandardFonts.HelveticaOblique
        );

        // 2) Create letter-size page with 1-inch margins
        let page = pdfDoc.addPage([612, 792]);
        const margin = 72;
        const { width, height } = page.getSize();
        let y = height - margin;
        const fontSize = 11;
        const availableWidth = width - 2 * margin;
        const lineSpacing = 12; // Adjust spacing between lines

        // 3) Draw a title
        page.drawText("AI Syllabus Summary", {
          x: margin,
          y,
          size: 16,
          font: fontBold,
          color: rgb(0, 0, 0.8),
        });
        y -= lineSpacing + 10;

        // 4) Read the raw summary text (stored in summaryContent.dataset.markdown)
        const rawText = summaryContent.dataset.markdown || "";
        // Split text by single newline so each line is processed
        const lines = rawText.split("\n");

        // --- Helper functions ---

        // isEnumeratedLine: returns true if line starts with "1) ", "2.", etc.
        function isEnumeratedLine(line) {
          return /^[0-9]+[).]\s*/.test(line.trim());
        }

        // parseStyles: splits text into segments with style = "normal", "bold", "italic", or "bolditalic"
        function parseStyles(line) {
          // Remove any raw newlines
          line = line.replace(/\n/g, " ");

          // Regex matches ***some text***, **some text**, or *some text*
          const pattern = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g;
          let segments = [];
          let lastIndex = 0;
          let match;

          while ((match = pattern.exec(line)) !== null) {
            const index = match.index;
            // Everything before this match is normal
            if (index > lastIndex) {
              segments.push({
                text: line.slice(lastIndex, index),
                style: "normal",
              });
            }
            const raw = match[0]; // e.g. "***some text***"
            const content = raw.replace(/\*\*\*|\*\*|\*/g, ""); // remove markers

            if (raw.startsWith("***")) {
              segments.push({ text: content, style: "bolditalic" });
            } else if (raw.startsWith("**")) {
              segments.push({ text: content, style: "bold" });
            } else {
              segments.push({ text: content, style: "italic" });
            }
            lastIndex = pattern.lastIndex;
          }
          // Remainder after last match
          if (lastIndex < line.length) {
            segments.push({ text: line.slice(lastIndex), style: "normal" });
          }
          return segments;
        }

        // wrapSegment: splits text into multiple lines if it exceeds the available width
        function wrapSegment(segment, font, size, maxWidth) {
          const words = segment.text.split(" ");
          let lines = [];
          let currentLine = "";
          for (let word of words) {
            const testLine = currentLine ? currentLine + " " + word : word;
            const testWidth = font.widthOfTextAtSize(testLine, size);
            if (testWidth > maxWidth && currentLine !== "") {
              // push the line so far
              lines.push({ text: currentLine, style: segment.style });
              // start a new line
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            lines.push({ text: currentLine, style: segment.style });
          }
          return lines;
        }

        // bulletRegex: if line starts with "-" or "*"
        const bulletRegex = /^[*-]\s+/;

        // 5) Loop over each raw line
        for (let rawLine of lines) {
          let line = rawLine.trim();
          if (!line) {
            // blank line => skip down
            y -= lineSpacing;
            if (y < margin) {
              page = pdfDoc.addPage([612, 792]);
              y = 792 - margin;
            }
            continue;
          }

          line = line.replace(/:\s*/g, ":  ");

          // Replace bullet markers with "• "
          if (bulletRegex.test(line)) {
            line = line.replace(bulletRegex, "• ");
          }

          // Indentation for enumerated lines
          let indentX = margin;
          if (isEnumeratedLine(line)) {
            indentX = margin + 30;
          }

          // parse line for bold/italic
          const segments = parseStyles(line);

          // We'll draw the segments from left to right, wrapping as needed
          let x = indentX;

          for (let seg of segments) {
            // Decide which font to use
            let usedFont = fontNormal;
            if (seg.style === "bold") usedFont = fontBold;
            if (seg.style === "italic") usedFont = fontItalic;

            // If "bolditalic", we stack bold + italic
            if (seg.style === "bolditalic") {
              // wrap the text if needed
              const wrapped = wrapSegment(
                seg,
                fontBold,
                fontSize,
                width - indentX - x
              );
              for (let i = 0; i < wrapped.length; i++) {
                if (i > 0) {
                  // move to new line
                  y -= lineSpacing;
                  x = indentX;
                  if (y < margin) {
                    page = pdfDoc.addPage([612, 792]);
                    y = 792 - margin;
                  }
                }
                // draw bold
                page.drawText(wrapped[i].text, {
                  x,
                  y,
                  size: fontSize,
                  font: fontBold,
                  color: rgb(0, 0, 0),
                });
                // stack italic on top
                page.drawText(wrapped[i].text, {
                  x,
                  y,
                  size: fontSize,
                  font: fontItalic,
                  color: rgb(0, 0, 0),
                });
                x += fontBold.widthOfTextAtSize(wrapped[i].text, fontSize);
              }
            } else {
              // normal, bold, or italic
              const wrapped = wrapSegment(
                seg,
                usedFont,
                fontSize,
                width - indentX - x
              );
              for (let j = 0; j < wrapped.length; j++) {
                if (j > 0) {
                  // move to new line
                  y -= lineSpacing;
                  x = indentX;
                  if (y < margin) {
                    page = pdfDoc.addPage([612, 792]);
                    y = 792 - margin;
                  }
                }
                page.drawText(wrapped[j].text, {
                  x,
                  y,
                  size: fontSize,
                  font: usedFont,
                  color: rgb(0, 0, 0),
                });
                x += usedFont.widthOfTextAtSize(wrapped[j].text, fontSize);
              }
            }
          }

          // End of this line => move down
          y -= lineSpacing;
          if (y < margin) {
            page = pdfDoc.addPage([612, 792]);
            y = 792 - margin;
          }
        }

        // 6) Save PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = uploadedFileName + ".pdf";
        a.click();
      });

    // Export Word
    document
      .getElementById("export-word")
      .addEventListener("click", async () => {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel } =
          window.docx;

        // Title
        const title = new Paragraph({
          text: "AI Syllabus Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 80 }, // smaller spacing
        });

        const rawLines = summaryContent.dataset.markdown.split("\n");
        const paragraphs = [title];

        for (let line of rawLines) {
          const trimmed = line.trim();
          if (!trimmed) {
            // blank line => small spacing
            paragraphs.push(new Paragraph({ spacing: { after: 80 } }));
            continue;
          }
          const lineAfterBullets = parseMarkdownLine(trimmed);
          const styledSegments = parseStyles(lineAfterBullets);

          const runs = styledSegments.map(
            (seg) =>
              new TextRun({
                text: seg.text,
                size: 22, // Adjust as you like
                bold: seg.style === "bold" || seg.style === "bolditalic",
                italics: seg.style === "italic" || seg.style === "bolditalic",
              })
          );

          const leftIndent = getWordIndent(lineAfterBullets);

          paragraphs.push(
            new Paragraph({
              indent: { left: leftIndent },
              spacing: { after: 80 },
              children: runs,
            })
          );
        }

        const doc = new Document({
          styles: {
            default: {
              document: {
                run: {
                  font: "Aptos", // if installed, else fallback
                },
              },
            },
          },
          sections: [{ children: paragraphs }],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = uploadedFileName + ".docx";
        a.click();
      });

    // Hide interfering PowerPages elements
    window.addEventListener("load", () => {
      const masthead = document.querySelector(".masthead.d-none.d-md-block");
      const navbar = document.querySelector(
        ".navbar-expand-lg.header-navbar.navbar.navbar-default.static-top"
      );
      if (masthead) masthead.style.setProperty("display", "none", "important");
      if (navbar) navbar.style.setProperty("display", "none", "important");
    });
  });