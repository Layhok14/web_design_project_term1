class LabTracker {
    constructor() {
        this.totalQuestions = 5;
        this.num_tracked = document.getElementById('num-tracked');
        this.lab_progress_count = document.getElementById('lab-progress-count');
        this.answers = {};
        this.loadSavedAnswers();
        if (this.num_tracked && this.lab_progress_count) {
            this.inputListen();
            this.update();
        }
    }
    loadSavedAnswers() {
            const currentAnswers = JSON.parse(sessionStorage.getItem('currentAnswers'));
            if (currentAnswers && currentAnswers.lab) {
                this.answers = currentAnswers.lab;
            } else {
                const progress = JSON.parse(localStorage.getItem('quizProgress'));
                if (progress && progress.lab && progress.lab.answers) {
                    this.answers = progress.lab.answers;
                }
            }
            this.applySavedAnswers();
        
    }

    applySavedAnswers() {
        Object.keys(this.answers).forEach(answerId => {
            const answer = this.answers[answerId];
            if (answerId.startsWith('lab-input-')) {
                const textarea = document.getElementById(answerId);
                if (textarea) {
                    textarea.value = answer;
                }
            } else if (answerId.startsWith('lab-mcq-')) {
                const radio = document.querySelector(`input[name="${answerId}"][value="${answer}"]`);
                if (radio) {
                    radio.checked = true;
                    this.styleSelectedRadio(radio);
                }
            }
        });
    }
    styleSelectedRadio(radio){
        const label = radio.closest('label');
        if (label) {
            label.classList.add('border-[#CD29F6]', 'bg-purple-50');
        }
    }
    inputListen(){
        let textareas = document.querySelectorAll('textarea[id^="lab-input-q"]');
        textareas.forEach(textarea => {
            let timeout;
            textarea.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.answers[textarea.id] = textarea.value;
                    this.update();
                    QuizStatus.updateSectionProgress('lab', this.countAnswered(), this.answers);
                }, 500);
            });
            textarea.addEventListener('blur', () => {
                this.answers[textarea.id] = textarea.value;
                QuizStatus.updateSectionProgress('lab', this.countAnswered(), this.answers);
            });
        });
        let radios = document.querySelectorAll('input[name^="lab-mcq-"]');
        radios.forEach(radio => {
            if (!radio.value) {
                const spanText = radio.parentElement.querySelector('span');
                if (spanText) {
                    radio.value = spanText.textContent.trim();
                }
            }
            radio.addEventListener('change',()=>{
                this.answers[radio.name] = radio.value;
                this.updateRadioStyling(radio);
                this.update();
                QuizStatus.updateSectionProgress('lab', this.countAnswered(), this.answers);
            });
        });
    }

    updateRadioStyling(selectedRadio){
        let allOptions = document.querySelectorAll(`input[name="${selectedRadio.name}"]`);
        allOptions.forEach(option=>{
            let label = option.closest('label');
            if (label) {
                label.classList.remove('border-[#CD29F6]', 'bg-purple-50');
            }
        });
        let label = selectedRadio.closest('label');
        if (label) {
            label.classList.add('border-[#CD29F6]', 'bg-purple-50');
        }
    }

    countAnswered() {
        let answered = 0;
        const textareaKeys = Object.keys(this.answers).filter(key => key.startsWith('lab-input-q'));
        answered += textareaKeys.filter(key => this.answers[key] && this.answers[key].trim().length > 0).length;
        const radioKeys = ['lab-mcq-q4', 'lab-mcq-q5'];
        answered += radioKeys.filter(key => this.answers[key]).length;
        return answered;
    }

    update() {
        let answer_num = this.countAnswered();
        let progressPercent = (answer_num / this.totalQuestions) * 100;
        if (this.num_tracked) {
            this.num_tracked.innerHTML = '';
            let fill = document.createElement('div');
            fill.className = 'progress-fill h-full bg-[#CD29F6] rounded-full transition-all duration-300';
            fill.style.width = `${progressPercent}%`;
            this.num_tracked.appendChild(fill);
        }
        if (this.lab_progress_count) {
            this.lab_progress_count.textContent = `${answer_num}/${this.totalQuestions}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LabTracker();
});