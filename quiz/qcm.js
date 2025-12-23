class MCQTracker {
    constructor() {
        this.totalQuestions = 5;
        this.num_tracked = document.getElementById('num-tracked');
        this.qcm_count = document.getElementById('qcm-count');
        this.answers = {};
        this.loadSavedAnswers();
        if (this.num_tracked && this.qcm_count) {
            this.choiceListen();
            this.update();
        }
    }

    loadSavedAnswers(){
            const currentAnswers = JSON.parse(sessionStorage.getItem('currentAnswers'));
            if (currentAnswers && currentAnswers.mcq) {
                this.answers = currentAnswers.mcq;
            } else {
                const progress = JSON.parse(localStorage.getItem('quizProgress'));
                if (progress && progress.mcq && progress.mcq.answers) {
                    this.answers = progress.mcq.answers;
                }
            }
            this.applySavedAnswers();
       
    }

    applySavedAnswers() {
        Object.keys(this.answers).forEach(questionName => {
            const answer = this.answers[questionName];
            const radio = document.querySelector(`input[name="${questionName}"][value="${answer}"]`);
            if (radio) {
                radio.checked = true;
                this.styleSelectedOption(radio);
            }
        });
    }

    choiceListen() {
        let radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            if (!radio.value) {
                radio.value = radio.parentElement.querySelector('div:nth-child(2)').textContent.trim();
            }
            radio.addEventListener('change', () => {
                this.answers[radio.name] = radio.value;
                this.updateOptionStyling(radio);
                this.update();
                QuizStatus.updateSectionProgress('mcq', this.countAnswered(), this.answers);
            });
        });
        this.update();
    }

    updateOptionStyling(selectedRadio) {
        let allOptions = document.querySelectorAll(`input[name="${selectedRadio.name}"]`);
        allOptions.forEach(option => {
            let label = option.closest('label');
            if (label) {
                label.classList.remove('border-[#F97316]', 'bg-orange-50');
                let circle = label.querySelector('div:first-child');
                if (circle) {
                    circle.classList.remove('bg-[#F97316]', 'text-white');
                    circle.classList.add('border-gray-300', 'text-gray-500');
                }
            }
        });
        let label = selectedRadio.closest('label');
        if (label) {
            label.classList.add('border-[#F97316]', 'bg-orange-50');
            let circle = label.querySelector('div:first-child');
            if (circle) {
                circle.classList.add('bg-[#F97316]', 'text-white');
                circle.classList.remove('border-gray-300', 'text-gray-500');
            }
        }
    }
    styleSelectedOption(radio) {
        let label = radio.closest('label');
        if (label) {
            label.classList.add('border-[#F97316]', 'bg-orange-50');
            let circle = label.querySelector('div:first-child');
            if (circle) {
                circle.classList.add('bg-[#F97316]', 'text-white');
                circle.classList.remove('border-gray-300', 'text-gray-500');
            }
        }
    }
    countAnswered() {
        return Object.keys(this.answers).length;
    }
    update(){
        let answer_num =this.countAnswered();
        let progressPercent =(answer_num / this.totalQuestions)*100;
        if (this.num_tracked){
            this.num_tracked.innerHTML = '';
            let fill = document.createElement('div');
            fill.className = 'progress-fill h-full bg-[#F97316] rounded-full transition-all duration-300';
            fill.style.width = `${progressPercent}%`;
            this.num_tracked.appendChild(fill);
        }       
        if (this.qcm_count) {
            this.qcm_count.textContent = `${answer_num}/${this.totalQuestions}`;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new MCQTracker();
});