const { jsPDF } = window.jspdf;

// Elements
const formInputs = document.querySelectorAll('input, textarea');
const addExperienceBtn = document.getElementById('addExperience');
const addEducationBtn = document.getElementById('addEducation');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');

let experienceCount = 1;
let educationCount = 1;

// Update preview on input
formInputs.forEach(input => {
    input.addEventListener('input', updateResumePreview);
});

// Add experience fields
addExperienceBtn.addEventListener('click', () => {
    experienceCount++;
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-item';
    newExperience.innerHTML = `
        <div class="form-group">
            <label for="jobTitle${experienceCount}">Job Title</label>
            <input type="text" id="jobTitle${experienceCount}" placeholder="Software Developer">
        </div>
        <div class="form-group">
            <label for="company${experienceCount}">Company</label>
            <input type="text" id="company${experienceCount}" placeholder="Tech Corp Inc.">
        </div>
        <div class="form-group">
            <label for="jobDate${experienceCount}">Date Range</label>
            <input type="text" id="jobDate${experienceCount}" placeholder="Jan 2020 - Present">
        </div>
        <div class="form-group">
            <label for="jobDesc${experienceCount}">Description</label>
            <textarea id="jobDesc${experienceCount}" placeholder="Describe your responsibilities and achievements..."></textarea>
        </div>
    `;
    document.getElementById('experienceFields').appendChild(newExperience);

    document.querySelectorAll(`#experienceFields #jobTitle${experienceCount}, 
                              #company${experienceCount}, 
                              #jobDate${experienceCount}, 
                              #jobDesc${experienceCount}`)
        .forEach(input => input.addEventListener('input', updateResumePreview));
});

// Add education fields
addEducationBtn.addEventListener('click', () => {
    educationCount++;
    const newEducation = document.createElement('div');
    newEducation.className = 'education-item';
    newEducation.innerHTML = `
        <div class="form-group">
            <label for="degree${educationCount}">Degree</label>
            <input type="text" id="degree${educationCount}" placeholder="Bachelor of Science in Computer Science">
        </div>
        <div class="form-group">
            <label for="institution${educationCount}">Institution</label>
            <input type="text" id="institution${educationCount}" placeholder="University of Technology">
        </div>
        <div class="form-group">
            <label for="eduDate${educationCount}">Date Range</label>
            <input type="text" id="eduDate${educationCount}" placeholder="2016 - 2020">
        </div>
    `;
    document.getElementById('educationFields').appendChild(newEducation);

    document.querySelectorAll(`#educationFields #degree${educationCount}, 
                              #institution${educationCount}, 
                              #eduDate${educationCount}`)
        .forEach(input => input.addEventListener('input', updateResumePreview));
});

// Clear form
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire form?')) {
        document.querySelectorAll('input, textarea').forEach(input => {
            if (input.id !== 'skills') {
                input.value = '';
            }
        });
        updateResumePreview();
    }
});

// Download PDF
downloadBtn.addEventListener('click', () => {
    const resumeElement = document.getElementById('resumePreview');

    const watermark = document.createElement('div');
    watermark.style.position = 'absolute';
    watermark.style.bottom = '10px';
    watermark.style.right = '10px';
    watermark.style.fontSize = '10px';
    watermark.style.color = 'rgba(0,0,0,0.2)';
    watermark.textContent = 'Generated with Professional Resume Builder';
    resumeElement.appendChild(watermark);

    html2canvas(resumeElement, {
        scale: 2,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY
    }).then(canvas => {
        resumeElement.removeChild(watermark);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        const marginX = (pdfWidth - finalWidth) / 2;
        const marginY = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);

        const name = document.getElementById('fullName').value.trim() || 'resume';
        const filename = name.toLowerCase().replace(/\s+/g, '-') + '-resume.pdf';
        pdf.save(filename);
    });
});

// Update preview
function updateResumePreview() {
    document.getElementById('previewName').textContent = document.getElementById('fullName').value || 'Your Name';
    document.getElementById('previewTitle').textContent = document.getElementById('jobTitle').value || 'Professional Title';
    document.getElementById('previewEmail').textContent = document.getElementById('email').value ? `Email: ${document.getElementById('email').value}` : 'Email: your.email@example.com';
    document.getElementById('previewPhone').textContent = document.getElementById('phone').value ? `Phone: ${document.getElementById('phone').value}` : 'Phone: (123) 456-7890';
    document.getElementById('previewAddress').textContent = document.getElementById('address').value ? `Address: ${document.getElementById('address').value}` : 'Address: 123 Main St, City';

    document.getElementById('previewSummary').textContent = document.getElementById('summary').value || 
        'Summarize your professional background, key skills, and career objectives here. Keep it concise and impactful.';

    const experienceContainer = document.getElementById('previewExperience');
    experienceContainer.innerHTML = '';
    for (let i = 1; i <= experienceCount; i++) {
        const jobTitle = document.getElementById(`jobTitle${i}`);
        if (jobTitle) {
            const company = document.getElementById(`company${i}`).value;
            const jobDate = document.getElementById(`jobDate${i}`).value;
            const jobDesc = document.getElementById(`jobDesc${i}`).value;

            if (jobTitle.value || company || jobDate || jobDesc) {
                const experienceItem = document.createElement('div');
                experienceItem.className = 'experience-item';
                experienceItem.innerHTML = `
                    <div class="item-header">
                        <span class="item-title">${jobTitle.value || 'Job Title'}</span>
                        <span class="item-date">${jobDate || 'Date Range'}</span>
                    </div>
                    ${company ? `<div class="item-subtitle">${company}</div>` : ''}
                    ${jobDesc ? `<p>${jobDesc.replace(/\n/g, '<br>')}</p>` : '<p>Describe your responsibilities and achievements.</p>'}
                `;
                experienceContainer.appendChild(experienceItem);
            }
        }
    }

    const educationContainer = document.getElementById('previewEducation');
    educationContainer.innerHTML = '';
    for (let i = 1; i <= educationCount; i++) {
        const degree = document.getElementById(`degree${i}`);
        if (degree) {
            const institution = document.getElementById(`institution${i}`).value;
            const eduDate = document.getElementById(`eduDate${i}`).value;

            if (degree.value || institution || eduDate) {
                const educationItem = document.createElement('div');
                educationItem.className = 'education-item';
                educationItem.innerHTML = `
                    <div class="item-header">
                        <span class="item-title">${degree.value || 'Degree'}</span>
                        <span class="item-date">${eduDate || 'Date Range'}</span>
                    </div>
                    ${institution ? `<div class="item-subtitle">${institution}</div>` : ''}
                `;
                educationContainer.appendChild(educationItem);
            }
        }
    }

    const skillsContainer = document.getElementById('previewSkills');
    skillsContainer.innerHTML = '';
    const skills = document.getElementById('skills').value;

    if (skills) {
        skills.split(',').forEach(skill => {
            const trimmedSkill = skill.trim();
            if (trimmedSkill) {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = trimmedSkill;
                skillsContainer.appendChild(skillTag);
            }
        });
    } else {
        ['JavaScript', 'HTML/CSS', 'Team Leadership'].forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsContainer.appendChild(skillTag);
        });
    }
}

// Initial load
updateResumePreview();
