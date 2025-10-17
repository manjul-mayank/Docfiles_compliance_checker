document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const uploadForm = document.getElementById('upload-form');
    const fileUpload = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name-display'); 
    const uploadBtn = document.getElementById('upload-btn'); 
    const uploadStatus = document.getElementById('upload-status');
    
    // Assessment/Report Elements
    const initialUploadMsg = document.getElementById('initial-upload-msg'); 
    const resultSection = document.getElementById('result-section');
    const assessedDocIdSpan = document.getElementById('assessed-doc-id');
    const assessedFilenameSpan = document.getElementById('assessed-filename');
    const assessBtn = document.getElementById('assess-btn');
    const assessmentStatus = document.getElementById('assessment-status');
    const reportViewer = document.getElementById('report-viewer');
    const aiReportContent = document.getElementById('ai-report-content');
    const issueCountSpan = document.getElementById('issue-count');
    const grammarIssuesList = document.getElementById('grammar-issues-list');
    const reportSummaryText = document.getElementById('report-summary-text');
    const initialReportMsg = document.getElementById('initial-report-msg'); 
    
    // Modification Elements
    const instructionTextarea = document.getElementById('instruction');
    const modifyBtn = document.getElementById('modify-btn');
    const modificationStatus = document.getElementById('modification-status');
    const downloadArea = document.getElementById('download-area');
    const downloadLink = document.getElementById('download-link');
    
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');

    let currentDocId = null;

    // --- INITIAL STATE SETUP ---
    // Make sure these elements exist before trying to access disabled property
    if (assessBtn) assessBtn.disabled = true;
    if (modifyBtn) modifyBtn.disabled = true;
    if (uploadBtn) uploadBtn.disabled = true; // Initially disable upload until a file is selected

    // --- UTILITY FUNCTIONS ---

    /** Shows the global loading overlay with custom text */
    function showLoading(text = 'PROCESSING DATAFRAME...') { // AI themed default text
        if (loadingText && loadingOverlay) {
            loadingText.textContent = text;
            loadingOverlay.classList.remove('hidden');
        }
    }

    /** Hides the global loading overlay */
    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    /** Displays a formatted status message */
    function displayStatus(element, message, type) {
        if (element) {
            element.className = `alert alert-${type}`; 
            element.textContent = message;
            element.classList.remove('hidden');
        }
    }

    /** Resets the results sections */
    function resetResults() {
        if (resultSection) resultSection.classList.add('hidden');
        if (reportViewer) reportViewer.classList.add('hidden');
        if (initialReportMsg) initialReportMsg.classList.remove('hidden');
        if (assessmentStatus) assessmentStatus.classList.add('hidden');
        if (modificationStatus) modificationStatus.classList.add('hidden');
        if (downloadArea) downloadArea.classList.add('hidden');

        // Clear previous report content
        if (aiReportContent) aiReportContent.textContent = '';
        if (grammarIssuesList) grammarIssuesList.innerHTML = '<li>NO CRITICAL ANOMALIES DETECTED. SYSTEM OPTIMAL.</li>'; // AI themed default
        if (reportSummaryText) reportSummaryText.textContent = '';
        if (instructionTextarea) instructionTextarea.value = '';

        if (assessBtn) assessBtn.disabled = true;
        if (modifyBtn) modifyBtn.disabled = true;
    }

    // --- STEP 1: UPLOAD HANDLER ---
    
    if (fileUpload) {
        fileUpload.addEventListener('change', () => {
            const file = fileUpload.files[0];
            if (file && fileNameDisplay) {
                fileNameDisplay.innerHTML = `<i class="fas fa-file-alt"></i> DATASTREAM SELECTED: ${file.name.toUpperCase()}`; // Updated text
                displayStatus(uploadStatus, `DATASTREAM SELECTED: ${file.name.toUpperCase()}`, 'info');
                if (uploadBtn) uploadBtn.disabled = false; 
            } else if (fileNameDisplay) {
                // This is the updated default text for when no file is selected
                fileNameDisplay.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> CLICK TO INITIATE UPLOAD`; 
                if (uploadStatus) uploadStatus.classList.add('hidden');
                if (uploadBtn) uploadBtn.disabled = true; 
            }
        });
    }
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const file = fileUpload && fileUpload.files ? fileUpload.files[0] : null;
            if (!file) {
                displayStatus(uploadStatus, '❌ ERROR: NO DATASTREAM DETECTED.', 'danger'); 
                return;
            }

            resetResults(); 
            showLoading('UPLOADING DATASTREAM...');
            
            const formData = new FormData();
            formData.append('file', file);
            
            const guidelinesElement = document.getElementById('guidelines');
            formData.append('guidelines', guidelinesElement ? guidelinesElement.value : '');

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value }
                });

                const result = await response.json();

                if (response.ok) {
                    currentDocId = result.doc_id;
                    
                    if (assessedDocIdSpan) assessedDocIdSpan.textContent = `[ID: ${currentDocId.substring(0, 8)}...]`; 
                    if (assessedFilenameSpan) assessedFilenameSpan.textContent = result.filename.toUpperCase();
                    if (resultSection) resultSection.classList.remove('hidden'); 
                    if (initialUploadMsg) initialUploadMsg.classList.add('hidden'); 

                    displayStatus(uploadStatus, `✅ DATASTREAM UPLOAD SUCCESSFUL. IDENTIFIER: ${currentDocId.substring(0, 8)}`, 'success');
                    
                    if (assessBtn) assessBtn.disabled = false; 
                } else {
                    displayStatus(uploadStatus, `❌ UPLOAD FAILED: ${result.detail || 'SERVER ERROR'}`, 'danger');
                }
            } catch (error) {
                displayStatus(uploadStatus, `❌ NETWORK ERROR: ${error.message.toUpperCase()}`, 'danger');
                console.error("Upload Error:", error);
            } finally {
                hideLoading();
            }
        });
    }
    
    // --- STEP 2: ASSESSMENT HANDLER ---

    if (assessBtn) {
        assessBtn.addEventListener('click', async () => {
            if (!currentDocId) {
                displayStatus(assessmentStatus, '❌ ERROR: NO ACTIVE DATASTREAM FOR SCAN.', 'danger');
                return;
            }

            showLoading('INITIATING NEURAL NETWORK ANALYTIC SCAN...');
            if (reportViewer) reportViewer.classList.add('hidden');
            if (initialReportMsg) initialReportMsg.classList.remove('hidden');
            if (modificationStatus) modificationStatus.classList.add('hidden');
            if (downloadArea) downloadArea.classList.add('hidden');
            
            try {
                const response = await fetch(`/assess/${currentDocId}`, {
                    method: 'POST',
                    headers: { 
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value 
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    const report = result.report;
                    
                    displayStatus(assessmentStatus, '✅ ANALYTIC SCAN COMPLETE. REPORT GENERATED.', 'success');
                    
                    const aiContent = report.ai_report || "NO NEURAL NETWORK DIAGNOSIS AVAILABLE.";
                    if (aiReportContent) aiReportContent.textContent = aiContent;
                    
                    const grammar = report.grammar;
                    if (issueCountSpan) issueCountSpan.textContent = grammar.issue_count;
                    
                    if (grammarIssuesList) {
                        grammarIssuesList.innerHTML = ''; 

                        if (grammar.issues && grammar.issues.length > 0) {
                            grammar.issues.forEach(issue => {
                                const li = document.createElement('li');
                                li.innerHTML = `<strong>ANOMALY:</strong> ${issue.message.toUpperCase()}<br>
                                            <strong>CONTEXT:</strong> ${issue.context.toUpperCase()}<br>
                                            <strong>SUGGESTIONS:</strong> ${issue.replacements.map(r => r.toUpperCase()).join(', ') || 'N/A'}`;
                                grammarIssuesList.appendChild(li);
                            });
                        } else {
                            grammarIssuesList.innerHTML = '<li>NO CRITICAL ANOMALIES DETECTED. SYSTEM OPTIMAL.</li>';
                        }
                    }
                    
                    if (reportSummaryText) reportSummaryText.textContent = (report.summary || "COMPLIANCE REPORT GENERATED").toUpperCase();

                    if (reportViewer) reportViewer.classList.remove('hidden');
                    if (initialReportMsg) initialReportMsg.classList.add('hidden'); 

                    if (modifyBtn) modifyBtn.disabled = false; 
                } else {
                    displayStatus(assessmentStatus, `❌ ANALYTIC SCAN FAILED: ${result.detail || 'SERVER ERROR'}`, 'danger');
                }
            } catch (error) {
                displayStatus(assessmentStatus, `❌ NETWORK ERROR: ${error.message.toUpperCase()}`, 'danger');
                console.error("Assessment Error:", error);
            } finally {
                hideLoading();
            }
        });
    }


    // --- STEP 3: MODIFICATION HANDLER ---

    if (modifyBtn) {
        modifyBtn.addEventListener('click', async (e) => {
            e.preventDefault(); 
            
            const instruction = instructionTextarea ? instructionTextarea.value.trim() : '';
            
            if (!currentDocId) {
                displayStatus(modificationStatus, '❌ ERROR: NO ACTIVE DATASTREAM FOR OPTIMIZATION.', 'danger');
                return;
            }
            
            if (!instruction) {
                displayStatus(modificationStatus, '❌ ERROR: OPTIMIZATION DIRECTIVE REQUIRED.', 'danger');
                return;
            }

            showLoading('APPLYING AUTONOMOUS OPTIMIZATION...');
            if (downloadArea) downloadArea.classList.add('hidden');

            try {
                const response = await fetch('/modify', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: JSON.stringify({
                        doc_id: currentDocId,
                        instruction: instruction,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    const downloadUrl = result.download_endpoint;
                    const filename = (result.filename || "OPTIMIZED_DATA").toUpperCase();
                    
                    displayStatus(modificationStatus, `✅ DATASTREAM OPTIMIZED. READY FOR EXTRACTION: ${filename}`, 'success');
                    
                    if (downloadLink) {
                        downloadLink.href = downloadUrl;
                        downloadLink.textContent = `DOWNLOAD ${filename}`;
                    }
                    if (downloadArea) downloadArea.classList.remove('hidden');
                    
                } else {
                    displayStatus(modificationStatus, `❌ OPTIMIZATION FAILED: ${result.detail || 'SERVER ERROR'}`, 'danger');
                }
            } catch (error) {
                displayStatus(modificationStatus, `❌ NETWORK ERROR: ${error.message.toUpperCase()}`, 'danger');
                console.error("Modification Error:", error);
            } finally {
                hideLoading();
            }
        });
    }
});